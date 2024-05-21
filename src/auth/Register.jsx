import React, { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../createClient";

const Register = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Password Not Same");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });

    if (error) {
      alert("REGISTER FAILED:(");
    } else {
      alert("Register success:), check email for verificate:)");
    }
    setLoading(false);
  };

  return (
    <section className="">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-[320px] h-[480px] p-7 bg-[#282726] border-black border rounded-md shadow-lg shadow-black">
            <h2 className="py-5 text-2xl font-bold text-center text-white">
              Register
            </h2>
            {/* <label className="text-white">Email</label> */}
            <input
              type="text"
              placeholder="email"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-5 text-white border-white"
              ref={emailRef}
            />
            {/* <label className="text-white">Password</label> */}
            <input
              type="password"
              placeholder="password"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-3 text-white border-white"
              ref={passwordRef}
            />
            {/* <label className="text-white">Confirm Password</label> */}
            <input
              type="password"
              placeholder="confirm password"
              className="input input-bordered w-full max-w-xs shadow-lg bg-black mt-3 text-white border-white"
              ref={confirmPasswordRef}
            />
            <div className="text-center py-5">
              <button type="submit" className="btn bg-white text-black hover:bg-blue-600 hover:text-white border-none w-full mt-16">
                {loading ? <>loading...</> : <>Register</>}
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
