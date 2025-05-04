import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/custom/Loader/Loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const BiogasPlantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const baseURL = "http://localhost:8080";
  useEffect(() => {
    const fetchUserDataAndRequests = async () => {
      try {
        // Get user ID from local storage
        const userId = localStorage.getItem("userId");

        // Fetch user details to get the name
        const userResponse = await axios.get(`${baseURL}/api/users/${userId}`);
        const { name } = userResponse.data;
        setUserName(name);

        // Fetch recycle requests and filter them by user name
        const requestsResponse = await axios.get(`${baseURL}/api/recycle`);
        const filteredRequests = requestsResponse.data.filter(
          (request) => request.center === name
        );
        setRequests(filteredRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`${baseURL}/api/recycle/${id}`, { status });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      alert("Failed to update the status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen mt-[80px] mb-[40px] px-[40px]">
      <Table className="bg-green-700 text-white">
        <TableHeader className="bg-orange-600 cursor-pointer font-extrabold">
          <TableRow>
            <TableHead className="w-[100px]">S.NO</TableHead>
            <TableHead>USER</TableHead>
            <TableHead>STREET</TableHead>
            <TableHead>CITY</TableHead>
            <TableHead>PINCODE</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>DELIVERY METHOD</TableHead>
            <TableHead>BIOGAS PLANT</TableHead>
            <TableHead>PICTURE</TableHead>
            <TableHead>STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow key={request._id}>
              <TableCell className="font-medium py-[20px] text-[15px]">
                {index + 1}
              </TableCell>
              <TableCell className="text-[15px]">{request.userId}</TableCell>
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
                <Select
                  onValueChange={(value) =>
                    updateRequestStatus(request._id, value)
                  }
                >
                  <SelectTrigger
                    className={`w-[180px] ${
                      request.status === "Accepted"
                        ? "bg-green-600"
                        : request.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-orange-600"
                    } text-white`}
                  >
                    <SelectValue
                      placeholder={request.status || "Select Status"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-orange-600 text-white">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default BiogasPlantRequests;
