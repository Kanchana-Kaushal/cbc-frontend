import { IoStar } from "react-icons/io5";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function ProductReviews({
  reviews,
  productId,
  setProduct,
  setReviews,
} = props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [userReview, setUserReview] = useState("");
  const [rate, setRate] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [errorTxt, setErrorTxt] = useState("");
  const [expanded, setExpanded] = useState({}); // Track which reviews are expanded

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      setReviews(response.data.data.reviews);
      setProduct(response.data.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  function readReview(e) {
    setUserReview(e.currentTarget.value);
  }

  async function submitReview() {
    const loadingToastId = toast.loading("Submitting Review...");
    try {
      if (rate == 0) {
        toast.error("Please select a star to rate the product", {
          id: loadingToastId,
        });
        return;
      }

      if (userReview.length < 4) {
        toast.error("Review is too short", { id: loadingToastId });
        return;
      }

      if (userReview.length >= 500) {
        toast.error("Review is too long", { id: loadingToastId });
        return;
      }

      if (!user || !token) {
        toast.dismiss(loadingToastId);
        setErrorTxt("You need to Sign in  to leave a review");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/add-review`,
        { userId: user.userId, rating: rate, description: userReview },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      refreshReviews();
      toast.success("Review added successfully", { id: loadingToastId });
    } catch (err) {
      toast.dismiss(loadingToastId);

      if (err.response?.data?.error === "User unauthorized") {
        setErrorTxt("You need to Sign in again to leave a review");
      }

      if (
        err.response?.data?.error === "You have already reviewed this product"
      ) {
        setErrorTxt(err.response?.data?.error);
      }

      if (
        err.response?.data?.error ===
        "You must purchase and recieve this product to leave a review"
      ) {
        setErrorTxt(err.response?.data?.error);
      }
    }
  }

  async function deleteReview(reviewId) {
    const loadingToastId = toast.loading("Deleting Review...");

    try {
      if (!user || !token) {
        toast.dismiss(loadingToastId);
        setErrorTxt("You need to Sign in to delete a review");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/reviews/${reviewId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      refreshReviews();
      toast.success("Review deleted successfully", { id: loadingToastId });
    } catch (err) {
      if (err.response?.data?.error === "User unauthorized") {
        toast.dismiss(loadingToastId);
        setErrorTxt("You need to Sign in again to delete a review");
      } else {
        toast.error("Failed to delete review", { id: loadingToastId });
      }
    }
  }

  const userAvatar =
    user?.avatar ||
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  let reviewText;

  switch (rate) {
    case 1:
      reviewText = "Very Bad";
      break;
    case 2:
      reviewText = "Not Good";
      break;
    case 3:
      reviewText = "Okay";
      break;
    case 4:
      reviewText = "Good";
      break;
    case 5:
      reviewText = "Excellent";
      break;
    default:
      reviewText = "";
      break;
  }

  const whenUnauthorized = () => {
    setErrorTxt("");
    navigate("/auth");
  };

  function getPreviewText(text, id) {
    const words = text.trim().split(/\s+/);
    const isLong = words.length > 50;
    const isExpanded = expanded[id];

    if (!isLong) return text;
    if (isExpanded) return text;

    return words.slice(0, 50).join(" ") + "...";
  }

  function toggleExpand(id) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <>
      <section className="mx-auto mb-25 w-9/10">
        <h2 className="mt-15 text-center text-xl font-semibold">Reviews</h2>
        <div className="mt-8 flex flex-wrap items-center gap-5 text-gray-400">
          <img
            src={userAvatar}
            className="size-9 rounded-full object-cover object-center"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              return (
                <IoStar
                  className={`size-7 ${hovered >= star && "text-amber-500"} ${rate >= star && "text-amber-500"} cursor-pointer transition-colors`}
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRate(star)}
                />
              );
            })}
          </div>

          <p className="w-full text-center text-lg md:w-fit">
            <span className="mx-4 hidden text-black md:inline"> | </span>{" "}
            {reviewText}
          </p>
        </div>
        <textarea
          name="review"
          id="review"
          value={userReview}
          onChange={readReview}
          className="mt-4 min-h-25 w-full rounded-lg bg-white p-4 text-gray-800 ring-1 ring-gray-400 outline-0 transition-all focus:ring-2 focus:ring-blue-500"
          placeholder="Write your experience with this product."
        />
        <div className="mt-2 flex w-full items-center justify-end transition">
          <button
            className={`bg-accent ring-accent cursor-pointer rounded-md px-4 py-1 text-white transition-all hover:bg-white hover:text-black hover:ring-1`}
            onClick={submitReview}
          >
            Submit
          </button>
        </div>

        {reviews.length >= 1 && (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold">Customer Reviews</h2>

            {reviews.map((elem) => {
              const isLong =
                elem.review.description.trim().split(/\s+/).length > 20;
              const isExpanded = expanded[elem.review._id];
              const isOwner = user && elem.review.userId === user.userId;

              return (
                <article
                  className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  key={elem.review._id}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={elem.user.avatar}
                        alt="user-avatar"
                        className="size-9 rounded-full object-cover object-center"
                      />

                      <div>
                        <p className="font-bold">{elem.user.username}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {dayjs(elem.review.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => deleteReview(elem.review._id)}
                        className="cursor-pointer rounded px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="my-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <IoStar
                        className={`${
                          elem.review.rating >= index
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}
                        key={index}
                      />
                    ))}
                  </div>

                  <p className="text-justify leading-relaxed">
                    {getPreviewText(elem.review.description, elem.review._id)}
                  </p>

                  <div className="w-full">
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(elem.review._id)}
                        className="text-accent float-right mb-4 w-fit cursor-pointer text-sm font-medium transition-all hover:underline"
                      >
                        {isExpanded ? "▲ Collapse" : "▼ Expand"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <ErrorModal
          errorText={errorTxt}
          buttonText={errorTxt.includes("Sign in") ? "Sign In" : "Okay"}
          onButtonClick={
            errorTxt.includes("Sign in")
              ? whenUnauthorized
              : () => setErrorTxt("")
          }
        />
      </section>
    </>
  );
}
export default ProductReviews;
