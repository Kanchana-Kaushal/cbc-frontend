import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoAdd, IoCloseOutline } from "react-icons/io5";
import { uploadMedia } from "../../utils/supabase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProductsPage() {
  const [keywords, setKeywords] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const filteredImages = images.filter((image) => image !== null);

    if (filteredImages.length < 1) {
      toast.error("Please select at least one image");
      return;
    }

    if (keywords.length < 0) {
      toast.error("Please enter at least one keyword");
      return;
    }

    const imageUrls = await Promise.all(
      filteredImages.map(async (image) => {
        const url = await uploadMedia(image);

        return url;
      }),
    );

    const newProduct = {
      name: data.name,
      description: data.description,
      images: imageUrls,
      category: data.category,
      brand: data.brand,
      keywords: keywords,
      priceInfo: {
        markedPriceCents: data.markedPrice,
        sellingPriceCents: data.sellingPrice,
      },
      inventory: {
        stockLeft: data.stock,
      },
    };

    const loadingToastId = toast.loading("Loading...");

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/products/add-new",
        newProduct,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Product Saved Successfully!", { id: loadingToastId });
      navigate("/admin/products");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating the product",
        { id: loadingToastId },
      );
    }
  };

  const addKeyWord = () => {
    const keyWord = watch("keyword");
    setKeywords((prev) => [...prev, keyWord]);
    setValue("keyword", "");
  };

  const removeKeyword = (keyword) => {
    setKeywords((prev) => prev.filter((elem) => elem !== keyword));
  };

  const addImage = (files, index) => {
    const image = files[0];

    setImages((prev) => {
      const updated = [...prev];
      updated[index] = image;
      return updated;
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 min-h-screen w-7/10 rounded-2xl bg-white p-12 drop-shadow-2xl"
    >
      <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>

      <label htmlFor="name">Name:</label>
      <input
        type="text"
        {...register("name", {
          required: "Product name is required",
          maxLength: {
            value: 75,
            message: "Name should not be more than 75 characters",
          },
        })}
        className="mt-1 mb-4 w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
        placeholder="Vaseline body lotion"
      />
      {errors.name && (
        <p className="-mt-3 mb-4 text-sm text-red-500">{errors.name.message}</p>
      )}

      <label htmlFor="brand">Brand:</label>
      <input
        type="text"
        {...register("brand", { required: "Brand is required" })}
        className="mt-1 mb-4 w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
        placeholder="Vaseline"
      />
      {errors.brand && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.brand.message}
        </p>
      )}

      <label htmlFor="marked-price">Marked Price ($. Cents):</label>
      <input
        type="text"
        {...register("markedPrice", {
          required: "Marked price is required",
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Invalid price format",
          },
        })}
        className="mt-1 mb-4 w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
        placeholder="1299"
      />
      {errors.markedPrice && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.markedPrice.message}
        </p>
      )}

      <label htmlFor="selling-price">Selling Price ($. Cents):</label>
      <input
        type="text"
        {...register("sellingPrice", {
          required: "Selling price is required",
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Invalid price format",
          },
          validate: (value) => {
            const markedPrice = parseFloat(watch("markedPrice"));
            const sellingPrice = parseFloat(value);
            if (!isNaN(markedPrice) && !isNaN(sellingPrice)) {
              return (
                sellingPrice < markedPrice ||
                "Selling price must be less than marked price"
              );
            }
            return true;
          },
        })}
        className="mt-1 mb-4 w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
        placeholder="1099"
      />
      {errors.sellingPrice && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.sellingPrice.message}
        </p>
      )}

      {/* images */}

      <label className="mb-2 block">Images:</label>
      <div className="mb-6 flex items-center gap-6">
        {images.map((id, index) => (
          <label
            key={index}
            htmlFor={index}
            className="group relative block h-30 w-30 cursor-pointer transition"
          >
            <img
              src={images[index] ? URL.createObjectURL(images[index]) : null}
              className="h-full w-full object-cover"
            />
            <IoAdd className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-4xl text-white opacity-0 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50"></div>
            <input
              type="file"
              name={index}
              id={index}
              className="hidden"
              onChange={(e) => {
                addImage(e.target.files, index);
              }}
            />
          </label>
        ))}
      </div>

      <label htmlFor="description">Description:</label>
      <textarea
        {...register("description", { required: "Description is required" })}
        className="mb-4 w-full rounded-lg p-2 ring-1 ring-gray-300"
        placeholder="Describe about the product"
      ></textarea>
      {errors.description && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.description.message}
        </p>
      )}

      <label htmlFor="stock">Stock Count:</label>
      <input
        type="text"
        {...register("stock", {
          required: "Stock count is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Stock must be a number",
          },
        })}
        className="mt-1 mb-4 w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
        placeholder="100"
      />
      {errors.stock && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.stock.message}
        </p>
      )}

      <label htmlFor="category">Category:</label>
      <select
        {...register("category", { required: "Category is required" })}
        className="mt-1 mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="">Select category</option>
        <option value="skincare">Skincare</option>
        <option value="makeup">Makeup</option>
        <option value="haircare">Haircare</option>
        <option value="fragrance">Fragrance</option>
        <option value="men">Men</option>
        <option value="gifts_sets">Gifts & Sets</option>
      </select>
      {errors.category && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.category.message}
        </p>
      )}

      <label htmlFor="keyword">Keywords:</label>
      <div className="mb-4 flex items-center gap-6">
        <input
          type="text"
          {...register("keyword")}
          className="w-full rounded-lg p-2 shadow-xs ring-1 ring-gray-300"
          placeholder="e.g. mens, fragrance, lotion, deodorant, etc."
        />
        <button
          type="button"
          className="cursor-pointer rounded-md bg-blue-500 px-6 py-2 text-white"
          onClick={addKeyWord}
        >
          Add
        </button>
      </div>

      <div className="mb-4 flex min-h-30 flex-wrap items-start gap-4 p-4 ring-1 ring-gray-300">
        {keywords.map((keyword, index) => (
          <span
            className="flex w-fit items-center gap-2 bg-gray-300 p-1 text-sm"
            key={index}
          >
            {keyword}
            <IoCloseOutline
              onClick={() => {
                removeKeyword(keyword);
              }}
              className="text-lg hover:text-red-500"
            />
          </span>
        ))}
      </div>

      <button
        type="submit"
        className="mt-8 w-full cursor-pointer rounded-md bg-green-500 p-2 text-lg text-white"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProductsPage;
