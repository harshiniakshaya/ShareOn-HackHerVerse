"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "./style.css"; // Ensure you have styles for the component
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";

const DonateFood = () => {
  const quotes = useMemo(
    () => [
      "Hunger is not an issue of charity. It is an issue of justice. – Jacques Diouf",
      "We make a living by what we get, but we make a life by what we give. – Winston Churchill",
      "If you can’t feed a hundred people, then feed just one. – Mother Teresa",
      "The measure of a life, after all, is not its duration, but its donation. – Corrie Ten Boom",
      "No one has ever become poor by giving. – Anne Frank",
    ],
    []
  );

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const [formData, setFormData] = useState({
    userId: "",
    latitude: "",
    longitude: "",
    foodType: "",
    expiryTime: "",
    description: "",
    picture: null,
    street: "",
    city: "",
    pincode: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prevQuote) => {
        const currentIndex = quotes.indexOf(prevQuote);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error obtaining location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFoodTypeSelect = (type) => {
    setFormData((prevData) => ({ ...prevData, foodType: type }));
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "donation-image.png", {
        type: "image/png",
      });
      setFormData((prevData) => ({ ...prevData, picture: file }));
    }, "image/png");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const currentDate = new Date().toISOString().split("T")[0];
    const expiryTimeFull = `${currentDate}T${formData.expiryTime}:00Z`;
    const expiryDate = new Date(expiryTimeFull);
    if (isNaN(expiryDate.getTime())) {
      alert("Invalid expiry time");
      return;
    }

    const updatedFormData = {
      ...formData,
      userId: userId,
      createdAt: new Date().toISOString(),
      expiryTime: expiryDate.toISOString(),
    };
    const formDataToSend = new FormData();
    for (const key in updatedFormData) {
      formDataToSend.append(key, updatedFormData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/donations",
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      alert(
        "Thank you for donating! Your contribution makes a difference."
      );
      setFormData({
        latitude: "",
        longitude: "",
        foodType: "",
        expiryTime: "",
        description: "",
        picture: null,
        street: "",
        city: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Failed to submit donation. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-[80px] mb-[40px] px-5">
      <div className="quote mb-6 text-xl font-semibold text-center text-orange-600">
        {currentQuote}
      </div>

      <h1 className="text-2xl font-bold mb-6">Donate</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-orange-600 text-white py-[25px] px-[50px] rounded-2xl w-[300px] sm:w-[500px]"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            required
            readOnly
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            required
            readOnly
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="street">Street</Label>
          <Input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            required
            onChange={handleChange}
            placeholder="Street address"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            required
            onChange={handleChange}
            placeholder="City"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            type="number"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            required
            onChange={handleChange}
            placeholder="Pincode"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="foodType">Donation Type</Label>
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 border border-white rounded-md w-full">
              {formData.foodType ? formData.foodType : "Select Donation Type"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-orange-600 border-white text-white">
              <DropdownMenuLabel>Donation Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFoodTypeSelect("Food")}>
                  Food Donation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFoodTypeSelect("Blood")}>
                  Blood Donation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFoodTypeSelect("Medical")}>
                  Free Medical / Health Camps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFoodTypeSelect("Essentials")}>
                Clothes / Essentials Donation
                </DropdownMenuItem>
            </DropdownMenuContent>
            
          </DropdownMenu>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="expiryTime">Expiry Time</Label>
          <Input
            type="time"
            id="expiryTime"
            name="expiryTime"
            value={formData.expiryTime}
            required
            onChange={handleChange}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Additional Information</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe any additional information"
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Capture Image</Label>
          <video
            ref={videoRef}
            autoPlay
            className="w-full mb-2 rounded-md"
          ></video>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleCapture}
              className="bg-green-700 hover:bg-white text-white hover:text-green-700 rounded px-4 py-2 w-[100px]"
            >
              Capture
            </Button>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          {formData.picture && (
            <div className="mt-2 flex flex-col items-center">
              <img
                src={URL.createObjectURL(formData.picture)} // Create a URL for the captured image
                alt="Captured"
                className="mt-2 rounded-md"
              />
              <p className="mt-2 text-sm text-white-500">Captured Image</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-orange-500 text-1xl text-white border-2 border-orange-500 rounded-3xl hover:bg-white hover:text-orange-600 py-[20px]"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonateFood;
