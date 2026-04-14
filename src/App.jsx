import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route path="/" element={
          <ProtectedRoute><Dashboard/></ProtectedRoute>
        }/>

        <Route path="/settings" element={
          <ProtectedRoute><Settings/></ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}