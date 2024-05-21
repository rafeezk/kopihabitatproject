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

  const totalCart = async () => {
    const { data } = await supabase.from("coffeecart").select("*");
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
        alert("Logout Success!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
            <h2 className="text-xl font-bold text-white italic">
              kopihabitat.
            </h2>
          </div>
          <div className="navbar-end">
            <Link to={`/cart`}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
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
                  <div className="w-10 rounded-full">
                    <img alt="Profile" src="./images/profile.png" />
                  </div>
                </div>
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/profile">
                      <a className="justify-between">Profile</a>
                    </Link>
                  </li>
                  <li>
                    <Link to="/setting">
                    <a>Settings</a>
                    </Link>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
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
