import type React from "react"
import { Route, Routes } from "react-router"
import Auth from "./pages/Auth/Auth"
import Chat from "./pages/Chat/Chat"
import {Toaster} from 'sonner'

const App : React.FC = () => {

  return (
    <>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Chat />} />
    </Routes>
    <Toaster />
    </>
     
  )
}

export default App
