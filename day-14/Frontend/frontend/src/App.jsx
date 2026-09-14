import { RouterProvider } from "react-router"
import './style.scss'

import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/auth.context";
import { PostContextProvider } from "./features/post/post.context";

function App() {


  return (
    <AuthProvider>
      <PostContextProvider>
        <AppRoutes />
      </PostContextProvider>
      
    </AuthProvider>

  )
}

export default App
