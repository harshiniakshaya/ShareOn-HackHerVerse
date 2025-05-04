/* eslint-disable react/no-unescaped-entities */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import Cookies from "js-cookie";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      console.log("User logged in:", response.data);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("role", response.data.role);
      login();
      let redirectPath;
      if (response.data.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (response.data.role === "biogasplant") {
        redirectPath = "/biogasplant/dashboard";
      } else {
        redirectPath = localStorage.getItem("redirectPath") || "/";
      }
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-600">
      <Card className="w-[300px] sm:w-96 p-5 bg-white">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center text-orange-600">
            Login
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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
                Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-600">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
