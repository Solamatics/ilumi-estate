import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom"

const OAuth = () => {
  const dispatch = useDispatch();

  const URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const response = await axios.post(`${URL}/api/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      const data = response.data;
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-500 uppercase rounded-lg p-3 text-white hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
