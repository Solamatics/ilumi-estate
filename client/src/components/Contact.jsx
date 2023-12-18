import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_BASE_URL;

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const fetchLandlord = async () => {
    try {
      const response = await axios.get(`${URL}/api/user/${listing.userRef}`, {
        headers: {
          "Content-Type": "application/json",
          // Add the Authorization header with the token
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = response.data;
      setLandlord(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLandlord();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span>{landlord.username}</span>
          </p>
          <textarea
            name="message"
            id="message"
            row="2"
            onChange={handleChange}
            placeholder="Enter message here..."
            className="w-full p-3 border rounded-lg focus:outline-none"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
