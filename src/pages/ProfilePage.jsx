import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../createClient";
import { Link } from "react-router-dom";
import image from "../../public/images/profile.png";

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
        alert("Logout Success");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);
  
  return (
    <>
      <section className="h-screen bg-[#F3F4F6] relative">
        <div className="p-10">
          <img
            src="./images/profilebg.jpg"
            className="w-full h-[300px] rounded-3xl object-center shadow-2xl blur-[1px]"
            alt="profilebg"
          />
          <img
            src={image}
            className="rounded-[100px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[3px] border-black"
            width={140}
            height={140}
            alt="profile"
          />
        </div>
        <h1 className="text-center lg:mt-20 mt-10 text-2xl font-bold text-black">
          {profileData.username}
        </h1>
        <h1 className="text-center text-base font-thin text-black">
          {profileData.role}
        </h1>
        <div className="flex justify-center gap-2">
          <Link to={`/history`}>
            <button className="btn btn-outline border-black text-black mt-3 hover:bg-black hover:text-white">
              history
            </button>
          </Link>

          <button
            className="btn btn-outline bg-red-600 border-black text-white mt-3 hover:bg-black hover:text-white"
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
