import FoodOfferCard from "@/components/custom/FoodOfferCard/FoodOfferCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/custom/Loader/Loader";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchFoodOffers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/donations");
        const now = new Date();
        const localUserId = localStorage.getItem("userId");
        //console.log("Current Time:", now);

        const data = response.data.map((offer) => {
          const expiryTime = new Date(offer.expiryTime);
          //console.log("offer expiry time:", expiryTime.toISOString());

          const isExpired = expiryTime < now;
          //console.log("Is expired:", isExpired);
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
            likedBy: offer.likedBy,
          };
        });
        setOffers(data);
      } catch (error) {
        console.error("Error fetching food offers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-[80px] mb-[40px] px-5">
      {offers.map((offer) => (
        <FoodOfferCard
          key={offer.id}
          id={offer.id}
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
          street={offer.street}
          city={offer.city}
          pincode={offer.pincode}
          expiryTime={offer.expiryTime}
          additionalInfo={offer.additionalInfo}
          likedBy={offer.likedBy}
        />
      ))}
    </div>
  );
};

export default Home;
