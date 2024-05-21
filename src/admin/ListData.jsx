import { v4 as uuidv4 } from "uuid";
import { supabase } from "../createClient";
import { useEffect, useState } from "react";

const ListData = () => {
  const [coffees, setCoffees] = useState([]);

  const [imageUpload, setImageUpload] = useState([]);

  const [coffee, setCoffee] = useState({
    coffee_name: "",
    coffee_description: "",
    coffee_ingredients: "",
    coffee_price: 0,
  });
  // console.log(imageUpload);

  const [coffee2, setCoffee2] = useState({
    id: "",
    coffee_name: "",
    coffee_description: "",
    coffee_ingredients: "",
    coffee_price: "",
    coffee_image: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from("coffees").select("*");
    setCoffees(data);
    // console.log(data[0].images);
    // console.log(data);
  }

  const createData = async (e) => {
    e.preventDefault();

    const filename = `${uuidv4(imageUpload.name)}`;
    try {
      const { data } = await supabase.storage
        .from("coffee_images")
        .upload(`images/${filename}`, imageUpload, {
          cacheControl: "3600",
          upsert: true,
        });
      if (data) {
        console.log("upload image success");
      }
    } catch (error) {
      console.error(error);
    }

    const { error } = await supabase.from("coffees").insert({
      coffee_name: coffee.coffee_name,
      coffee_description: coffee.coffee_description,
      coffee_ingredients: coffee.coffee_ingredients,
      coffee_price: coffee.coffee_price,
      images: filename,
    });

    if (error) {
      console.error("Error creating data:", error);
    } else {
      window.location.reload();
    }
  };

  const deleteData = async (id) => {
    const { data: getImageProduct } = await supabase
      .from("coffees")
      .select("images")
      .eq("id", id);

    const { data: getImage } = await supabase.storage
      .from("coffee_images")
      .remove([`images/${getImageProduct[0].images}`]);

    const { error } = await supabase.from("coffees").delete().eq("id", id);
    if (!error && getImage) {
      alert("delete data successfull");
      window.location.reload();
    }
    fetchData();
  };

  async function updateData(userId) {
    // e.preventDefault()
    const filename = `${uuidv4(imageUpload.name)}`;

    if (imageUpload.length === 0) {
      const { error } = await supabase
        .from("coffees")
        .update({
          coffee_name: coffee2.coffee_name,
          coffee_description: coffee2.coffee_description,
          coffee_ingredients: coffee2.coffee_ingredients,
          coffee_price: coffee2.coffee_price,
          images: coffee2.coffee_image,
        })
        .eq("id", userId);

      fetchData();

      if (!error) {
        alert("update succesfull!");
        window.location.reload();
      }
    } else {
      const { data: deleteImage } = await supabase.storage
        .from("coffee_images")
        .remove([`images/${coffee2.images}`]);

      if (deleteImage) {
        const { data: updateData } = await supabase.storage
          .from("coffee_images")
          .upload(`images/${filename}`, imageUpload, {
            cacheControl: "3600",
            upsert: true,
          });

        if (updateData) {
          const { error } = await supabase
            .from("coffees")
            .update({
              coffee_name: coffee2.coffee_name,
              coffee_description: coffee2.coffee_description,
              coffee_ingredients: coffee2.coffee_ingredients,
              coffee_price: coffee2.coffee_price,
              images: filename,
            })
            .eq("id", userId);

          if (!error) {
            alert("update succesfull!");
            window.location.reload();
          }
        }
      }
    }
  }

  function handleChange(event) {
    setCoffee((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  console.log(coffees);

  function handleChangeUpdate(event) {
    setCoffee2((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  function displaycoffee(userId) {
    coffees.map((coffee) => {
      if (coffee.id == userId) {
        setCoffee2({
          id: coffee.id,
          coffee_name: coffee.coffee_name,
          coffee_description: coffee.coffee_description,
          coffee_ingredients: coffee.coffee_ingredients,
          coffee_price: coffee.coffee_price,
        });
      }
    });
  }

  const getImage = (filename) => {
    const publicUrl = supabase.storage
      .from("coffee_images")
      .getPublicUrl("images/" + filename).data.publicUrl;
    return publicUrl;
  };

  const handleImage = (e) => {
    setImageUpload(e.target.files[0]);
    console.log(e.target.files[0]);
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
    <section className="">
      <h2 className="py-8 font-bold text-3xl text-center text-black italic underline">
        coffee data
      </h2>
      <div className="overflow-x-auto px-5">
        <div className="py-3">
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            + create data
          </button>
        </div>
        <table className="table table-zebra border-2 border-black">
          {/* head */}
          <thead className="text-center">
            <tr className="border-2 border-black">
              <th>No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Ingredients</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {coffees.map((i, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <img
                    src={getImage(i.images)}
                    className="w-14 h-10 object-cover"
                  />
                </td>
                <td>{i.coffee_name}</td>
                <td>{i.coffee_description}</td>
                <td>{i.coffee_ingredients}</td>
                <td>{toRupiah(i.coffee_price)}</td>
                <td>
                  <button
                    className="btn btn-primary text-white mx-1"
                    onClick={() => {
                      displaycoffee(i.id);
                      document.getElementById("my_modal_2").showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error text-white lg:mt-0 mt-2"
                    onClick={() => {
                      deleteData(i.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal 1 for adding data */}
      <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action flex items-center justify-center">
            <form
              method="dialog"
              className="flex flex-col gap-3 w-full"
              onSubmit={createData}
            >
              <label className="text-base font-medium">Product Name</label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_name"
                type="text"
                placeholder="type here..."
                onChange={handleChange}
              />
              <label className="text-base font-medium">
                Product Description
              </label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_description"
                type="text"
                placeholder="type here..."
                onChange={handleChange}
              />
              <label className="text-base font-medium">
                Product Ingredients
              </label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_ingredients"
                type="text"
                placeholder="type here..."
                onChange={handleChange}
              />
              <label className="text-base font-medium">Product Price</label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_price"
                type="number"
                placeholder="type here..."
                onChange={handleChange}
              />
              <label className="text-base font-medium">Product Image</label>
              <input
                className="file-input file-input-bordered w-full"
                name="images"
                type="file"
                placeholder="type here..."
                onChange={handleImage}
              />
              <button type="submit" className="btn btn-success mt-5">
                Add
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("my_modal_1").close()}
                className="btn btn-outline btn-error"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* form 2 */}

      <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action flex items-center justify-center">
            <form
              method="dialog"
              className="flex flex-col gap-3 w-full"
              onSubmit={() => updateData(coffee2.id)}
            >
              <label className="text-base font-medium">Product Name</label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_name"
                type="text"
                placeholder="type here..."
                onChange={handleChangeUpdate}
                defaultValue={coffee2.coffee_name}
              />
              <label className="text-base font-medium">
                Product Description
              </label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_description"
                type="text"
                placeholder="type here..."
                onChange={handleChangeUpdate}
                defaultValue={coffee2.coffee_description}
              />
              <label className="text-base font-medium">
                Product Ingredients
              </label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_ingredients"
                type="text"
                placeholder="type here..."
                onChange={handleChangeUpdate}
                defaultValue={coffee2.coffee_ingredients}
              />
              <label className="text-base font-medium">Product Price</label>
              <input
                className="input input-bordered border-black input-md"
                name="coffee_price"
                type="text"
                placeholder="type here..."
                onChange={handleChangeUpdate}
                defaultValue={coffee2.coffee_price}
              />
              <label className="text-base font-medium">Product Image</label>
              <input
                className="input input-bordered border-black input-md"
                name="images"
                type="file"
                placeholder="type here..."
                onChange={handleImage}
                defaultValue={coffee2.product_image}
              />

              <button type="submit" className="btn btn-success mt-5">
                Save Changes
              </button>
              <button className="btn btn-outline btn-error">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default ListData;
