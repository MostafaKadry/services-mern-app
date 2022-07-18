import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar bg-light">
      <div className="navbar-brand">
        <Link to="/statpage">Statistcies page</Link>
      </div>
      <div className="text-end">
        <Link to="/">Register New User</Link>
      </div>
    </nav>
  );
};

export default Navbar;
