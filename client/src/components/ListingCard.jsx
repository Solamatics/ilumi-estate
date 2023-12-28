import React from "react";
import { Link } from "react-router-dom";
import { MdLocationPin } from "react-icons/md";

const ListingCard = ({
  listing: {
    _id,
    imageUrls,
    description,
    name,
    address,
    offer,
    discountPrice,
    regularPrice,
    type,
    bedrooms,
    bathrooms,
  },
}) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]">
      <Link to={`/listing/${_id}`}>
        <img
          src={imageUrls[0]}
          alt={description || "Listing Image"}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationPin className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">{address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center">
            $
            {offer
              ? discountPrice.toLocaleString("en-US")
              : regularPrice.toLocaleString("en-US")}
            {type === "rent" ? "/ month" : null}
          </p>
          <div className="text-slate-700 flex items-center gap-4">
            <div className="font-bold text-xs">
              {bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {bathrooms > 1 ? `${bathrooms} baths` : `${bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
