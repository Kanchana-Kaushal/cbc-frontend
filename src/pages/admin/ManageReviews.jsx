import { useLocation } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

function ManageReviews() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const productId = location.state.productId;
  const [reviews, setReviews] = useState(location.state.reviews || []);
  const [expanded, setExpanded] = useState({}); // Track which reviews are expanded

  async function toggleHide(reviewId, hidden) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/hide-review`,
        {
          reviewId,
          hidden: hidden,
        },
        { headers: { Authorization: "Bearer " + token } },
      );

      toast.success(response.data.message);
      setReviews(response.data.data.product.reviews);
    } catch (err) {
      console.log(err.response.data.error);
    }
  }

  function toggleExpand(id) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function getPreviewText(text, id) {
    const words = text.trim().split(/\s+/);
    const isLong = words.length > 20;
    const isExpanded = expanded[id];

    if (!isLong) return text;
    if (isExpanded) return text;

    return words.slice(0, 20).join(" ") + "...";
  }

  return (
    <section className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Manage Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center text-gray-500">No reviews to display.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isLong = review.description.trim().split(/\s+/).length > 20;
            const isExpanded = expanded[review._id];

            return (
              <div
                key={review._id}
                className={`flex w-full flex-col rounded-xl p-6 shadow-md ${review.hidden ? "bg-gray-200 opacity-70" : "bg-white"}`}
              >
                <div className="mb-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">
                        User ID:
                      </span>{" "}
                      {review.userId}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Rating:
                      </span>{" "}
                      {review.rating} ⭐
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Status:
                      </span>{" "}
                      {review.hidden ? "Hidden" : "Visible"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Posted:
                      </span>{" "}
                      {dayjs(review.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                <p className="mb-2 text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                  {getPreviewText(review.description, review._id)}
                </p>

                {isLong && (
                  <button
                    onClick={() => toggleExpand(review._id)}
                    className="mb-4 w-max text-sm font-medium text-blue-600"
                  >
                    {isExpanded ? "▲ Collapse" : "▼ Expand"}
                  </button>
                )}

                <button
                  onClick={() => toggleHide(review._id, !review.hidden)}
                  className={`w-max self-end rounded px-5 py-2 font-medium transition ${
                    review.hidden
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {review.hidden ? "Unhide" : "Hide"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ManageReviews;
