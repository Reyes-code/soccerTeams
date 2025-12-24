import React from "react";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-secondary text-white">
      <div className="container">
        <a className="navbar-brand text-white" href="/">
          <strong>Colombian Soccer Stats</strong>
        </a>
        
        <div className="navbar-nav">
          <a className="nav-link text-white" href="/">Home</a>
          <a className="nav-link text-white" href="/leagues">Leagues</a>
          <a className="nav-link text-white" href="/stats">Stats</a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;