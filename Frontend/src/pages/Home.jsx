// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Home Page!</h1>
      <p>This page should have a normal, default background.</p>
      <p>The special purple gradient and glowing effects should NOT be visible here.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default HomePage;