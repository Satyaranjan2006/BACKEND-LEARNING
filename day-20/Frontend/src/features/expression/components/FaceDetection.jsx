import { useEffect, useRef, useState } from "react";
import {
    FaceDetector,
    FilesetResolver
} from "@mediapipe/tasks-vision";

const FaceDetection = () => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const detectorRef = useRef(null);
    const animationRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [faceCount, setFaceCount] = useState(0);
    const [error, setError] = useState("");

    // -----------------------------
    // 1. Initialize MediaPipe
    // -----------------------------
    useEffect(() => {

        async function initializeDetector() {

            try {

                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const detector = await FaceDetector.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath:
                                "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
                        },

                        runningMode: "VIDEO",

                        minDetectionConfidence: 0.5,

                        minSuppressionThreshold: 0.3,

                        numFaces: 5
                    }
                );

                detectorRef.current = detector;

                setLoading(false);

                startCamera();

            } catch (err) {

                console.error(err);

                setError("Failed to initialize face detector");

                setLoading(false);
            }
        }

        initializeDetector();

        return () => {

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (videoRef.current?.srcObject) {

                videoRef.current.srcObject
                    .getTracks()
                    .forEach(track => track.stop());
            }

            detectorRef.current?.close();
        };

    }, []);


    // -----------------------------
    // 2. Start webcam
    // -----------------------------
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

                detectFaces();

            };

        } catch (err) {

            console.error(err);

            setError(
                "Camera permission denied or camera is unavailable."
            );
        }
    }


    // -----------------------------
    // 3. Detect faces
    // -----------------------------
    function detectFaces() {

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const detector = detectorRef.current;

        if (!video || !canvas || !detector) {
            return;
        }

        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const currentTime = performance.now();

        const result = detector.detectForVideo(
            video,
            currentTime
        );

        // Clear previous drawings

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // -----------------------------
        // 4. Process detected faces
        // -----------------------------

        const detections = result.detections || [];

        setFaceCount(detections.length);


        detections.forEach((detection) => {

            const box = detection.boundingBox;

            if (!box) {
                return;
            }

            const x = box.originX;
            const y = box.originY;

            const width = box.width;
            const height = box.height;


            // Draw face rectangle

            ctx.strokeStyle = "#00ff00";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                x,
                y,
                width,
                height
            );


            // -----------------------------
            // Draw label
            // -----------------------------

            ctx.fillStyle = "#00ff00";

            ctx.font = "18px Arial";

            ctx.fillText(
                "Face",
                x,
                y > 25 ? y - 8 : y + 20
            );


            // -----------------------------
            // Draw keypoints
            // -----------------------------

            const keypoints = detection.keypoints || [];

            keypoints.forEach((point) => {

                const px = point.x * canvas.width;
                const py = point.y * canvas.height;

                ctx.beginPath();

                ctx.arc(
                    px,
                    py,
                    3,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "#ff0000";

                ctx.fill();
            });

        });


        // Continue detection

        animationRef.current =
            requestAnimationFrame(detectFaces);
    }


    // -----------------------------
    // UI
    // -----------------------------

    if (loading) {

        return (
            <div>
                <h2>Loading Face Detector...</h2>
            </div>
        );
    }


    if (error) {

        return (
            <div>
                <h2>{error}</h2>
            </div>
        );
    }


    return (

        <div
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
                MediaPipe Face Detection
            </h1>


            <h2>

                {faceCount === 0
                    ? "No face detected"
                    : `${faceCount} face${faceCount > 1 ? "s" : ""} detected`
                }

            </h2>


            {/* Camera + Canvas */}

            <div
                style={{
                    position: "relative",
                    width: "640px",
                    maxWidth: "90vw"
                }}
            >

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


            <p>
                Move your face in front of the camera.
            </p>

        </div>
    );
};

export default FaceDetection;