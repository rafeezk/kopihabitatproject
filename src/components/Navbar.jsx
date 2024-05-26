import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../createClient";

const Navbar = () => {
  const { user, logout } = useAuth();
  // const [profileName, setProfileName] = useState('');
  const navigate = useNavigate();
  const [getTotalCart, setGetTotalCart] = useState("");
  // const [greetingMessage, setGreetingMessage] = useState('');

  const totalCart = async () => {
    const { data } = await supabase.from("coffeecart").select("*").eq("id_user", user.id);
    setGetTotalCart(data.length);
  };

  console.log(user);

  // const greetingTime = () => {
  //   const currentTime = new Date().getHours();
  //   if (currentTime >= 4 && currentTime < 10) {
  //     setGreetingMessage('Selamat Pagi');
  //   } else if (currentTime >= 10 && currentTime < 15) {
  //     setGreetingMessage('Selamat Siang');
  //   } else if (currentTime >= 15 && currentTime < 18) {
  //     setGreetingMessage('Selamat Bersenja');
  //   } else {
  //     setGreetingMessage('Selamat Malam');
  //   }
  // };

  // const fetchProfileName = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('username')
  //       .eq('id', user.id)
  //       .single();
  //     if (error) {
  //       throw error;
  //     }
  //     setProfileName(data.username);
  //   } catch (error) {
  //     console.error('Error fetching profile name:', error.message);
  //   }
  // };

  useEffect(() => {
    if (user) {
      // fetchProfileName();
    }
    scroll(), totalCart();
    // greetingTime();

    supabase
      .channel("d0ffeecart")
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
    <header className="navbar bg-white border-b border-black px-7 py-3 text-black dark:bg-black dark:text-white absolute backdrop-filter-none z-10">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">kopihabitat.</a>
      </div>
      <div className="navbar-center lg:flex ">
        <ul className="menu-horizontal gap-8 px-1 ">
          <li>
            <Link
              to="/"
              className="text-black dark:text-white hover:text-[#0B6E4F] transition cursor-pointer"
              href="#about"
            >
              Home
            </Link>
          </li>
          <li>
            <a
              className="text-black dark:text-white hover:text-[#0B6E4F] transition cursor-pointer"
              href="#about"
            >
              About
            </a>
          </li>
          <li>
            <a
              className="text-black dark:text-white hover:text-[#0B6E4F] transition cursor-pointer"
              href="#product"
            >
              Product
            </a>
          </li>
          <li>
            <a
              className="text-black dark:text-white hover:text-[#0B6E4F] transition cursor-pointer"
              href="#service"
            >
              Service
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <Link to={`/cart`}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                    <img alt="Profile" src="/public/images/profile.png" />
                  </div>
                </div>
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/profile">
                      <a className="justify-between">Profile</a>
                    </Link>
                  </li>
                  <Link to={"/setting"}>
                    <li>
                      <a>Settings</a>
                    </li>
                  </Link>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <a className="bg-white border-black border-[2px] rounded-md text-black transition hover:bg-black hover:text-white py-2 px-6">
                Login
              </a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
