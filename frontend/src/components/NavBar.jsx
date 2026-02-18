import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Medimate4_png, pfp_png, dropdown } from "../assets/assets";
//import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  //const { token, logout } = useAuth();
  const token = localStorage.getItem("token");
  const [notification, setNotification] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setTimeout(() => {
      navigate("/");
    });
    //logout();
    setMenuOpen(false);
  };
  
  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          setNotification({
            message: `🚨 SOS Triggered! Your location (${latitude.toFixed(
              2
            )}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
            link: mapLink,
          });
          setTimeout(() => setNotification(null), 8000);
        },
        async () => {
          try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            const { latitude, longitude } = data;
            const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
            setNotification({
              message: `🚨 SOS Triggered! Your approximate location (${latitude.toFixed(
                2
              )}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
              link: mapLink,
            });
            setTimeout(() => setNotification(null), 8000);
          } catch {
            setNotification({
              message: `🚨 SOS Triggered! Location unavailable. Emergency services will be in contact shortly.`,
              link: null,
            });
            setTimeout(() => setNotification(null), 8000);
          }
        }
      );
    } else {
      (async () => {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          const { latitude, longitude } = data;
          const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          setNotification({
            message: `🚨 SOS Triggered! Your approximate location (${latitude.toFixed(
              2
            )}, ${longitude.toFixed(2)}) has been sent. Emergency services will be in contact shortly.`,
            link: mapLink,
          });
          setTimeout(() => setNotification(null), 8000);
        } catch {
          setNotification({
            message: `🚨 SOS Triggered! Location unavailable. Emergency services will be in contact shortly.`,
            link: null,
          });
          setTimeout(() => setNotification(null), 8000);
        }
      })();
    }
  };

  return (
    <div className="bg-white fixed top-0 left-0 w-full z-50 shadow nav">
      <div className="mr-20 ml-10 mt-1 flex items-center justify-between text-sm py-4 mb-2">
        {/* Logo */}
        <NavLink to="/">
          <img
            className="w-50 cursor-pointer"
            src={Medimate4_png}
            alt="logo"
            onClick={() =>
              document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </NavLink>

        {/* Nav Links */}
        <ul className="hidden md:flex items-start gap-x-10 font-medium">
          <NavLink to="/">
            <li
              className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              onClick={() =>
                document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              HOME
            </li>
          </NavLink>

          <NavLink to="/">
            <li
              className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ABOUT
            </li>
          </NavLink>

          <NavLink to="/">
            <li
              className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              onClick={() =>
                document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              MAP
            </li>
          </NavLink>

          <NavLink to="/">
            <li
              className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              CONTACT
            </li>
          </NavLink>

          <li
            className="py-3 text-primary cursor-pointer relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            onClick={() => navigate("/book-appointments")}
          >
            BOOK APPOINTMENT
          </li>
        </ul>

        {/* Right side: SOS + Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSOS}
            className="bg-white text-red-600 border-2 px-4 py-2 rounded-full font-medium hover:bg-red-700 hover:text-white transition hover:cursor-pointer"
          >
            🚨 SOS
          </button>

          {token ? (
            <div className="relative">
              {/* avatar button toggles menu */}
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <img
                  className="w-10 h-10 rounded-full border border-primary hover:cursor-pointer"
                  src={pfp_png}
                  alt="profile pic"
                />
                <img className="w-3 hover:cursor-pointer" src={dropdown} alt="dropdown" />
              </button>

              {/* dropdown menu */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      navigate("/my-profile");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-300 text-gray-700"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-300 text-gray-700"
                  >
                    Dashboard
                  </button>

                  <div className="border-t" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-700 hover:text-amber-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create account
            </button>
          )}
        </div>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg border-l-4 border-red-600 p-4 rounded-md w-80 animate-slide-in">
          <p className="text-sm font-medium text-red-700">{notification.message}</p>
          {notification.link && (
            <a
              href={notification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Location
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
