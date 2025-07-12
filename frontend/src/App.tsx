import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./app/user/profile";
import Signup from "./app/user/signup";
import Home from "./app/user/Home";
import Login from "./app/user/login";
import ForgotPassword from "./app/user/forgot_password";
import OTPVerification from "./app/user/verify_otp";
import ResetPassword from "./app/user/change_password";
import UserProfilePage from "./app/user/swap_deatail";
import SwapRequestsPage from "./app/user/swap_requests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/swap-detail/:id" element={<UserProfilePage />} />
        <Route path="/requests" element={<SwapRequestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
