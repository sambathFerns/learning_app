import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Admin from "./Admin/admin";
import "./App.js";
import Live from "./Pages/Lives/Live";
import PrivateRoutes from "./routes/PrivateRoutes";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/classes" element={<Home />} exact />

          <Route path="/" element={<Login />} exact />
          <Route path="/admin" element={<Admin />} exact />
          <Route path="/live" element={<Live />} exact />
        </Routes>
      </Router>
    </>
  );
}

export default App;
