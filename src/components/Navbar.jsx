import { useState } from "react";
import { navCTA, navlinks } from "../constants";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="navbar fixed bg-white shadow-sm z-60 p-0">
      <nav aria-label="Main Navigation" className="content flex flex-row">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </button>
            <ul
              tabIndex="-1"
              role="menu"
              className="menu menu-sm dropdown-content bg-white  rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navlinks.map((link) => (
                <li
                  key={link.name}
                  role="none"
                  className="font-sans font-extralight uppercase"
                >
                  <a role="menuitem" href={link.path} className="text-lg">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* LOGO, text for now */}
          <a className="btn btn-ghost font-sans text-accent text-xl uppercase">
            Coof
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul role="menubar" className="menu menu-horizontal px-1">
            {navlinks.map((link) => (
              <li role="none" key={link.name} className="font-sans uppercase">
                <a role="menuitem" href={link.path}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <a
            href={navCTA.path}
            className="btn btn-accent font-sans font-normal uppercase text-black"
          >
            {navCTA.name}
          </a>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
