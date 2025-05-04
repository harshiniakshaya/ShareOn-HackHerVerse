import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/users", {
        name,
        email,
        password,
      });
      console.log("User created:", response.data);
      alert("User created, kindly login!")
      navigate("/login");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-600">
      <Card className="w-[300px] sm:w-96 p-5 bg-white">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center text-orange-600">
            Sign Up
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-orange-600"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                required
                className="border-orange-600 p-5 rounded-[5px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-orange-600"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="border-orange-600 p-5 rounded-[5px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-orange-600"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                className="border-orange-600 p-5 rounded-[5px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-[100px] bg-orange-600 text-white rounded-full mt-3 hover:bg-orange-600"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
