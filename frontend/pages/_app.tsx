import { AppProps } from "next/app";
import { useRouter } from "next/router";
import axios from "axios";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];

  return (
    <>
      {!authRoutes.includes(pathname) && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
