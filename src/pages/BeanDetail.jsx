import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const BeanDetail = () => {
  const [getBean, setGetBean] = useState([]);
  // const [showFullDesc, setShowFullDesc] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fake-coffee-api.vercel.app/api/${id}`
        );
        const data = await response.json();
        setGetBean(data);
      } catch (error) {
        console.error("Error fetching coffee data:", error);
      }
    };

    fetchData();
  }, []);

  const convertToRupiah = (priceInDollar) => {
    const exchangeRate = 15000; // Misalnya 1 dolar = Rp 15.000
    const priceInRupiah = priceInDollar * exchangeRate;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(priceInRupiah);
  };

  function truncate(str, length) {
    if (!str) {
      return "";
    }
    return str.length > length ? str.substring(0, length) + "..." : str;
  }

  return (
    <>
      <Navbar />
      <section className="h-screen flex justify-center items-center bg-[#F3F4F6]">
        <div className="pt-10">
          {getBean.map((i) => (
            <div
              className="card lg:card-side h-auto lg:h-[550px] w-full lg:w-[1300px] border border-black lg:rounded-sm rounded-none shadow-sm bg-white"
              key={i.id}
            >
              <figure className="w-full lg:w-[640px] border-e-[1px] border-black">
                <img
                  src={i.image_url}
                  className="object-cover h-full w-full"
                  alt={i.name}
                />
              </figure>
              <div>
                <h2 className="card-title text-4xl text-black px-8 mt-8">
                  {i.name}
                </h2>
                <div className="flex flex-row gap-3 h-40 border-b border-black px-8">
                  <h2 className="text-base text-black">region: {i.region}</h2>
                  <h2 className="text-base text-black">
                    flavor: {i.flavor_profile}
                  </h2>
                  <h2 className="text-base text-black">
                    roast level: {i.roast_level}
                  </h2>
                  <h2 className="text-base text-black">
                    grind option: {i.grind_option.join(", ")}.
                  </h2>
                </div>
                {/* <p className="text-balance py-5 font-medium text-gray-300 lg:w-[500px] lg:h-44">
                {showFullDesc
                  ? i.description
                  : truncate(i.description, 150)}
                {!showFullDesc &&
                  i.description &&
                  i.description.length > 150 && (
                    <button
                      className="text-blue-500 text-balance text-center"
                      onClick={() => setShowFullDesc(true)}
                    >
                      read more
                    </button>
                  )}
              </p> */}
                <div className="flex justify-between h-[317px]">
                  <div className="flex-col w-1/2 border-e-[1px] border-black">
                    <h1 className="p-5 text-xl text-black text-justify">
                      {truncate(i.description)}
                    </h1>
                  </div>
                  <div className="w-1/2 p-5">
                    <h2 className="text-xl text-black font-semibold">
                      ONLY AVAILABLE ON OFFLINE STORE.
                    </h2>
                    <p className="text-5xl text-center pt-20 font-extrabold text-black ">
                      {convertToRupiah(i.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default BeanDetail;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const DetailPage = () => {
//     const { id } = useParams()
//   const [coffee, setCoffee] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`https://fake-coffee-api.vercel.app/api/${id}`);
//         const data = await response.json();
//         setCoffee(data);
//       } catch (error) {
//         console.error('Error fetching coffee data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <section>
//       {coffee.map((i) => (
//         <div key={i.id} className="detail w-[100%] h-screen flex flex-row bg-white">
//           <div className="flex flex-col justify-center items-center w-1/2 h-full p-5">
//             <img
//               className="rounded-md shadow-lg w-full object-cover"
//               src={i.image_url}
//               alt={i.name}
//             />
//           </div>

//           <div className="flex flex-col w-1/2">
//             <div className="p-4">
//               <h2 className="font-bold text-center p-3 text-2xl">
//                 {i.name}
//               </h2>
// <h3>{i.description}</h3>
//             </div>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default DetailPage;
