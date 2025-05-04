import FoodOfferCard from "@/components/custom/FoodOfferCard/FoodOfferCard";
import { useEffect, useState } from "react";
import axios from "axios";

const MyDonations = () => {
  const [myOffers, setMyOffers] = useState([]);
  

  const formatTimeAgo = (date) => {
    const now = new Date();
    const differenceInMs = now - new Date(date);
    const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60);

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minute${differenceInMinutes !== 1 ? "s" : ""} ago`;
    } else if (differenceInMinutes < 1440) {
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      return `${differenceInHours} hour${differenceInHours !== 1 ? "s" : ""} ago`;
    } else if (differenceInMinutes < 43200) {
      const differenceInDays = Math.floor(differenceInMinutes / 1440);
      return `${differenceInDays} day${differenceInDays !== 1 ? "s" : ""} ago`;
    } else {
      const differenceInMonths = Math.floor(differenceInMinutes / 43200);
      return `${differenceInMonths} month${differenceInMonths !== 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const localUserId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:8080/api/donations/user/${localUserId}`
        );

        const now = new Date();

        const data = response.data.map((offer) => {
          const expiryTime = new Date(offer.expiryTime);

          const isExpired = expiryTime < now;
          const canEdit = offer.userId === localUserId;
          return {
            id: offer._id,
            location: `${offer.street} | ${offer.city} | ${offer.pincode}`,
            latitude: offer.latitude,
            longitude: offer.longitude,
            uploadedBy: offer.userName,
            foodType: offer.foodType,
            uploadTime: formatTimeAgo(offer.createdAt),
            image: offer.picture,
            upvotes: offer.upvotes,
            downvotes: 0,
            status: isExpired ? "Completed" : "Available",
            edit: canEdit,
            street: offer.street,
            city: offer.city,
            pincode: offer.pincode,
            expiryTime: offer.expiryTime,
            additionalInfo: offer.description,
            likedBy: offer.likedBy
          };
        });
        setMyOffers(data);
      } catch (error) {
        console.error("Error fetching my donations", error);
      }
    };

    fetchMyDonations();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-[80px] mb-[40px] px-5">
      {myOffers.length > 0 ? (
        myOffers.map((offer) => (
          <FoodOfferCard
            key={offer.id}
            location={offer.location}
            latitude={offer.latitude}
            longitude={offer.longitude}
            uploadedBy={offer.uploadedBy}
            foodType={offer.foodType}
            uploadTime={offer.uploadTime}
            image={offer.image}
            upvotes={offer.upvotes}
            downvotes={offer.downvotes}
            status={offer.status}
            edit={offer.edit}
            id={offer.id}
            street={offer.street}
            city={offer.city}
            pincode={offer.pincode}
            expiryTime={offer.expiryTime}
            additionalInfo={offer.additionalInfo}
            likedBy={offer.likedBy}
          />
        ))
      ) : (
        <p>No donations found.</p>
      )}
    </div>
  );
};

export default MyDonations;
