import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../createClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icon
import { useAuth } from "../auth/AuthProvider";
import Swal from "sweetalert2";

const CoffeePage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  async function getData() {
    const { data } = await supabase.from("coffees").select("*");
    setData(data);
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
              cart_name: data.coffee_name,
              cart_description: data.coffee_description,
              cart_ingredients: data.coffee_ingredients,
              cart_price: data.coffee_price,
              cart_total: 1,
              cart_images: data.images,
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
    const dot = options.dot || ".";
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(price).replace(",", dot);
  };

  const getImage = (filename) => {
    const publicUrl = supabase.storage
      .from("coffee_images")
      .getPublicUrl("images/" + filename).data.publicUrl;
    return publicUrl;
  };

  useEffect(() => {
    getData(id);
  }, [id]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
        <section
          className="product h-[92vh] bg-[#F3F4F6] dark:bg-[#221f1f]"
          id="product"
        >
          <div className="title text-center">
            <h2 className="font-bold text-3xl pt-11 text-black dark:text-white">
              Special Coffee
            </h2>
            <p className="pt-2 pb-2 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis, quaerat.
            </p>
          </div>

          <div className="flex flex-wrap gap-[5rem] items-center justify-center mt-10">
            {currentItems.map((i) => (
              <Link to={`/coffee-detail/${i.id}`} key={i.id} className="w-60">
              <div
                className="card h-[360px] shadow-xl rounded-lg text-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 bg-white dark:bg-[#252525]"
                key={i.id}
              >
                <figure>
                  <img
                    src={getImage(i.images)}
                    className="h-40 w-full object-cover rounded-t-lg"
                    alt="Product"
                  />
                </figure>
                <div className="card-body h-32">
                  <h2 className="card-title text-balance text-black dark:text-white">
                    {i.coffee_name}
                  </h2>
                  <div className="flex">
                    <p className="text-black dark:text-white">{toRupiah(i.coffee_price)}</p>
                    <p className="text-end text-black dark:text-white">{i.weight}gr</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link to={`/coffee-detail/${i.id}`} className="px-5">
                    <button className="btn btn-outline w-32 mb-5 align-bottom text-black font-light border-black transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300 dark:bg-black dark:text-white">
                      View Details
                    </button>
                  </Link>
                  <Link>
                    <button
                      className="btn btn-outline w-full mb-5 align-bottom text-black font-light border-black transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300 dark:bg-black dark:text-white"
                      onClick={() => addCart(i.id)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />{" "}
                      {/* Icon keranjang */}
                    </button>
                  </Link>
                </div>
              </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center py-5">
            <div>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`text-black dark:text-white  h-10 mt-5 hover:bg-black hover:text-white duration-500 rounded-full w-10 mx-1 ${
                    currentPage === number && "bg-black text-white"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </section>
    </>
  );
};

export default CoffeePage;
