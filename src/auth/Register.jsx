import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../createClient";

const Register = () => {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!usernameRef.current.value || !emailRef.current.value || !passwordRef.current.value || !confirmPasswordRef.current.value) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    const { user, error } = await supabase.auth.signUp({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Ensure user object and user.id are available
      if (user && user.id) {
        const { data, error: profileError } = await supabase.from("profiles").insert([
          {
            id: user.id, // Use the user ID from the sign-up result
            username: usernameRef.current.value,
            email: emailRef.current.value,
          },
        ]);

        if (profileError) {
          alert(profileError.message);
        } else {
          alert("Register success! Check your email for verification :)");
        }
      } else {
        alert("User registration completed, but no user ID received.");
      }
      setLoading(false);
    }
  };

  return (
    <section className="">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-[320px] h-[550px] p-7 bg-[#282726] border-black border rounded-md shadow-lg shadow-black">
            <h2 className="py-5 text-2xl font-bold text-center text-white">
              Register
            </h2>
            <input
              type="text"
              placeholder="username"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-5 text-white border-white"
              ref={usernameRef}
            />
            <input
              type="text"
              placeholder="email"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-5 text-white border-white"
              ref={emailRef}
            />
            <input
              type="password"
              placeholder="password"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-3 text-white border-white"
              ref={passwordRef}
            />
            <input
              type="password"
              placeholder="confirm password"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-3 text-white border-white"
              ref={confirmPasswordRef}
            />
            <div className="text-center py-5">
              <button
                type="submit"
                className="btn bg-white text-black hover:bg-blue-600 hover:text-white border-none w-full mt-16"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>
              <p className="mt-3 text-sm font-light text-white">
                Already have an account?
                <Link to="/login" className="text-blue-600 ms-1">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Register;