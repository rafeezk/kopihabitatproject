import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../createClient";
import { Link } from "react-router-dom";
import image from "../../public/images/profile.png";
import Swal from "sweetalert2";

const User = () => {
  const { user, logout, role } = useAuth();
  const [profileData, setProfileData] = useState("");

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await logout();
      if (!error) {
        Swal.fire({
          title: 'Logout Successful!',
          text: 'You have been logged out.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: 'Logout Failed!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Logout Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);
  
  return (
    <>
      <section className="h-screen bg-[#F3F4F6] dark:bg-[#221f1f] relative">
        <div className="p-10">
          <img
            src="./images/profilebg.png"
            className="w-full h-[300px] rounded-3xl object-center shadow-2xl blur-[1px]"
            alt="profilebg"
          />
          <img
            src={image}
            className="rounded-[100px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[3px] border-white"
            width={140}
            height={140}
            alt="profile"
          />
        </div>
        <h1 className="text-center lg:mt-20 mt-10 text-2xl font-bold text-black dark:text-white">
          {profileData.username}
        </h1>
        <h1 className="text-center text-base font-thin text-black dark:text-white">
          {profileData.role}
        </h1>
        <div className="flex justify-center gap-2">
        {role === "admin" && (
            <Link to={`/admin`}>
              <button className="btn btn-outline border-black text-black mt-3 hover:bg-black hover:text-white dark:bg-black dark:text-white">
                admin
              </button>
            </Link>
          )}

          <Link to={`/history`}>
            <button className="btn btn-outline border-black text-black mt-3 hover:bg-black hover:text-white dark:bg-black dark:text-white">
              history
            </button>
          </Link>

          <button
            className="btn btn-outline bg-red-600 border-black text-white mt-3 hover:bg-black hover:text-white dark:hover:bg-red-600"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </section>
    </>
  );
};

export default User;
