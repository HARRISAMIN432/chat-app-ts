import type React from "react";
import { Route, Routes } from "react-router";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import { Toaster } from "sonner";
import { PrivateRoute } from "./pages/PageGuards";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
