import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import FaceDetection from './features/expression/components/FaceDetection'
import FaceEmotion from './features/expression/components/FaceEmotion'

function App() {
  const [count, setCount] = useState(0)

  return (
    // <FaceDetection/>
    <FaceEmotion/>
  )
}

export default App
