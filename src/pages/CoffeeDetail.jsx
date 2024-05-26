import React, { useEffect, useState } from "react";
import { supabase } from "../createClient";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { InfinitySpin } from "react-loader-spinner";

const CoffeeDetail = () => {
  const [getDetail, setGetDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const getImage = (filename) => {
    const publicUrl = supabase.storage
      .from("coffee_images")
      .getPublicUrl("images/" + filename).data.publicUrl;
    return publicUrl;
  };

  async function fetchDetail(productId) {
    try {
      const { data } = await supabase
        .from("coffees")
        .select("*")
        .eq("id", productId);
      setGetDetail(data[0]);
    } catch (error) {
      console.error("Error fetching coffee detail:", error.message);
    }
  }

  async function addCart(id) {
    try {
      const { data } = await supabase
        .from("coffees")
        .select("*")
        .eq("id", id);
      if (data) {
        const { error } = await supabase
          .from("coffeecart")
          .insert([
            {
              id_user: user.id,
              id_product: data[0].id,
              cart_name: getDetail.coffee_name,
              cart_description: getDetail.coffee_description,
              cart_ingredients: getDetail.coffee_ingredients,
              cart_price: getDetail.coffee_price,
              cart_total: 1,
              cart_images: getDetail.images,
            },
          ]);
          if (!error) {
            Swal.fire({
              title: 'Success!',
              text: 'Add to cart successful!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            console.error("Error adding to cart:", error.message);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add to cart.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Product not found.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error("Error adding to cart:", error.message);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred, please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        navigate("/login"); // Ensure 'navigate' is defined and imported from 'react-router-dom'
      }
    }

  const toRupiah = (price, options = {}) => {
    const dot = options.dot || '.';
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
    return formatter.format(price).replace(',', dot);
  };

  function truncate(str, length) {
    if (!str) {
      return ""
    }
    return str.length > length ? str.substring(0, length) + "..." : str;
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    fetchDetail(id); // Mengambil detail berdasarkan ID dari URL
  }, [id]);

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
      <Navbar />
      <section className="h-screen flex justify-center items-center bg-[#F3F4F6] dark:bg-[#221f1f]">
        <div className="pt-10">
          <div
            className="card lg:card-side h-auto lg:h-[550px] w-full lg:w-[1300px] lg:rounded-sm rounded-none shadow-xl bg-white dark:bg-black mt-7"
            key={getDetail.id}
          >
            <figure className="w-full lg:w-[490px]">
              <img
                src={getImage(getDetail.images)}
                className="object-cover h-full w-full"
                alt={getDetail.coffee_name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl text-black dark:text-white">
                {getDetail.coffee_name}
              </h2>
              <p className="text-balance py-5 font-medium text-gray-600 dark:text-gray-400 lg:w-[500px] lg:h-44">
                {showFullDesc ? getDetail.coffee_description : truncate(getDetail.coffee_description, 150)}
                {!showFullDesc && getDetail.coffee_description && getDetail.coffee_description.length > 150 && (
                  <button className="text-blue-500 text-balance text-center" onClick={() => setShowFullDesc(true)}>read more</button>
                )}
              </p>
              <div className="flex w-full justify-between">
                <div className="flex-col w-40">
                  <h2 className="text-lg text-black dark:text-white">price</h2>
                  <h1 className="text-2xl text-black font-bold mt-1 dark:text-white">
                    {toRupiah(getDetail.coffee_price)}
                  </h1>
                </div>
              </div>
              <div className="flex w-full">
                <button className="btn text-black bg-white dark:border-none rounded-s-md rounded-e-none w-1/2">
                  Buy
                </button>
                <button
                  className="btn bg-black text-white border border-white rounded-e-md rounded-s-none w-1/2"
                  onClick={() => addCart(getDetail.id)}
                >
                  Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
      )}
      </>
  );
};

export default CoffeeDetail;






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
  
//             </div>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default DetailPage;
