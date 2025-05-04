import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
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
import { Checkbox } from "@/components/ui/checkbox";

const wasteTypesList = [
  {
    id: "kitchen_waste",
    label: "Kitchen Waste",
    desc: "Leftover food, vegetable peels, and fruit scraps",
  },
  {
    id: "garden_waste",
    label: "Garden Waste",
    desc: "Grass clippings, leaves, and plant trimmings",
  },
  {
    id: "animal_manure",
    label: "Animal Manure",
    desc: "Waste from livestock like cows, chickens, and pigs",
  },
  {
    id: "crop_residues",
    label: "Crop Residues",
    desc: "Leftover parts of crops after harvest, such as straw",
  },
  {
    id: "sewage_waste",
    label: "Sewage Waste",
    desc: "Organic waste from toilets and bathrooms",
  },
];

const collectionMethodsList = [
  { id: "drop_off", label: "Drop Off" },
  { id: "pickup", label: "Pickup" },
];

const ViewBiogasPlants = () => {
  const [biogasPlants, setBiogasPlants] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    status: "",
    email: "",
    contactPerson: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    acceptedWasteTypes: [],
    collectionMethods: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBiogasPlants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/biogasplants"
        );
        setBiogasPlants(response.data);
      } catch (error) {
        console.error("Error fetching biogas plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBiogasPlants();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  const formatText = (text) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this biogas plant?")) {
      try {
        await axios.delete(`http://localhost:8080/api/biogasplants/${id}`);
        setBiogasPlants((prev) => prev.filter((plant) => plant._id !== id));
        alert("Biogas plant deleted successfully!");
      } catch (error) {
        console.error("Error deleting biogas plant:", error);
        alert("Failed to delete the biogas plant. Please try again.");
      }
    }
  };

  const handleEdit = (plant) => {
    setEditData({
      _id: plant._id,
      name: plant.name,
      status: plant.status,
      email: plant.email,
      contactPerson: plant.contactPerson,
      phone: plant.phone,
      address: {
        street: plant.address.street,
        city: plant.address.city,
        state: plant.address.state,
        zipCode: plant.address.zipCode,
      },
      acceptedWasteTypes: plant.acceptedWasteTypes,
      collectionMethods: plant.collectionMethods,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/biogasplants/${editData._id}`,
        editData
      );
      setBiogasPlants((prev) =>
        prev.map((plant) => (plant._id === editData._id ? editData : plant))
      );
      setEditModalOpen(false);
      alert("Biogas plant updated successfully!");
    } catch (error) {
      console.error("Error updating biogas plant:", error);
      alert("Failed to update the biogas plant. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-[80px] mb-[40px] px-[40px]">
      <Table className="bg-green-700 text-white">
        <TableHeader className="bg-orange-600 cursor-pointer font-extrabold">
          <TableRow>
            <TableHead className="w-[100px]">Plant ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead className="">Phone</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Zip Code</TableHead>
            <TableHead>Accepted Waste Types</TableHead>
            <TableHead>Collection Methods</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {biogasPlants.map((plant) => (
            <TableRow key={plant._id}>
              <TableCell className="font-medium">{plant.plantId}</TableCell>
              <TableCell>{plant.name}</TableCell>
              <TableCell>{plant.status}</TableCell>
              <TableCell>{plant.email}</TableCell>
              <TableCell>{plant.contactPerson}</TableCell>
              <TableCell>{plant.phone}</TableCell>
              <TableCell>{plant.address?.street}</TableCell>
              <TableCell>{plant.address?.city}</TableCell>
              <TableCell>{plant.address?.state}</TableCell>
              <TableCell>{plant.address?.zipCode}</TableCell>
              <TableCell>
                {plant.acceptedWasteTypes?.map((type, index) => (
                  <div key={index}>{formatText(type)}</div>
                ))}
              </TableCell>
              <TableCell>
                {plant.collectionMethods?.map((method, index) => (
                  <div key={index}>{formatText(method)}</div>
                ))}
              </TableCell>
              <TableCell
                onClick={() => handleEdit(plant)}
                className="cursor-pointer"
              >
                <MdEdit />
              </TableCell>
              <TableCell
                onClick={() => handleDelete(plant._id)}
                className="cursor-pointer"
              >
                <MdDelete />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editModalOpen && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-orange-700 text-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Biogas Plant</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, status: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={editData.contactPerson}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <div className="space-y-1">
                  <Input
                    id="street"
                    placeholder="Street"
                    value={editData.address.street}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value },
                      }))
                    }
                  />
                  <Input
                    id="city"
                    placeholder="City"
                    value={editData.address.city}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                  />
                  <Input
                    id="state"
                    placeholder="State"
                    value={editData.address.state}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value },
                      }))
                    }
                  />
                  <Input
                    id="zipCode"
                    placeholder="Zip Code"
                    value={editData.address.zipCode}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        address: { ...prev.address, zipCode: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Accepted Waste Types</Label>
                <div className="space-y-2">
                  {wasteTypesList.map((method) => (
                    <div key={method.id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editData.acceptedWasteTypes.includes(
                            method.id
                          )}
                          onCheckedChange={() =>
                          setEditData((prev) => ({
                            ...prev,
                            acceptedWasteTypes:
                              prev.acceptedWasteTypes.includes(method.id)
                                ? prev.acceptedWasteTypes.filter(
                                    (t) => t !== method.id
                                  )
                                : [...prev.acceptedWasteTypes, method.id],
                          }))
                        }
                        />
                        <label>{method.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Collection Methods</Label>
                <div className="space-y-2">
                  {collectionMethodsList.map((method) => (
                    <div key={method.id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editData.collectionMethods.includes(
                            method.id
                          )}
                          onCheckedChange={() =>
                            setEditData((prev) => ({
                              ...prev,
                              collectionMethods:
                                prev.collectionMethods.includes(method.id)
                                  ? prev.collectionMethods.filter(
                                      (m) => m !== method.id
                                    )
                                  : [...prev.collectionMethods, method.id],
                            }))
                          }
                        />
                        <label>{method.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSaveEdit}
                className="bg-orange-500 w-[70px] rounded-[5px] hover:bg-orange-500"
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

export default ViewBiogasPlants;
