import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import App from './App.jsx'
// import Editar, { loader as noteLoader} from './components/Editar'
// import './index.css'

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
//   {
//     path: "edit/:noteId",
//     element: <Editar />,
//     loader: noteLoader,
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// )