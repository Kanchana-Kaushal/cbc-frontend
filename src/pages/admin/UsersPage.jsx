import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function UserPage() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUsers(data.data.users);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    })();
  }, [isLoading]);

  const tableContent = users.map((user) => {
    const { _id, username, avatar, email, role, banned } = user;

    return (
      <tr key={_id} className="cursor-pointer transition hover:bg-gray-50">
        <td className="px-6 py-4">
          <img
            src={avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover object-center"
          />
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">{username}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{email}</td>
        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{role}</td>
        <td className="">
          <button
            className={`${banned && "bg-red-400 text-white"} min-w-20 cursor-pointer rounded-md p-1 font-semibold ring-1 ring-gray-300 hover:bg-red-400 hover:text-white`}
            onClick={() => {
              banUser(_id, !banned);
            }}
          >
            {banned ? "Unban" : "Ban"}
          </button>
        </td>
      </tr>
    );
  });

  const banUser = async (userId, banned) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/ban-user`,
        { userId, banned },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("User banned successfully");
      setIsLoading(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to ban user");
    }
  };

  return (
    <>
      <section className="relative">
        <h1 className="text-3xl font-bold">Users</h1>
        <hr className="mt-4 mb-8" />

        {isLoading ? (
          <div className="mt-50 flex h-full w-full items-center justify-center">
            <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                {["Avatar", "Username", "Email", "Role", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tableContent}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default UserPage;
