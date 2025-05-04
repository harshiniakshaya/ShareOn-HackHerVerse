import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

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

const Manage = () => {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminErrors, setAdminErrors] = useState({});

  const [plantName, setPlantName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [plantEmail, setPlantEmail] = useState("");
  const [plantPassword, setPlantPassword] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [wasteTypes, setWasteTypes] = useState([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState([]);
  const [collectionMethods, setCollectionMethods] = useState([]);
  const [plantErrors, setPlantErrors] = useState({});

  const validateAdminForm = () => {
    const errors = {};
    if (!adminName) errors.adminName = "Admin name is required";
    if (!adminEmail) errors.adminEmail = "Admin email is required";
    else if (!/^\S+@\S+\.\S+$/.test(adminEmail))
      errors.adminEmail = "Invalid email format";
    if (!adminPassword) errors.adminPassword = "Admin password is required";

    console.log("Admin form validation errors:", errors);
    return errors;
  };

  const validatePlantForm = () => {
    const errors = {};
    if (!plantName) errors.plantName = "Plant name is required";
    if (!contactPerson) errors.contactPerson = "Contact person is required";
    if (!phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone))
      errors.phone = "Phone number must be 10 digits";
    if (!plantEmail) errors.plantEmail = "Biogas Plant's email is required";
    else if (!/^\S+@\S+\.\S+$/.test(plantEmail))
      errors.plantEmail = "Invalid email format";
    if (!plantPassword) errors.plantPassword = "Password is required";
    if (!address.street) errors.street = "Street is required";
    if (!address.city) errors.city = "City is required";
    if (!address.state) errors.state = "State is required";
    if (!address.zipCode) errors.zipCode = "Zip code is required";

    if (wasteTypes.length === 0) errors.wasteTypes = "Waste types are required";
    if (collectionMethods.length === 0)
      errors.collectionMethods =
        "At least one collection method must be selected";

    console.log("Plant form validation errors:", errors);
    return errors;
  };

  const handleWasteTypeChange = (id) => {
    setSelectedWasteTypes((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
    setWasteTypes((prev) =>
      prev.includes(id) ? prev.filter((type) => type !== id) : [...prev, id]
    );
  };

  const handleCollectionMethodChange = (id) => {
    setCollectionMethods((prev) =>
      prev.includes(id) ? prev.filter((method) => method !== id) : [...prev, id]
    );
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    console.log("Admin form submitted");
    const errors = validateAdminForm();
    if (Object.keys(errors).length) {
      setAdminErrors(errors);
    } else {
      setAdminErrors({});
      try {
        const response = await axios.post("http://localhost:8080/api/users", {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        });
        alert("Admin added successfully!");
        console.log(response.data);
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
      } catch (error) {
        console.error("Failed to add admin:", error);
        alert("Error adding admin. Please try again.");
      }
    }
  };

  const handlePlantSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePlantForm();
    if (Object.keys(errors).length) {
      setPlantErrors(errors);
    } else {
      setPlantErrors({});
      try {
        const response = await axios.post(
          "http://localhost:8080/api/biogasplants",
          {
            name: plantName,
            contactPerson,
            phone,
            email: plantEmail,
            password: plantPassword,
            address,
            acceptedWasteTypes: wasteTypes,
            collectionMethods,
          }
        );
        alert("Plant added successfully!");
        setPlantName("");
        setContactPerson("");
        setPhone("");
        setPlantEmail("");
        setPlantPassword("");
        setAddress({ street: "", city: "", state: "", zipCode: "" });
        setWasteTypes([]);
        setSelectedWasteTypes([]);
        setCollectionMethods([]);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to add plant:", error);
        alert("Error adding plant. Please try again.");
      }
      console.log("Managing Biogas Plant:", {
        name: plantName,
        contactPerson,
        phone,
        email: plantEmail,
        password: plantPassword,
        address,
        acceptedWasteTypes: wasteTypes,
        collectionMethods,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Tabs
        defaultValue="add-admin"
        className="w-[400px] mt-[80px] mb-[40px] bg-orange-500 rounded-[20px] text-white"
      >
        <TabsList className="grid w-full grid-cols-2 py-4 px-4">
          <TabsTrigger
            value="add-admin"
            className="data-[state=active]:bg-orange-700 rounded-[5px]"
          >
            Add Admin
          </TabsTrigger>
          <TabsTrigger
            value="manage-plants"
            className="data-[state=active]:bg-orange-700 rounded-[5px]"
          >
            Add Biogas Plant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-admin" className="py-4 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Add Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleAdminSubmit} className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="adminName">Admin Name</Label>
                  <Input
                    id="adminName"
                    placeholder="Enter admin name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                  {adminErrors.adminName && (
                    <p className="text-red-600 text-xs">
                      {adminErrors.adminName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="Enter admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                  {adminErrors.adminEmail && (
                    <p className="text-red-600 text-xs">
                      {adminErrors.adminEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  {adminErrors.adminPassword && (
                    <p className="text-red-600 text-xs">
                      {adminErrors.adminPassword}
                    </p>
                  )}
                </div>
                <CardFooter className="justify-center">
                  <Button
                    type="submit"
                    className="bg-orange-800 hover:bg-orange-800 rounded-[5px]"
                  >
                    Add Admin
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage-plants" className="py-4 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Add Biogas Plant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handlePlantSubmit} className="space-y-2">
                {/* <div className="space-y-1">
                  <Label htmlFor="plantId">Plant ID</Label>
                  <Input
                    id="plantId"
                    placeholder="Enter plant ID"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                  />
                  {plantErrors.plantId && (
                    <p className="text-red-600 text-xs">
                      {plantErrors.plantId}
                    </p>
                  )}
                </div> */}
                <div className="space-y-1">
                  <Label htmlFor="plantName">Plant Name</Label>
                  <Input
                    id="plantName"
                    placeholder="Enter plant name"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                  />
                  {plantErrors.plantName && (
                    <p className="text-red-600 text-xs">
                      {plantErrors.plantName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="plantEmail">Biogas Plant Email</Label>
                  <Input
                    id="plantEmail"
                    type="email"
                    placeholder="Enter Biogas Plant email"
                    value={plantEmail}
                    onChange={(e) => setPlantEmail(e.target.value)}
                  />
                  {plantErrors.plantEmail && (
                    <p className="text-red-600 text-xs">
                      {plantErrors.plantEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="plantPassword">Password</Label>
                  <Input
                    id="plantPassword"
                    type="password"
                    placeholder="Enter password"
                    value={plantPassword}
                    onChange={(e) => setPlantPassword(e.target.value)}
                  />
                  {plantErrors.plantPassword && (
                    <p className="text-red-600 text-xs">
                      {plantErrors.plantPassword}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Enter contact person"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                  {plantErrors.contactPerson && (
                    <p className="text-red-600 text-xs">
                      {plantErrors.contactPerson}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {plantErrors.phone && (
                    <p className="text-red-600 text-xs">{plantErrors.phone}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>

                  <div className="space-y-1">
                    <Input
                      placeholder="Street"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                    />
                    {plantErrors.street && (
                      <p className="text-red-600 text-xs">
                        {plantErrors.street}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />
                    {plantErrors.city && (
                      <p className="text-red-600 text-xs">{plantErrors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                    />
                    {plantErrors.state && (
                      <p className="text-red-600 text-xs">
                        {plantErrors.state}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      placeholder="Zip Code"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                    />
                    {plantErrors.zipCode && (
                      <p className="text-red-600 text-xs">
                        {plantErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Accepted Waste Types</Label>
                  <div></div>
                  {wasteTypesList.map((type) => (
                    <div key={type.id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedWasteTypes.includes(type.id)}
                          onCheckedChange={() => handleWasteTypeChange(type.id)}
                        />
                        <label>{type.label}</label>
                      </div>
                      <p className="text-xs ml-6 mb-1">{type.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <Label>Collection Methods</Label>
                  <div></div>
                  {collectionMethodsList.map((method) => (
                    <div key={method.id} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={collectionMethods.includes(method.id)}
                          onCheckedChange={() =>
                            handleCollectionMethodChange(method.id)
                          }
                        />
                        <label>{method.label}</label>
                      </div>
                    </div>
                  ))}
                </div>

                <CardFooter className="justify-center">
                  <Button
                    type="submit"
                    className="bg-orange-800 hover:bg-orange-800 rounded-[5px]"
                  >
                    Add Biogas Plant
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Manage;
