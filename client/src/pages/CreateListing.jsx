import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imgUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    parlour: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const URL = import.meta.env.VITE_BASE_URL;

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imgUrls: prev.imgUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
          setTimeout(() => {
            setImageUploadError(false);
          }, 7000);
        });
    } else {
      setImageUploadError("You can only upload 6 image per listing");
      setUploading(false);
      setTimeout(() => {
        setImageUploadError(false);
      }, 7000);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is in ${progress}`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  //delete image
  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      imgUrls: prev.imgUrls.filter((_, i) => i !== index),
    }));
  };

  //handle input change
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => ({ ...prev, type: e.target.id }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      const value =
        e.target.type === "number"
          ? parseInt(e.target.value, 10)
          : e.target.value;

      setFormData((prev) => ({ ...prev, [e.target.id]: value }));
    }
  };

  const navigate = useNavigate();

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imgUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const formDataWithUserRef = { ...formData, userRef: currentUser._id };

      const response = await axios.post(
        `${URL}/api/listing/create`,
        formDataWithUserRef,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const data = response.data;
      console.lo;
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg outline-none"
            id="name"
            onChange={handleChange}
            value={formData.name}
            maxLength={62}
            minLength={5}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg outline-none"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg outline-none"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="parlour"
                onChange={handleChange}
                value={formData.parlour}
                min="1"
                max="5"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Parlours</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col">
                <p>Regular Price</p>
                {formData.type !== "sale" ? (
                  <span className="text-xs">($ / Month)</span>
                ) : null}
              </div>
            </div>
            {formData.offer ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min="0"
                  max="1000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-col">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imageUploadError ? imageUploadError : null}
          </p>
          {formData.imgUrls.length > 0
            ? formData.imgUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between items-center p-3 border"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => handleImageDelete(index)}
                    type="button"
                    className="p-3 text-red-700 rounded-lg uppercas hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))
            : null}
          <button
            disabled={loading || uploading}
            className="text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error ? <p className="text-red-700 text-sm">{error}</p> : null}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
