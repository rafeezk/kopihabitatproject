import React from "react";

const ExamplePage = () => {
  return (
    <section
      className="product h-auto bg-[#F3F4F6] p-4 sm:p-6 md:p-8 lg:h-[92vh] lg:p-0"
      id="product"
    >
      <div className="title text-center">
        <h2 className="font-bold text-2xl sm:text-2xl md:text-3xl pt-11 text-black">
          Special Roasted
        </h2>
        <p className="text-sm sm:text-base pt-2 pb-2 text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
          quod?
        </p>
      </div>

      <div className="container flex flex-wrap gap-4 sm:gap-6 md:gap-[5rem] items-center justify-center mt-5 sm:mt-8 md:mt-10">
        <div className="card w-[265px] sm:w-1/2 md:w-1/3 lg:w-60 h-auto md:h-[360px] rounded-md border-[0.1px] border-black shadow-xl text-white p-4 md:p-0">
          <figure>
            <img
              src="./public/images/coffee.png"
              className="h-36 w-full object-cover mt-5"
              alt="Product"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-black">kopihabitat. Arabica</h2>
            <div className="flex justify-between">
              <p className="text-black">Rp 100.000</p>
              <p className="text-black text-end">500 gr</p>
            </div>
          </div>
          <div className="flex justify-center px-5">
            <button
              className="btn btn-outline w-full mb-5 text-black font-light border-black transition ease-in-out delay-150 
              hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300"
            >
              view details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamplePage;
