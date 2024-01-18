// Navbar.js

import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed

const NavBar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white font-bold">Login</Link>
          <Link to="/" className="text-white font-bold">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
