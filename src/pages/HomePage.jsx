import { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
// import Navbar from "../components/Navbar";
import BeanPage from "./BeanPage";
import LocationPage from "./LocationPage";
import CoffeePage from "./CoffeePage";
import { InfinitySpin } from "react-loader-spinner";
import Footer from "../components/Footer";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-screen bg-white flex justify-center items-center">
          <InfinitySpin
            visible={true}
            width="200"
            color="#000"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      ) : (
        <>
          <Navbar2 />
          <section className="home h-screen" id="home">
            <div className="flex flex-col justify-center items-center h-full backdrop-brightness-75">
              <h2 className="text-center text-white text-4xl mb-4 uppercase font-semibold leading-[50px]">
                when live gives u coffee beans,
                <br /> make a americano and latte to the good times.
              </h2>
              <div className="flex justify-center">
                <button className="uppercase transition py-3 px-4 mt-8 text-white font-bold bg-black">
                  visit us
                </button>
              </div>
            </div>
          </section>
          <BeanPage />
          <LocationPage />
          <CoffeePage />
          <Footer/>
        </>
      )}
    </>
  );
};

export default HomePage;
