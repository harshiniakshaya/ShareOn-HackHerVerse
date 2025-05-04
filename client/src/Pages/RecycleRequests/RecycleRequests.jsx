import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loader from "@/components/custom/Loader/Loader";

const RecycleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchRecycleRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log(userId);
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Fetch recycle requests from the API
        const response = await axios.get(
          `${baseURL}/api/recycle/user/${userId}`
        );
        setRequests(response.data);
      } catch (err) {
        setRequests([])
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecycleRequests();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${baseURL}/api/recycle/${id}`);
        // Remove the deleted request from the UI
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== id)
        );
        alert("Recycle request deleted successfully!");
      } catch (error) {
        console.error("Error deleting the recycle request:", error);
        alert("Failed to delete the recycle request. Please try again.");
      }
    }
  };

  const handleEdit = (request) => {
    setEditData(request);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log(editData);
      await axios.put(`${baseURL}/api/recycle/${editData._id}`, editData);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === editData._id ? editData : request
        )
      );

      setEditModalOpen(false);
      alert("Recycle request updated successfully!");
    } catch (error) {
      console.error("Error updating the recycle request:", error);
      alert("Failed to update the recycle request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-[80px] mb-[40px] px-[40px]">
    {requests.length===0 ? (<p>No recycle requests are made</p>):(<Table className="bg-green-700 text-white">
        <TableHeader className="bg-orange-600 cursor-pointer font-extrabold">
          <TableRow>
            <TableHead className="w-[100px]">S.NO </TableHead>
            <TableHead>STREET</TableHead>
            <TableHead>CITY</TableHead>
            <TableHead>PINCODE</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>DELIVERY METHOD</TableHead>
            <TableHead>CENTER NAME</TableHead>
            <TableHead>PICTURE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow key={request._id} className="py-[100px]">
              <TableCell className="font-medium py-[20px] text-[15px]">
                {index + 1}
              </TableCell>
              <TableCell className="text-[15px]">{request.street}</TableCell>
              <TableCell className="text-[15px]">{request.city}</TableCell>
              <TableCell className="text-[15px]">{request.pincode}</TableCell>
              <TableCell className="text-[15px]">{request.quantity}</TableCell>
              <TableCell className="text-[15px]">
                {request.description}
              </TableCell>
              <TableCell className="text-[15px]">
                {request.deliveryMethod}
              </TableCell>
              <TableCell className="text-[15px]">{request.center}</TableCell>
              <TableCell>
                {request.picture ? (
                  <button
                    onClick={() =>
                      setSelectedImage(`${baseURL}/${request.picture}`)
                    }
                    className="text-white text-[15px]"
                  >
                    View Picture
                  </button>
                ) : (
                  "No Picture"
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`px-5 py-1 rounded-[20px] text-[15px] ${
                    request.status === "Submitted"
                      ? "bg-orange-600"
                      : request.status === "Acknowledged"
                      ? "bg-yellow-500"
                      : request.status === "Rejected"
                      ? "bg-red-700"
                      : request.status === "Accepted"
                      ? "bg-green-500"
                      : ""
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>

              <TableCell
                className="cursor-pointer text-[25px]"
                onClick={() => handleEdit(request)}
              >
                <MdEdit />
              </TableCell>
              <TableCell
                className="cursor-pointer text-[25px]"
                onClick={() => handleDelete(request._id)}
              >
                <MdDelete />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>)}
      {/* <Table className="bg-green-700 text-white">
        <TableHeader className="bg-orange-600 cursor-pointer font-extrabold">
          <TableRow>
            <TableHead className="w-[100px]">S.NO </TableHead>
            <TableHead>STREET</TableHead>
            <TableHead>CITY</TableHead>
            <TableHead>PINCODE</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>DELIVERY METHOD</TableHead>
            <TableHead>CENTER NAME</TableHead>
            <TableHead>PICTURE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow key={request._id} className="py-[100px]">
              <TableCell className="font-medium py-[20px] text-[15px]">
                {index + 1}
              </TableCell>
              <TableCell className="text-[15px]">{request.street}</TableCell>
              <TableCell className="text-[15px]">{request.city}</TableCell>
              <TableCell className="text-[15px]">{request.pincode}</TableCell>
              <TableCell className="text-[15px]">{request.quantity}</TableCell>
              <TableCell className="text-[15px]">
                {request.description}
              </TableCell>
              <TableCell className="text-[15px]">
                {request.deliveryMethod}
              </TableCell>
              <TableCell className="text-[15px]">{request.center}</TableCell>
              <TableCell>
                {request.picture ? (
                  <button
                    onClick={() =>
                      setSelectedImage(`${baseURL}/${request.picture}`)
                    }
                    className="text-white text-[15px]"
                  >
                    View Picture
                  </button>
                ) : (
                  "No Picture"
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`px-5 py-1 rounded-[20px] text-[15px] ${
                    request.status === "Submitted"
                      ? "bg-orange-600"
                      : request.status === "Acknowledged"
                      ? "bg-yellow-500"
                      : request.status === "Rejected"
                      ? "bg-red-700"
                      : request.status === "Accepted"
                      ? "bg-green-500"
                      : ""
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>

              <TableCell
                className="cursor-pointer text-[25px]"
                onClick={() => handleEdit(request)}
              >
                <MdEdit />
              </TableCell>
              <TableCell
                className="cursor-pointer text-[25px]"
                onClick={() => handleDelete(request._id)}
              >
                <MdDelete />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="text-white">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Recycle"
                className="max-w-full h-auto"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {editModalOpen && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-orange-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Recycle Request</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="Street">Street</Label>
                <Input
                  label="Street"
                  value={editData.street}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, street: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="City">City</Label>
                <Input
                  label="City"
                  value={editData.city}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="Pincode">Pincode</Label>
                <Input
                  label="Pincode"
                  value={editData.pincode}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="Quantity">Quantity</Label>
                <Input
                  label="Quantity"
                  value={editData.quantity}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="Descriptiont">Description</Label>
                <Input
                  label="Description"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-orange-500 hover:bg-orange-500 w-[70px] rounded-[5px]"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RecycleRequests;
