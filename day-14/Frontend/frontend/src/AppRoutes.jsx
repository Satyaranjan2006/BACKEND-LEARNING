// import {BrowserRouter} from 'react-router'
// import { createBrowserRouter } from 'react-router'
// import React from 'react'
// import Login from './features/auth/pages/Login'
// import Register from './features/auth/pages/Register'

//  export const routes=createBrowserRouter([
//     {
//         path:'/login',
//         element:React.createElement(Login),
//     },
//     {
//         path:'/register',
//         element:React.createElement(Register),
//     }
// ])

import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import {BrowserRouter,Route,Routes} from 'react-router'
import React from 'react'
import Welcome from './features/auth/pages/Welcome'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/'  element={<Welcome/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
