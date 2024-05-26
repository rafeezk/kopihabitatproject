import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../createClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CartPage = () => {
  const [getCart, setGetCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const { user } = useAuth();
  const [getTotalCart, setGetTotalCart] = useState("");
  const [getTotalPrice, setGetTotalPrice] = useState(0);

  const navigate = useNavigate();

  const calculateTotalPrice = async () => {
    let total = 0;
    getCart.forEach((cart) => {
      if (checkedItems[cart.id]) {
        total += cart.cart_price * cart.cart_total;
      }
    });
    setGetTotalPrice(total);
  };

  const totalCart = async () => {
    const { data } = await supabase
      .from("coffeecart")
      .select("*")
      .eq("id_user", user.id);

    setGetTotalCart(data.length);
  };

  const getAllCart = async () => {
    const { data } = await supabase
      .from("coffeecart")
      .select("*")
      .eq("id_user", user.id);
    setGetCart(data);
  };

  // function truncate(str) {
  //   return str.length > 20 ? str.substring(0, 20) + "..." : str;
  // }

  const deleteData = async (id) => {
    const { error } = await supabase.from("coffeecart").delete().eq("id", id);
    if (!error && getImage) {
      alert("delete data successfull");
    }
    getAllCart();
  };

  const getImage = (filename) => {
    const publicUrl = supabase.storage
      .from("coffee_images")
      .getPublicUrl("images/" + filename).data.publicUrl;
    return publicUrl;
  };

  const addQuantity = async (cartId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    const { data, error } = await supabase
      .from("coffeecart")
      .update({ cart_total: newQuantity })
      .eq("id", cartId);

    getAllCart();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  };

  const lessQuantity = async (cartId, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    const { data, error } = await supabase
      .from("coffeecart")
      .update({ cart_total: newQuantity })
      .eq("id", cartId);

    getAllCart();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Checking if any item is checked
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );

    if (checkedItemIds.length === 0) {
      // If no item is checked, display a SweetAlert2 alert
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Check item terlebih dahulu",
      });
      return;
    }

    const { getName } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id);

    const selectedProducts = getCart.filter((cart) => checkedItems[cart.id]);
    const getProductName = selectedProducts.map((i) => i.cart_name);

    const { data } = await supabase
      .from("coffeecheckout")
      .insert({
        user_id: user.id,
        username: getName[0].username,
        coffee_name: getProductName,
        price_total: getTotalPrice,
      })
      .select();

    if (data) {
      // Delete data from the cart table after successful checkout
      await supabase
        .from("coffeecart")
        .delete()
        .in(
          "id",
          selectedProducts.map((item) => item.id)
        );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Checkout successful!",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    }
  };

  useEffect(() => {
    totalCart();
    getAllCart();
    calculateTotalPrice();
  });

  const handleCheckboxChange = (e, itemId) => {
    const { checked } = e.target;
    setCheckedItems((prevState) => ({
      ...prevState,
      [itemId]: checked,
    }));
  };

  const toRupiah = (price, options = {}) => {
    const dot = options.dot || ".";
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(price).replace(",", dot);
  };

  return (
    <>
      <section className="h-full bg-[#F3F4F6] dark:bg-[#221f1f]">
        <div className="h-screen">
          <div className="flex lg:flex-row flex-col justify-between items-center lg:px-32 px-0 py-10">
            <h2 className="font-bold text-3xl text-center text-black dark:text-white italic underline">
              shopping cart
            </h2>

            <h3 className="lg:mt-0 mt-2">Total Items: {getTotalCart}</h3>
          </div>

          <div className="px-4 lg:px-32 pb-24">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {getCart.map((i, index) => (
                <div
                  key={index}
                  className="w-full bg-white dark:bg-black shadow-md rounded-md lg:h-36 h-[380px] flex flex-col lg:flex-row items-center px-4 md:px-8 my-5 justify-between"
                >
                  <img
                    src={getImage(i.cart_images)}
                    className="lg:w-[200px] w-full h-16 lg:h-[100px] mt-3 lg:mt-0 object-cover rounded-md"
                  />

                  <h2 className="text-lg md:text-xl text-center font-bold w-28 md:w-52 dark:text-white">
                    {i.cart_name}
                  </h2>

                  {/* quantity */}
                  <div>
                    <div
                      className="py-2 px-3 inline-block bg-white border border-black rounded-lg shadow-md"
                      data-hs-input-number
                    >
                      <div className="flex items-center gap-x-1.5">
                        <button
                          type="button"
                          className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          data-hs-input-number-decrement
                          onClick={() => lessQuantity(i.id, i.cart_total)}
                        >
                          <svg
                            className="flex-shrink-0 size-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <input
                          className="w-6 text-center focus:ring-0 dark:bg-white dark:text-black"
                          type="text"
                          value={i.cart_total}
                          data-hs-input-number-input
                        />
                        <button
                          type="button"
                          className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          data-hs-input-number-increment
                          onClick={() => addQuantity(i.id, i.cart_total)}
                        >
                          <svg
                            className="flex-shrink-0 size-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm md:text-lg font-bold">
                    {toRupiah(i.cart_price)}
                  </h3>
                  <h3 className="text-sm md:text-lg font-bold">
                    {toRupiah(i.cart_price * i.cart_total)}
                  </h3>
                  <button
                    className="btn border border-black text-black bg-white hover:bg-black hover:text-white"
                    onClick={() => {
                      deleteData(i.id);
                    }}
                  >
                    Delete
                  </button>
                  <input
                    type="checkbox"
                    checked={checkedItems[i.id]}
                    onChange={(e) => handleCheckboxChange(e, i.id)}
                    className="w-4 h-4 mb-3 lg:mb-0"
                  />
                </div>
              ))}
            </div>
          </div>

          <form
            className="fixed bottom-0 w-full bg-white dark:bg-black border-t border-gray-300"
            onClick={handleCheckout}
          >
            <div className="px-4 md:px-32 py-3">
              <div className="flex justify-between">
                <h2 className="font-bold">Total:</h2>
                <h2 className="font-bold">{toRupiah(getTotalPrice)}</h2>
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-2 font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:-translate-y-1 hover:scale-105 duration-300"
              >
                checkout
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CartPage;
