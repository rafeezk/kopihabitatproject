import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BeanPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const getBean = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api`);
      setData(res.data);
    } catch (error) {
      console.error("error fetching data :(", error);
    }
  };

  function truncate(str) {
    return str.length > 14 ? str.substring(0, 14) + "..." : str;
  }

  const convertToRupiah = (priceInDollar) => {
    const exchangeRate = 15000; // Assume 1 dollar = Rp 15,000
    const priceInRupiah = priceInDollar * exchangeRate;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(priceInRupiah);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    getBean();
  }, []);

  return (
    <>
      <section
        className="product h-auto bg-[#F3F4F6] p-4 sm:p-6 md:p-8 lg:h-[92vh] lg:p-0 dark:bg-[#221f1f]"
        id="product"
      >
        <div className="title text-center">
          <h2 className="font-bold text-2xl sm:text-2xl md:text-3xl pt-11 text-black dark:text-white">
            Special Roasted
          </h2>
          <p className="text-sm sm:text-base pt-2 pb-2 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
            quod?
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-[4rem] items-center justify-center mt-5 sm:mt-8 md:mt-10">
          {currentItems.map((item) => (
            <div
              className="card w-[265px] sm:w-1/2 md:w-1/3 lg:w-60 h-auto md:h-[360px] rounded-md border-[0.1px] border-black shadow-xl text-white bg-white dark:bg-[#252525] p-4 md:p-0"
              key={item.id}
            >
              <figure>
                <img
                  src={item.image_url}
                  className="h-36 w-full object-cover mt-5"
                  alt="Product"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-black dark:text-white">{truncate(item.name)}</h2>
                <div className="flex justify-between">
                  <p className="text-black dark:text-white">{convertToRupiah(item.price)}</p>
                  <p className="text-black text-end dark:text-white">{item.weight}gr</p>
                </div>
              </div>
              <Link to={`/detail/${item.id}`} className="px-5">
                <button
                  className="btn btn-outline w-full mb-5 text-black font-light border-black transition ease-in-out delay-150 
                  hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white duration-300 dark:bg-black dark:text-white"
                >
                  view details
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center py-5">
          <div>
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`text-black dark:text-white h-10 mt-5 hover:bg-black hover:text-white duration-500 rounded-full w-10 mx-1 
                ${currentPage === number && "bg-black text-white"}`}
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

export default BeanPage;
