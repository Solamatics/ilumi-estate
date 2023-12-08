import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});

  const URL = import.meta.env.VITE_BASE_URL;

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //hamdle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(signInStart());
  //     const response = await axios.post(`${URL}/api/auth/signin`, formData);
  //     const data = response.data;

  //     if (data.success === false) {
  //       dispatch(signInFailure(data.response.data.message));
  //       return;
  //     }
  //     dispatch(signInSuccess(data));
  //     navigate("/");
  //   } catch (error) {
  //     dispatch(signInFailure(error?.response?.data?.message));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post(`${URL}/api/auth/signin`, formData, {
        headers: {
          "Content-Type": "application/json",
          // Add the Authorization header with the token
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = response.data;

      console.log("data :", data);

      if (data.access_token) {
        // Store the token securely on the client side (e.g., in local storage)
        localStorage.setItem("access_token", data.access_token);

        // Set the token in the Authorization header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        // Dispatch success action or update the state as needed
        dispatch(signInSuccess(data.user));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error?.response?.data?.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3 focus:outline-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3 focus:outline-none"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
        >
          {loading ? "Loading... " : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex items-center gap-2 mt-5">
        <p>Don&apos;t have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;
