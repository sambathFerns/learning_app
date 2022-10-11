import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import "./App.js"

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route path="/login" element={<Login />} exact />
          <Route path="/" element={<Home />} exact />
        </Routes>
      </Router>
    </>
  );
}

export default App;
