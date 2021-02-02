import Link from "next/link";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

import Logo from "../images/logo.svg";
import RedditTextLogo from "../images/reddit.svg";
import {
  logout,
  stopLoading,
  useAuthDispatch,
  useAuthState,
} from "../contexts/auth";

export default function Navbar() {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(stopLoading());
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-4 bg-white">
      <Link href="/">
        <a className="flex items-center h-full">
          <Logo className="w-8 h-8 mr-2" />
          <RedditTextLogo className="h-5" />
        </a>
      </Link>

      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
        <div className="pl-4 pr-3">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
          placeholder="Search"
        />
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              onClick={handleLogout}
              className="w-32 py-1 mr-4 outlined blue button"
            >
              log out
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="w-32 py-1 mr-4 outlined blue button">log in</a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 blue button">sign up</a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}
