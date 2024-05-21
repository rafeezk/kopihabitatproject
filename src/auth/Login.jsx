import { useRef, useState } from "react";
import { supabase } from "../createClient";
import { Link } from "react-router-dom"; // Import Link untuk membuat tautan

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (error) {
        alert("LOGIN FAILED;(");
      }

      if (user && session) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <section className="bg-black">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-[320px] h-[400px] bg-[#282726] p-7 border-black border rounded-xl shadow-lg shadow-[#252525]">
              <h2 className="py-5 text-2xl font-bold text-center text-white">
                Login
              </h2>
              {/* <label className="text-white">Email</label> */}
              <input
                type="text"
                placeholder="email"
                className="input w-full max-w-xs mt-5 border-white bg-black text-white"
                ref={emailRef}
              />
              {/* <label className="text-white">Password</label> */}
              <input
                type="password"
                placeholder="password"
                className="input input-bordered border-white mt-5 w-full max-w-xs bg-black text-white"
                ref={passwordRef}
              />
              <div className="text-center py-5">
                <button
                  type="submit"
                  className="btn bg-white w-full border-none text-black hover:bg-blue-600 hover:text-white mt-10"
                >
                  {loading ? <>loading...</> : <>Login</>}
                </button>
                <p className="text-white mt-3 text-sm font-light">
                  dont have an account?{" "}
                  <Link to="/register" className="text-blue-600">
                    register
                  </Link>
                </p>{" "}
                {/* Teks dan tautan untuk register */}
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
