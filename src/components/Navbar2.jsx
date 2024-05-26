import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../createClient";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [profileName, setProfileName] = useState("");
  const [getTotalCart, setGetTotalCart] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    setDarkMode(currentTheme === "light");
    document.body.setAttribute("data-theme", currentTheme);
  }, []);

  const handleToggle = () => {
    const newTheme = darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const totalCart = async () => {
    const { data } = await supabase
      .from("coffeecart")
      .select("*")
      .eq("id_user", user.id);
    setGetTotalCart(data.length);
  };

  const greetingTime = () => {
    const currentTime = new Date().getHours();
    if (currentTime >= 4 && currentTime < 10) {
      setGreetingMessage("Selamat Pagi");
    } else if (currentTime >= 10 && currentTime < 15) {
      setGreetingMessage("Selamat Siang");
    } else if (currentTime >= 15 && currentTime < 18) {
      setGreetingMessage("Selamat Bersenja");
    } else {
      setGreetingMessage("Selamat Malam");
    }
  };

  const fetchProfileName = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      setProfileName(data.username);
    } catch (error) {
      console.error("Error fetching profile name:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileName();
    }
    scroll();
    totalCart();
    greetingTime();

    supabase
      .channel("coffeecart")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "coffeecart",
        },
        () => {
          totalCart();
        }
      )
      .subscribe();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await logout();
      if (!error) {
        alert("Logout Success");
        navigate("/");
      } else {
        alert("Logout Failed");
      }
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const scroll = () => {
    window.addEventListener("scroll", function () {
      const header = document.querySelector("header");
      header.classList.toggle("sticky", window.scrollY > 0);
    });
  };

  return (
    <header className="navbar bg-transparent px-7 py-3 text-black absolute backdrop-filter-none z-10">
      {user ? (
        <>
          <div className="navbar-start">
            <h2 className="hidden me-2 text-white text-base tracking-wider sm:block">
              {greetingMessage}, {profileName}!
            </h2>
          </div>
          <div className="navbar-center flex">
            <h2 className="text-xl font-bold text-white dark:text-white italic">
              kopihabitat.
            </h2>
          </div>
          <div className="navbar-end">
            <label className="swap swap-rotate me-1 md:navbar-end ">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleToggle}
              />
              <svg
                className="swap-on fill-current w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
            <Link to={`/cart`}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white dark:text-black"
                    id="iconcart"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {getTotalCart}
                  </span>
                </div>
              </div>
            </Link>
            <div className="dropdown dropdown-end">
              <div className="dropdown dropdown-end mx-3">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <Link to="/profile">
                    <div className="w-10">
                      <img alt="Profile" src="./images/profile.png" className="rounded-full" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="navbar-start">
            <h2 className="text-xl font-bold text-white italic">
              kopihabitat.
            </h2>
          </div>
          <div className="navbar-end ml-auto">
            <Link to="/login">
              <a className="bg-white border-black border-[2px] rounded-md text-black transition  hover:bg-black hover:text-white py-2 px-6">
                login
              </a>
            </Link>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
