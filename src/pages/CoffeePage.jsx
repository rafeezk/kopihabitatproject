import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../createClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icon
import { useAuth } from "../auth/AuthProvider";

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
    const { data } = await supabase
      .from("coffees")
      .select("*")
      .eq("id", id)
      .single();
    try {
      if (data) {
        const { error } = await supabase
          .from("coffeecart")
          .insert([
            {
              id_user: user.id,
              id_product: data.id,
              cart_name: data.coffee_name,
              cart_description: data.coffee_description,
              cart_ingredients: data.coffee_ingredients,
              cart_price: data.coffee_price,
              cart_total: 1,
              cart_images: data.images,
            },
          ])
          .select();
        if (!error) {
          alert("add cart successfull!");
        }

        console.log(error);
      }
      // console.log(data);
    } catch (error) {
      console.error("login", error.message);
      navigate("/login");
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
          className="product h-[92vh] bg-[#F3F4F6]"
          style={{ backgroundColor: "var(--background-color)" }}
          id="product"
        >
          <div className="title text-center">
            <h2 className="font-bold text-3xl pt-11 text-black">
              Special Coffee
            </h2>
            <p className="pt-2 pb-2 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis, quaerat.
            </p>
          </div>

          <div className="flex flex-wrap gap-[5rem] items-center justify-center mt-10">
            {currentItems.map((i) => (
              <div
                className="card w-60 h-[360px] shadow-xl rounded-lg text-white"
                key={i.id}
              >
                <figure>
                  <img
                    src={getImage(i.images)}
                    className="h-40 w-full object-cover mt-5 rounded-t-lg"
                    alt="Product"
                  />
                </figure>
                <div className="card-body h-32">
                  <h2 className="card-title text-balance text-black">
                    {i.coffee_name}
                  </h2>
                  <div className="flex">
                    <p className="text-black">{toRupiah(i.price)}</p>
                    <p className="text-end text-black">{i.weight}gr</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Link to={`/coffee-detail/${i.id}`} className="px-5">
                    <button className="btn btn-outline w-32 mb-5 align-bottom text-black font-light border-black transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300">
                      View Details
                    </button>
                  </Link>
                  <Link>
                    <button
                      className="btn btn-outline w-full mb-5 align-bottom text-black font-light border-black transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300"
                      onClick={() => addCart(i.id)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />{" "}
                      {/* Icon keranjang */}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center py-5">
            <div>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`border border-black text-black h-10 mt-5 hover:bg-black hover:text-white duration-500 rounded-full w-10 mx-1 ${
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
