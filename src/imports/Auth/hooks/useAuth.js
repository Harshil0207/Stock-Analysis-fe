"use client";

import { useState, useEffect } from "react";
import {
  registerApi,
  loginApi,
  verifyRegisterOtpApi,
  verifyLoginOtpApi,
  resendOtpApi,
} from "../api/auth.js";

export function useAuth(initialMode = "login") {
  const [mode, setMode] = useState(initialMode); // "register" or "login"
  const [step, setStep] = useState("form"); // "form" or "otp" or "success"

  // Forms state
  const [regForm, setRegForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });
  const [loginEmail, setLoginEmail] = useState("");

  // OTP state
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handle Input Changes
  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleToggleMode = () => {
    setError("");
    setSuccess("");
    setMode((prev) => (prev === "register" ? "login" : "register"));
    setStep("form");
  };

  // Submit main registration or login form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "register") {
        await registerApi(regForm);
        setSuccess("Secure registration OTP transmitted. Check your inbox.");
      } else {
        await loginApi(loginEmail);
        setSuccess("Secure session OTP transmitted. Check your inbox.");
      }
      setResendCooldown(30);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Digit Input Control
  const handleOtpChange = (target, index) => {
    const val = target.value;
    if (isNaN(val)) return;

    const newOtp = [...otpArray];
    newOtp[index] = val;
    setOtpArray(newOtp);

    // Auto-focus next field
    if (val !== "" && target.nextSibling) {
      target.nextSibling.focus();
    }

    // Auto submit if all 6 digits are filled
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      triggerOtpSubmit(fullOtp);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Verify OTP Helper
  const triggerOtpSubmit = async (otp) => {
    setLoading(true);
    setError("");

    try {
      const email = mode === "register" ? regForm.email : loginEmail;
      let data;
      if (mode === "register") {
        data = await verifyRegisterOtpApi(email, otp);
      } else {
        data = await verifyLoginOtpApi(email, otp);
      }

      setUserProfile(data.data.user);
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otp = otpArray.join("");
    if (otp.length < 6) {
      setError("Please complete all 6 digits.");
      return;
    }
    await triggerOtpSubmit(otp);
  };

  // Resend OTP Code
  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = mode === "register" ? regForm.email : loginEmail;
      const purpose = mode === "register" ? "REGISTER" : "LOGIN";

      await resendOtpApi(email, purpose);
      setSuccess("A fresh transaction code was sent successfully.");
      setOtpArray(new Array(6).fill(""));
      setResendCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    step,
    regForm,
    loginEmail,
    otpArray,
    resendCooldown,
    loading,
    error,
    success,
    userProfile,
    setStep,
    setLoginEmail,
    handleRegChange,
    handleToggleMode,
    handleFormSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpSubmit,
    handleResend,
  };
}
