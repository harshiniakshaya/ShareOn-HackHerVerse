import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaLocationDot,
  FaRegHeart,
  FaHeart,
  FaRegMap,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import "./style.css";
import { Button } from "@/components/ui/button";

const FoodOfferCard = ({
  location,
  latitude,
  longitude,
  uploadedBy,
  foodType,
  uploadTime,
  image,
  upvotes,
  downvotes,
  status,
  edit,
  id,
  street,
  city,
  pincode,
  expiryTime,
  additionalInfo,
  likedBy,
}) => {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    street,
    city,
    pincode,
    foodType,
    expiryTime: expiryTime,
    additionalInfo,
  });

  useEffect(() => {
    if (userId && likedBy.includes(userId)) {
      setLiked(true);
    }
  }, [likedBy]);

  const handleLikeToggle = async () => {
    const userId = localStorage.getItem("userId");
    setLiked(!liked);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/donations/${id}`
      );
      const donation = response.data;

      if (!donation.likedBy.includes(userId)) {
        donation.likedBy.push(userId);
        await axios.put(`http://localhost:8080/api/donations/${id}`, {
          upvotes: donation.upvotes + 1,
          likedBy: donation.likedBy,
        });
        console.log("Like updated");
      } else {
        donation.likedBy = donation.likedBy.filter((id) => id !== userId);
        await axios.put(`http://localhost:8080/api/donations/${id}`, {
          upvotes: donation.upvotes - 1,
          likedBy: donation.likedBy,
        });
        console.log("Like removed");
      }

      setLiked(donation.likedBy.includes(userId));
    } catch (error) {
      console.error("Error updating donation like status:", error);
    }
  };

  const handleShare = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const shareData = {
      title: `Food Donation at ${location}`,
      text: `Check out this ${foodType} food donation at ${location} uploaded by ${uploadedBy}. Navigate the location using ${googleMapsUrl}. Visit https://www.google.com/ for more such information`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Content shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/donations/${id}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting donation", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const formattedExpiryTime = new Date(
        `${currentDate}T${formData.expiryTime}:00.000Z`
      );
      const updatedData = {
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
        foodType: formData.foodType,
        expiryTime: formattedExpiryTime,
        additionalInfo: formData.additionalInfo,
      };
      await axios.put(`http://localhost:8080/api/donations/${id}`, updatedData);

      setIsModalOpen(false);
      setIsAlertOpen(true);
      window.location.reload();
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  return (
    <div className="w-[400px] h-[300px] flex justify-center mt-[25px]">
      <Card className="w-full h-full bg-orange-600 flex flex-col rounded-[10px] overflow-hidden">
        <div className="relative h-[70%]">
          <div className="absolute top-0 left-0 bg-orange-600 py-2 px-2 inline-flex max-w-max items-center rounded-3xl m-3">
            <FaLocationDot className="text-white text-sm" />
            <p className="text-sm text-white px-1">{location}</p>
          </div>

          <div className="absolute right-2 top-2 flex flex-col gap-4 items-center">
            {userId && (
              <div className="flex flex-col items-center">
                <div
                  className="text-white text-[20px] cursor-pointer"
                  onClick={handleLikeToggle}
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                </div>
                <p className="text-white text-sm mt-1">
                  {liked ? upvotes + 1 : upvotes}
                </p>
              </div>
            )}

            {userId &&  (
              <div
                className="text-white text-[20px] cursor-pointer"
                onClick={handleShare}
              >
                <IoMdShare />
              </div>
            )}
            {userId && <div
              className="text-white text-[20px] cursor-pointer"
              onClick={() => {
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                window.open(googleMapsUrl, "_blank");
              }}
            >
              <FaRegMap />
            </div>}
            {edit && (
              <>
                <div
                  className="text-white text-[20px] cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <MdEdit />
                </div>
                <div
                  className="text-white text-[20px] cursor-pointer"
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  <MdDelete />
                </div>
              </>
            )}
          </div>
          <img
            src={image}
            alt={location}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-[30%]">
          <div
            className={`absolute z-10 top-[-20px] left-[150px] flex items-center px-3 py-1 rounded-2xl ${
              status === "Completed"
                ? "bg-red-700 text-white"
                : "bg-green-700 text-white"
            }`}
          >
            <p>{status}</p>
          </div>

          <div className="w-full h-full p-4 flex items-center justify-between gap-2">
            <div className="bg-white p-1 rounded-[10px] flex flex-col justify-center items-center w-[120px] h-[50px] overflow-hidden">
              <p className="text-center text-[12px] font-semibold">UPLOADED BY</p>
              <p className="text-sm text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {uploadedBy}
              </p>
            </div>
            <div className="bg-white p-1 rounded-[10px] flex flex-col justify-center items-center w-[120px] h-[50px] overflow-hidden">
              <p className="text-center text-[12px] font-semibold">DONATION TYPE</p>
              <p className="text-sm text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {foodType}
              </p>
            </div>
            <div className="bg-white p-1 rounded-[10px] flex flex-col justify-center items-center w-[120px] h-[50px] overflow-hidden">
              <p className="text-center text-[12px] font-semibold">UPLOAD TIME</p>
              <p className="text-sm text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {uploadTime}
              </p>
            </div>
          </div>
          <div className="flex justify-around items-center px-4 py-2 bg-white">
            <div className="flex items-center">
              <FaThumbsUp className="text-green-600" />
              <p className="ml-1 text-sm">{upvotes}</p>
            </div>
            <div className="flex items-center">
              <FaThumbsDown className="text-red-600" />
              <p className="ml-1 text-sm">{downvotes}</p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-orange-700 text-white rounded-10">
          <DialogHeader>
            <DialogTitle>Edit Donation Details</DialogTitle>
            <DialogDescription>
              Modify the details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pincode" className="text-right">
                Pincode
              </Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="foodType" className="text-right">
                Food Type
              </Label>
              <Input
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryTime" className="text-right">
                Expiry Time
              </Label>
              <Input
                type="time"
                id="expiryTime"
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additionalInfo" className="text-right">
                Additional Info
              </Label>
              <Input
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-500 rounded w-[70px]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-orange-700 text-white">
          <AlertDialogHeader>
            <AlertDialogDescription>
              Donation details updated successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setIsAlertOpen(false)}
              className="bg-orange-500 hover:bg-orange-500 w-[50px] rounded-[5px]"
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodOfferCard;
