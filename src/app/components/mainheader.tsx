"use client";

import React, { useState, useEffect } from "react";
import { Menu, User, LogIn, UserPlus, Lock } from "lucide-react";
import FullPageLoader from "./FullPageLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DecorationEventApp = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false); // NEW: Track regular user login
  const [userName, setUserName] = useState(""); // NEW: Store user name
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const router = useRouter();

  // Auth form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" });
  const [resetPasswordData, setResetPasswordData] = useState({ 
    token: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [resetToken, setResetToken] = useState("");

  // Check for reset token in URL on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        setResetToken(token);
        setShowResetPasswordForm(true);
      }
    }
  }, []);

  // ✅ Restore user/admin status on page load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
          // Verify if token is still valid
          const verifyRes = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (verifyData.role === "admin") {
              setIsAdmin(true);
              setIsUser(false);
              setUserName(verifyData.name || "Admin");
              console.log("Admin session restored");
            } else if (verifyData.role === "user") {
              setIsUser(true);
              setIsAdmin(false);
              setUserName(verifyData.name || "User");
              console.log("User session restored");
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
            setIsAdmin(false);
            setIsUser(false);
            setUserName("");
          }
        }
      } catch (error) {
        console.error("Error restoring user status:", error);
        localStorage.removeItem("token");
        setIsAdmin(false);
        setIsUser(false);
        setUserName("");
      }
    };

    checkUserStatus();
  }, []);

  // ✅ FIXED: Proper Signup Handler that matches your API
  const handleSignup = async () => {
    setSignupError("");
    setSignupSuccess("");

    // Validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setSignupError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupError("Please enter a valid email address");
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters long");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    setPageLoading(true);
    
    try {
      // Call your signup API endpoint - matches your API structure
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess("Account created successfully! You can now login.");
        
        // Clear form
        setSignupData({ 
          name: "", 
          email: "", 
          password: "", 
          confirmPassword: "", 
        });
        
        // Auto-close after 2 seconds and show login
        setTimeout(() => {
          setShowSignupForm(false);
          setShowLoginForm(true);
          setSignupSuccess("");
        }, 2000);
        
      } else {
        setSignupError(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("Network error. Please check your connection and try again.");
    } finally {
      setPageLoading(false);
    }
  };

  // ✅ Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!forgotPasswordData.email) {
      alert("Please enter your email address");
      return;
    }

    setPageLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowForgotPasswordForm(false);
        setForgotPasswordData({ email: "" });
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Failed to send reset link. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  // ✅ Reset Password Handler
  const handleResetPassword = async () => {
    if (!resetPasswordData.password || !resetPasswordData.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (resetPasswordData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setPageLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: resetToken || resetPasswordData.token,
          password: resetPasswordData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowResetPasswordForm(false);
        setResetPasswordData({ token: "", password: "", confirmPassword: "" });
        setResetToken("");
        router.push("/");
        
        // Redirect to login
        setShowLoginForm(true);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Failed to reset password. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  // ✅ Login function to persist user/admin status
  async function loginAndCheckRole(email: string, password: string) {
    try {
      // Step 1️⃣ — Login and get token
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      if (!loginData.token) {
        console.error("Login failed:", loginData.error || loginData.message);
        return null;
      }

      // Save token locally
      localStorage.setItem("token", loginData.token);
      if (loginData.name) {
        localStorage.setItem("userName", loginData.name);
      }

      // Step 2️⃣ — Verify token to get role
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: loginData.token }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.error("Token verification failed:", verifyData.error);
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        return null;
      }

      // Step 3️⃣ — Return combined result
      console.log(`Welcome ${verifyData.role === "admin" ? "Admin" : "User"}!`);
 
      return {
        token: loginData.token,
        userId: verifyData.userId,
        role: verifyData.role,
        name: verifyData.name || "User"
      };

    } catch (err) {
      console.error("Error:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      return null;
    }
  }

  // ✅ Login handler
  const handleLogin = async () => {
    setPageLoading(true);
    if (!loginData.email || !loginData.password) {
      alert("Please fill in all fields");
      setPageLoading(false);
      return;
    }

    const result = await loginAndCheckRole(loginData.email, loginData.password);

    if (result) {
      if (result.role === "admin") {
        setIsAdmin(true);
        setIsUser(false);
        setUserName(result.name);
        setShowLoginForm(false);
        setLoginData({ email: "", password: "" });
        location.reload();
                alert("Login successful! Admin mode activated.");

        setPageLoading(false);
      } else {
        setIsUser(true);
        setIsAdmin(false);
        setUserName(result.name);
        setShowLoginForm(false);
        setLoginData({ email: "", password: "" });
        alert("User login successful!");
        window.location.reload();
        setPageLoading(false);
      }
    } else {
      alert("Login failed. Please check your credentials.");
      setPageLoading(false);
    }
  };

  // ✅ Proper Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAdmin(false);
    setIsUser(false);
    setUserName("");
    window.location.reload();
        console.log("Logged out successfully!");

  };

  // Check if token is expired
  function checkToken() {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        // Decode the token without verifying signature
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          console.log("Token expired, logging out...");
          logout();
        }
      } catch (error) {
        // If token is invalid, logout
        logout();
      }
    }
  }

  if (pageLoading) {
    return <FullPageLoader />;
  }

  const navLinks = [
    { name: "Home", href: "/#" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="bg-white backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/navlogo.png"
                alt="JoycDecor Logo"
                width={106}
                height={26}
                className="object-contain md:w-[106px] w-26"
                priority
              />
              <div className="sm:block hidden">
                <h1 className="text-sm font-serif font-bold text-gray-800">
                  Premium 
                </h1>
                <p className="text-sm font-serif font-bold text-amber-600">
                  Event Decorations 
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center md:space-x-3 lg:space-x-8">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-black hover:text-amber-600 md:font-small lg:font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Desktop / Tablet Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {!isAdmin && !isUser ? (
                // Show Login/Signup when no one is logged in
                <>
                  <button
                    onClick={() => setShowLoginForm(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-1.5 md:px-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center text-xs md:text-sm lg:text-sm"
                  >
                    <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                    Login
                  </button>

                  <button
                    onClick={() => setShowSignupForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1.5 md:px-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center text-xs md:text-sm lg:text-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                    Sign Up
                  </button>
                </>
              ) : (
                // Show Admin/User profile with Logout when logged in
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (isAdmin) {
                          setShowAddForm(true);
                        } else {
                          // For regular user, maybe show a user profile modal
                          alert(`Welcome ${userName}! This is your user dashboard.`);
                        }
                      }}
                      className={`${
                        isAdmin 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      } text-white px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center font-semibold text-xs md:text-sm lg:text-base`}
                    >
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                      {isAdmin ? 'Admin' : userName || 'User'}
                    </button>
                  </div>

                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center font-semibold text-xs md:text-sm lg:text-base"
                  >
                    <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <Menu className="w-6 h-6 text-amber-400" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-amber-100">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-amber-600 font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 flex space-x-3">
                  {!isAdmin && !isUser ? (
                    <>
                      <button
                        onClick={() => {
                          setShowLoginForm(true);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setShowSignupForm(true);
                          setMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (isAdmin) {
                            setShowAddForm(true);
                          } else {
                            alert(`Welcome ${userName}!`);
                          }
                          setMobileMenuOpen(false);
                        }}
                        className={`${
                          isAdmin 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        } text-white px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {isAdmin ? 'Admin Panel' : 'My Account'}
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ✅ Updated Signup Modal - Fixed version */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-6 w-[380px] animate-fade-in">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Create Account</h2>
              <p className="text-xs text-gray-300">Join JoycDecor today</p>
            </div>

            {/* Error/Success Messages */}
            {signupError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{signupError}</p>
              </div>
            )}
            
            {signupSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-sm">{signupSuccess}</p>
              </div>
            )}

            {/* Form - Updated to match your API (no phone field) */}
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="email"
                placeholder="Email *"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="password"
                placeholder="Password * (min. 6 characters)"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="password"
                placeholder="Confirm Password *"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleSignup}
                disabled={pageLoading}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {pageLoading ? "Creating Account..." : "Create Account"}
              </button>
              <button
                onClick={() => {
                  setShowSignupForm(false);
                  setSignupError("");
                  setSignupSuccess("");
                }}
                disabled={pageLoading}
                className="w-full py-2 border border-white/30 text-gray-200 rounded-lg hover:bg-white/10 transition text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-3 text-xs text-gray-300">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowSignupForm(false);
                  setSignupError("");
                  setSignupSuccess("");
                  setShowLoginForm(true);
                }}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <LogIn className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Welcome Back</h2>
              <p className="text-sm text-gray-200">Sign in to continue</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              
              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowForgotPasswordForm(true);
                  }}
                  className="text-amber-400 text-sm hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={pageLoading}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pageLoading ? "Signing In..." : "Sign In"}
              </button>
              <button
                onClick={() => setShowLoginForm(false)}
                className="w-full py-2.5 border border-white/30 text-gray-200 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-gray-200">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowLoginForm(false);
                  setShowSignupForm(true);
                }}
                className="text-amber-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
             </div>
          </div>
        </div>
      )}

      {/* ✅ Forgot Password Modal */}
      {showForgotPasswordForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="text-sm text-gray-200">Enter your email to receive a reset link</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordData.email}
                onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={handleForgotPassword}
                disabled={pageLoading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pageLoading ? "Sending..." : "Send Reset Link"}
              </button>
              
              <button
                onClick={() => {
                  setShowForgotPasswordForm(false);
                  setShowLoginForm(true);
                }}
                className="w-full py-2.5 border border-white/30 text-gray-200 rounded-xl hover:bg-white/10 transition"
              >
                Back to Login
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-gray-200">
              Remember your password?{" "}
              <button
                onClick={() => {
                  setShowForgotPasswordForm(false);
                  setShowLoginForm(true);
                }}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reset Password Modal */}
      {showResetPasswordForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Set New Password</h2>
              <p className="text-sm text-gray-200">Enter your new password below</p>
            </div>

            <div className="space-y-4">
              {!resetToken && (
                <input
                  type="text"
                  placeholder="Enter reset token"
                  value={resetPasswordData.token}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, token: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
              
              <input
                type="password"
                placeholder="New password"
                value={resetPasswordData.password}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
              <input
                type="password"
                placeholder="Confirm new password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
              <button
                onClick={handleResetPassword}
                disabled={pageLoading}
                className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pageLoading ? "Resetting..." : "Reset Password"}
              </button>
              
              <button
                onClick={() => {
                  setShowResetPasswordForm(false)
                   router.push("/");}
                }
                className="w-full py-2.5 border border-white/30 text-gray-200 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-gray-200">
              Remember your password?{" "}
              <button
                onClick={() => {
                  setShowResetPasswordForm(false);
                  setShowLoginForm(true);
                }}
                className="text-green-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DecorationEventApp;