import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route to="/" element={<Home />} />
        <Route to="/about" element={<About />} />
        <Route to="/profile" element={<Profile />} />
        <Route to="/sign-in" element={<SignIn />} />
        <Route to="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
