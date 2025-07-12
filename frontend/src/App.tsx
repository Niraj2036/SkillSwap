import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./app/user/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<div className="flex min-h-svh flex-col items-center justify-center"><h1>Welcome to SkillSwap!</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
