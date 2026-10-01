import { useEffect, useRef, useState } from "react";

import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

const FaceEmotion = () => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [faceDetected, setFaceDetected] = useState(false);
    const [emotion, setEmotion] = useState("Neutral");

    // --------------------------------------------------
    // INITIALIZE MEDIAPIPE
    // --------------------------------------------------

    useEffect(() => {

        async function initializeFaceLandmarker() {

            try {

                const vision =
                    await FilesetResolver.forVisionTasks(
                        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                    );

                const faceLandmarker =
                    await FaceLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
                            },

                            runningMode: "VIDEO",

                            numFaces: 1,

                            minFaceDetectionConfidence: 0.5,

                            minFacePresenceConfidence: 0.5,

                            minTrackingConfidence: 0.5,

                            outputFaceBlendshapes: true,

                            outputFacialTransformationMatrixes: true
                        }
                    );

                landmarkerRef.current = faceLandmarker;

                setLoading(false);

                startCamera();

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to initialize MediaPipe Face Landmarker."
                );

                setLoading(false);
            }
        }

        initializeFaceLandmarker();


        // Cleanup

        return () => {

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (videoRef.current?.srcObject) {

                videoRef.current.srcObject
                    .getTracks()
                    .forEach(track => track.stop());
            }

            landmarkerRef.current?.close();
        };

    }, []);


    // --------------------------------------------------
    // START CAMERA
    // --------------------------------------------------

    async function startCamera() {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 640,
                        height: 480,
                        facingMode: "user"
                    },

                    audio: false
                });

            videoRef.current.srcObject = stream;

            videoRef.current.onloadeddata = () => {

                detectFace();

            };

        } catch (error) {

            console.error(error);

            setError(
                "Camera permission denied or camera is unavailable."
            );
        }
    }


    // --------------------------------------------------
    // DETECT FACE
    // --------------------------------------------------

    function detectFace() {

        const video = videoRef.current;

        const canvas = canvasRef.current;

        const landmarker = landmarkerRef.current;


        if (!video || !canvas || !landmarker) {
            return;
        }


        const ctx = canvas.getContext("2d");


        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;


        // --------------------------------------------------
        // RUN MEDIAPIPE
        // --------------------------------------------------

        const result =
            landmarker.detectForVideo(
                video,
                performance.now()
            );


        // Clear previous drawing

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // --------------------------------------------------
        // NO FACE
        // --------------------------------------------------

        if (
            !result.faceLandmarks ||
            result.faceLandmarks.length === 0
        ) {

            setFaceDetected(false);

            setEmotion("No face");

            animationRef.current =
                requestAnimationFrame(detectFace);

            return;
        }


        // --------------------------------------------------
        // FACE FOUND
        // --------------------------------------------------

        setFaceDetected(true);


        const landmarks =
            result.faceLandmarks[0];


        // --------------------------------------------------
        // DRAW FACE LANDMARKS
        // --------------------------------------------------

        ctx.fillStyle = "#00ff00";


        landmarks.forEach((point) => {

            const x =
                point.x * canvas.width;

            const y =
                point.y * canvas.height;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });


        // --------------------------------------------------
        // GET BLENDSHAPES
        // --------------------------------------------------

        const blendshapes =
            result.faceBlendshapes?.[0]?.categories;


        if (!blendshapes) {

            animationRef.current =
                requestAnimationFrame(detectFace);

            return;
        }


        // Convert blendshapes into easy object

        const expressions = {};

        blendshapes.forEach((item) => {

            expressions[item.categoryName] =
                item.score;

        });


        // --------------------------------------------------
        // GET EXPRESSION SCORES
        // --------------------------------------------------

        const smileLeft =
            expressions.mouthSmileLeft || 0;

        const smileRight =
            expressions.mouthSmileRight || 0;


        const frownLeft =
            expressions.mouthFrownLeft || 0;

        const frownRight =
            expressions.mouthFrownRight || 0;


        const jawOpen =
            expressions.jawOpen || 0;


        const eyeWideLeft =
            expressions.eyeWideLeft || 0;

        const eyeWideRight =
            expressions.eyeWideRight || 0;


        const browUpLeft =
            expressions.browOuterUpLeft || 0;

        const browUpRight =
            expressions.browOuterUpRight || 0;


        const browDownLeft =
            expressions.browDownLeft || 0;

        const browDownRight =
            expressions.browDownRight || 0;


        // --------------------------------------------------
        // CALCULATE EXPRESSION SCORES
        // --------------------------------------------------

        const smile =
            (smileLeft + smileRight) / 2;


        const frown =
            (frownLeft + frownRight) / 2;


        const eyesWide =
            (eyeWideLeft + eyeWideRight) / 2;


        const browsUp =
            (browUpLeft + browUpRight) / 2;


        const browsDown =
            (browDownLeft + browDownRight) / 2;


        // --------------------------------------------------
        // DETERMINE EXPRESSION
        // --------------------------------------------------

        let detectedEmotion = "Neutral";


        // HAPPY

        if (smile > 0.45) {

            detectedEmotion = "Happy";

        }


        // SURPRISED

        else if (
            jawOpen > 0.35 &&
            eyesWide > 0.25 &&
            browsUp > 0.20
        ) {

            detectedEmotion = "Surprised";

        }


        // SAD

        else if (frown > 0.30) {

            detectedEmotion = "Sad";

        }


        // ANGRY

        else if (browsDown > 0.35) {

            detectedEmotion = "Angry";

        }


        // NEUTRAL

        else {

            detectedEmotion = "Neutral";

        }


        setEmotion(detectedEmotion);


        // --------------------------------------------------
        // DRAW EMOTION
        // --------------------------------------------------

        ctx.fillStyle = "#00ff00";

        ctx.font = "bold 24px Arial";


        ctx.fillText(
            detectedEmotion,
            20,
            35
        );


        // --------------------------------------------------
        // NEXT FRAME
        // --------------------------------------------------

        animationRef.current =
            requestAnimationFrame(detectFace);
    }


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <h1>
                    Loading MediaPipe...
                </h1>

            </main>
        );
    }


    // --------------------------------------------------
    // ERROR
    // --------------------------------------------------

    if (error) {

        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <h2>
                    {error}
                </h2>

            </main>
        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px"
            }}
        >

            <h1>
                Face Emotion Detection
            </h1>


            <h2>
                {faceDetected
                    ? `Expression: ${emotion}`
                    : "No face detected"
                }
            </h2>


            <div
                style={{
                    position: "relative",
                    width: "640px",
                    maxWidth: "90vw"
                }}
            >

                {/* CAMERA */}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        width: "100%",
                        display: "block",
                        transform: "scaleX(-1)"
                    }}
                />


                {/* LANDMARK CANVAS */}

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        transform: "scaleX(-1)",
                        pointerEvents: "none"
                    }}
                />

            </div>


            <div>

                <p>
                    Face detected:{" "}
                    {faceDetected ? "Yes" : "No"}
                </p>

                <p>
                    Current expression:{" "}
                    <strong>{emotion}</strong>
                </p>

            </div>

        </main>
    );
};

export default FaceEmotion;