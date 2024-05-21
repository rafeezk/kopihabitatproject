import React from 'react';

const LocationPage = () => {
  return (
    <>
      <section className='location h-[40vh] bg-[#F3F4F6] relative'>
        <div className="flex flex-col justify-center items-center h-full">
          <img
            src="/public/images/locationbg.png"
            className="w-full h-72 object-cover absolute brightness-50"
            alt="Background"
          />
          <h1 className="text-4xl font-bold text-white uppercase md:text-center text-left md:mx-0 mx-5 z-10">
            Uniting coffee addicts and farmers
          </h1>
          <div className="w-full flex md:justify-center justify-start px-5">
            <button className="bg-transparent border-white border-2 hover:bg-white hover:text-black transition duration-300 text-white font-medium py-2 px-4 rounded-full z-10 mt-5">
              See branch
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationPage;