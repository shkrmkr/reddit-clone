import { AppProps } from "next/app";
import { useRouter } from "next/router";
import axios from "axios";
import { SWRConfig } from "swr";

import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../contexts/auth";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];

  return (
    <SWRConfig value={{ fetcher }}>
      <AuthProvider>
        {!authRoutes.includes(pathname) && <Navbar />}
        <div className={!authRoutes.includes(pathname) ? "pt-12" : ""}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}
