import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//SVG
import BigEyeSVG from "../assets/svg/BigEyeSVG";
import PasswordEyeSVG from '../assets/svg/PasswordEyeSVG';

//validators
import { signupSchema } from '../../utils/validatorSchema/userValidator';

//api
import { signup } from '../api/auth';


const SignupPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // All refs and state are unchanged
  const passwordRef = useRef(null);
  const bigEyeRef = useRef(null);

  // Initialize useForm for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // Destructure password props to handle the dual ref requirement
  const { ref: passwordFormRef, ...passwordRest } = register("password");

  // The animation useEffect is completely unchanged
  useEffect(() => {
    const passwordInput = passwordRef.current;
    const bigEye = bigEyeRef.current;
    if (!passwordInput || !bigEye) return;

    const handleFocus = () => bigEye.classList.add('watching');
    const handleBlur = () => {
      bigEye.classList.remove('watching');
      bigEye.classList.remove('nervous');
    };
    const handleInput = () => bigEye.classList.add('nervous');

    passwordInput.addEventListener('focus', handleFocus);
    passwordInput.addEventListener('blur', handleBlur);
    passwordInput.addEventListener('input', handleInput);

    return () => {
      passwordInput.removeEventListener('focus', handleFocus);
      passwordInput.removeEventListener('blur', handleBlur);
      passwordInput.removeEventListener('input', handleInput);
    };
  }, []);

  // The toggle function is unchanged
  const togglePasswordVisibility = () => {
    const bigEye = bigEyeRef.current;
    if (!bigEye) return;
    
    if (!isPasswordVisible) {
      bigEye.classList.add('nervous');
    } else {
      bigEye.classList.remove('nervous');
    }
    setIsPasswordVisible((prevState) => !prevState);
  };
  
  // The onSubmit handler for validated data
  const onSubmit = (data) => {
    const {username,email,password}=data
    signup(username,email,password)
  };

  return (
    // JSX Structure is identical to what you provided
    <>
      <h1>
        <span>Create</span>
        <br />
        <span>Account</span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form" id="signup-form">

        <div id="big-eye-container" aria-hidden="true">
          <BigEyeSVG ref={bigEyeRef} />
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="xyz"
            {...register("username")}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Create a password"
              {...passwordRest}
              ref={(e) => {
                passwordFormRef(e); // Ref for validation
                passwordRef.current = e; // Ref for animation
              }}
            />
            <button type="button" className="toggle-eye" onClick={togglePasswordVisibility} aria-label="Show password">
              <PasswordEyeSVG isPasswordVisible={isPasswordVisible} />
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn">Sign up</button>
        <div className="muted">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
    </>
  );
};

export default SignupPage;