// RefreshHandler.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate= useNavigate()

  useEffect(() => {

    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);

      // Redirect only if on login/signup/root and already authenticated
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"
      ) {
        navigate("/Dashboard", { replace: false });
      }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

export default RefreshHandler;
