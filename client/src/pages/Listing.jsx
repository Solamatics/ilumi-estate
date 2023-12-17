import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const URL = import.meta.env.VITE_BASE_URL;

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useParams();
  const lisitngId = params.id;

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/api/listing/get/${lisitngId}`);
      const data = response.data;
      setLoading(false);
      if (data.success === false) {
        console.log(data.message);
        setError(true);
        setLoading(false);
        return;
      }
      setListing(data);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [lisitngId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      <>
        <Swiper navigation>
          {listing?.imageUrls?.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    </main>
  );
};
export default Listing;
