import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import InputGroup from "../components/InputGroup";
import {
  login,
  stopLoading,
  useAuthDispatch,
  useAuthState,
} from "../contexts/auth";

export default function Login() {
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  if (authenticated) {
    router.push("/");
  }

  const handlInputFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: user } = await axios.post("/auth/login", formFields);
      dispatch(login(user));
      router.push("/");
    } catch (error) {
      setErrors(error.response.data);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/wall.jpeg')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={handleSubmit}>
            <InputGroup
              className="mb-2"
              value={formFields.username}
              onChange={handlInputFieldChange}
              placeholder="USERNAME"
              name="username"
              type="text"
            />
            <InputGroup
              className="mb-2"
              value={formFields.password}
              onChange={handlInputFieldChange}
              placeholder="PASSWORD"
              name="password"
              type="password"
            />
            <small className="block mb-4 font-medium text-red-600">
              {errors.message}
            </small>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            New to Reddit?
            <Link href="/register">
              <a className="ml-1 font-bold text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
