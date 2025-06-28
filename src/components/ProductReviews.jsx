import { IoStar } from "react-icons/io5";
import { IoIosStarHalf } from "react-icons/io";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function ProductReviews({ reviews, productId, setIsLoading } = props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [userReview, setUserReview] = useState("");
  const [rate, setRate] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [errorTxt, setErrorTxt] = useState("");

  function readReview(e) {
    setUserReview(e.currentTarget.value);
  }

  async function submitReview() {
    try {
      if (rate == 0) {
        const err = new Error();
        err.message = "Please select a star to rate the product";
        throw err;
      }

      if (userReview.length < 4) {
        const err = new Error();
        err.message = "Review must contain at least 4 characters";
        throw err;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/add-review`,
        { userId: user.userId, rating: rate, description: userReview },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      setIsLoading(true);
      toast.success("Review added successfully");
      console.log(response.data);
    } catch (err) {
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
        setErrorTxt(
          "You must purchase and recieve this product to leave a review",
        );
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

  console.log(reviews);

  return (
    <>
      <section className="mx-auto mb-25 w-9/10">
        <h2 className="mt-15 text-center text-xl font-semibold">Reviews</h2>
        <div className="mt-8 flex flex-wrap items-center gap-5 text-gray-400">
          <img src={userAvatar} className="size-9 rounded-full" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              return (
                <IoStar
                  className={`size-7 ${hovered >= star && "text-amber-500"} ${rate >= star && "text-amber-500"} cursor-pointer`}
                  key={star}
                  onMouseEnter={() => {
                    setHovered(star);
                  }}
                  onMouseLeave={() => {
                    setHovered(0);
                  }}
                  onClick={() => {
                    setRate(star);
                  }}
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
          onChange={readReview}
          className="mt-4 min-h-25 w-full rounded-lg bg-white p-4 text-gray-800 ring-1 ring-gray-400 outline-0"
          placeholder="Write your experience with this product."
        ></textarea>
        <div className="mt-2 flex w-full items-center justify-end transition">
          <button
            className="bg-accent ring-accent cursor-pointer rounded-md px-4 py-1 text-white hover:bg-white hover:text-black hover:ring-1"
            onClick={submitReview}
          >
            Submit
          </button>
        </div>
        {reviews.length >= 1 && (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold">Customer Reviews</h2>

            {reviews.map((elem) =>
              elem.review.hidden ? null : (
                <article className="p-4" key={elem.review._id}>
                  <div className="flex items-center gap-4">
                    <img
                      src={elem.user.avatar}
                      alt="user-avatar"
                      className="size-9 rounded-full"
                    />

                    <div>
                      <p className="font-bold">{elem.user.username}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {dayjs(elem.review.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="my-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <IoStar
                        className={`${elem.review.rating >= index ? "text-amber-500" : "text-gray-400"}`}
                        key={index}
                      />
                    ))}
                  </div>

                  <p className="text-justify">{elem.review.description}</p>
                </article>
              ),
            )}
          </section>
        )}

        <ErrorModal
          errorText={errorTxt}
          buttonText={"Okay"}
          onButtonClick={whenUnauthorized}
        />

        <ErrorModal
          errorText={errorTxt}
          buttonText={"Okay"}
          onButtonClick={() => {
            setErrorTxt("");
          }}
        />
      </section>
    </>
  );
}
export default ProductReviews;
