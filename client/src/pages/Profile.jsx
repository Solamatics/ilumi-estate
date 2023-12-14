import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setUploadFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [listings, setListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const resetUpdateSuccess = () => {
      setUpdateSuccess(false);
    };

    if (updateSuccess) {
      const timer = setTimeout(resetUpdateSuccess, 10000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleUpload = (file) => {
    const storage = getStorage(app);
    //create unique name for each file uploads.
    //the data function helps to ensure that if an image is uploaded more than once, the name remains unique
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setUploadFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL })),
        );
      },
    );
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  //handleProfile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateProfileStart());
      const response = await axios.post(
        `${URL}/api/user/update/${currentUser?._id}`,
        formData,
      );

      const data = response.data;
      console.log("data", data.username);

      if (data.success === false) {
        dispatch(updateProfileFailure(data.response.data.message));
        return;
      }
      console.log(data);
      dispatch(updateProfileSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      console.log(err);
      dispatch(updateProfileFailure(err?.message));
    }
  };

  //handleDeleteProfile
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `${URL}/api/user/delete/${currentUser?._id}`,
      );
      const data = response.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.response.data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(ata.response.data.message));
    }
  };

  //handleSignOut
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const response = await axios.get(`${URL}/api/auth/signout`);
      const data = response.data;
      if (data.success === false) {
        dispatch(signOutFailure(data.response.data.message));
      }
      dispatch(signOutSuccess(data));
    } catch (err) {
      console.log(err);
    }
  };

  //show lisitng
  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const response = await axios.get(
        `${URL}/api/user/listings/${currentUser?._id}`,
      );
      const data = response.data;
      console.log("data :", data);
      if (data.success === false) {
        setShowListingsError(true);
      }
      setListings(data);
    } catch (error) {
      setShowListingsError(true);
      return;
    }
  };

  //delete listing
  const handleDeleteListing = async (id) => {
    try {
      const response = await axios.delete(`${URL}/api/listing/delete/${id}`)
      const data = response.data

     if (data.success === false) {
       console.log(data.message);
       return;
     }
     setListings((prev) => prev.filter((listing) => listing._id !== id))
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.avatar || currentUser?.avatar || currentUser?.user.avatar
          }
          alt="profile"
          className="my-2 rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error during image uploade (image size must not exceed 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser?.username || currentUser?.user.username}
          onChange={handleChange}
          className="border p-3 rounded-md focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser?.email || currentUser?.user.email}
          onChange={handleChange}
          className="border p-3 rounded-md focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-md focus:outline-none"
        />
        <button className="bg-slate-700 disabled={laoding} text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex items-center justify-between mt-4">
        <span
          className="text-red-500 font-semibold cursor-pointer"
          onClick={handleDelete}
        >
          Delete Account
        </span>
        <span
          className="text-red-500 font-semibold cursor-pointer"
          onClick={handleSignOut}
        >
          Sign out
        </span>
      </div>
      <p className="text-green-700 text-center">
        {updateSuccess ? "User updated successfully" : null}
      </p>
      <p className="text-red-800 text-center">{error ? error : ""}</p>
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {listings && listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-normal font-semibold">
            Your Listing
          </h1>
          {listings?.map((listing) => (
            <div
              key={listing?._id}
              className="flex items-center justify-between gap-4 border rounded-lg p-3"
            >
              <Link to={`listing/${listing?._id}`}>
                <img
                  src={listing?.imageUrls[0]}
                  alt="listing cover"
                  className="w-16 h-16 object-contain"
                />
              </Link>
              <Link
                to={`listing/${listing?._id}`}
                className="flex-1 text-slate-700 text-sm font-semibold hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col">
                <button
                  className="text-red-700 uppercase"
                  onClick={() => handleDeleteListing(listing?._id)}
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
