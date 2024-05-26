import React from "react";
import { Link } from "react-router-dom";

const LocationPage = () => {
  return (
    <>
      <section className="location h-[40vh] bg-[#F3F4F6] relative dark:bg-[#221f1f]" id="location">
        <div className="flex flex-col justify-center items-center h-full ">
          <img
            src="../images/locationbg.png"
            className="w-full h-72 object-cover absolute brightness-50"
            alt="Background"
          />
          <h1 className="text-4xl font-bold text-white uppercase md:text-center text-left md:mx-0 mx-5 z-10">
            Uniting coffee addicts and farmers
          </h1>
          <Link to="/comingsoon">
            <div className="w-full flex md:justify-center justify-start px-5">
              <button className="bg-transparent border-white border-2 hover:bg-white hover:text-black transition duration-300 text-white font-medium py-2 px-4 rounded-full z-10 mt-5">
                see branch
              </button>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default LocationPage;
