// layouts/AuthLayout.jsx
import React, { useEffect } from "react";
import "./Auth.css";

export default function AuthLayout({ children }) {
  // This hook manages the body class
  useEffect(() => {
    // Add the class when the component mounts
    document.body.classList.add("auth-body");

    // Cleanup function: remove the class when the component unmounts
    return () => {
      document.body.classList.remove("auth-body");
    };
  }, []); // The empty array ensures this effect runs only once on mount and cleanup on unmount

  return <div className="auth-layout">{children}</div>;
}