import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { MdSearch, MdHourglassTop } from "react-icons/md";

function UserPage() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      (async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/users?query=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setUsers(data.data.users);

          if (isLoading === true) {
            setIsLoading(false);
          }

          if (isSearching === true) {
            setIsSearching(false);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      })();
    }, 300);

    return () => clearTimeout(timeOut);
  }, [query, isLoading]);

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
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/ban-user`,
        { userId, banned },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message);
      setIsLoading(true);
    } catch (error) {
      console.log(response);
      toast.error(error.response?.data?.message || "Failed to ban user");
    }
  };

  return (
    <>
      <section className="relative">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>

          <div className="mt-6 w-1/3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                <MdSearch className="h-4 w-4 text-gray-500 md:h-5 md:w-5" />
              </div>
              <input
                type="text"
                placeholder="Search Products..."
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none md:py-3 md:pr-5 md:pl-12 md:text-base"
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                  setIsSearching(true);
                }}
              />
            </div>
          </div>
        </div>
        <hr className="mt-4 mb-8" />

        {isLoading ? (
          <div className="mt-50 flex h-full w-full items-center justify-center">
            <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
          </div>
        ) : (
          <>
            {isSearching ? (
              <div className="flex w-full items-center justify-center pt-15">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <MdHourglassTop className="h-8 w-8 animate-bounce text-blue-600 md:h-10 md:w-10" />
                  </div>
                  <p className="animate-pulse text-sm font-medium text-gray-700">
                    Finding Users...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {users.length > 0 ? (
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
                ) : (
                  <>
                    {/* Empty State */}
                    {users.length === 0 && (
                      <div className="col-span-5 py-12 text-center md:py-20">
                        <h3 className="mb-1 text-lg font-semibold text-gray-600 md:mb-2 md:text-xl">
                          No Users found
                        </h3>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default UserPage;
