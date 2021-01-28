import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import InputGroup from "../components/InputGroup";

export default function Register() {
  const [formFields, setFormFields] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const handlInputFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", formFields);

      router.push("/");
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/wall.jpeg')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={handleSubmit}>
            <InputGroup
              className="mb-2"
              value={formFields.email}
              onChange={handlInputFieldChange}
              error={errors.email}
              placeholder="EMAIL"
              name="email"
              type="text"
            />
            <InputGroup
              className="mb-2"
              value={formFields.username}
              onChange={handlInputFieldChange}
              error={errors.username}
              placeholder="USERNAME"
              name="username"
              type="text"
            />
            <InputGroup
              className="mb-4"
              value={formFields.password}
              onChange={handlInputFieldChange}
              error={errors.password}
              placeholder="PASSWORD"
              name="password"
              type="password"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Register
            </button>
          </form>
          <small>
            Already a redditor?
            <Link href="/login">
              <a className="ml-1 font-bold text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
