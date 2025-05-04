import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/custom/NavBar";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/SignUp/SignUp";
import Home from "./Pages/Home/Home";
import Map from "./Pages/Map/Map";
import Recycle from "./Pages/Recycle/Recycle";
import DonateFood from "./Pages/Donate/Donate";
import { AuthProvider } from "./context/AuthProvider";
import { PrivateRoute } from "./context/PrivateRoute";
import MyDonations from "./Pages/MyDonations/MyDonations";
import RecycleRequests from "./Pages/RecycleRequests/RecycleRequests";

import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import ManageRequests from "./Pages/Admin/ManageRequests/ManageRequests";
import Manage from "./Pages/Admin/Management/Manage";
import ViewBiogasPlants from "./Pages/Admin/ViewBiogasPlants/ViewBiogasPlants";
import BiogasPlantDashboard from "./Pages/BiogasPlant/Dashboard/Dashboard";
import BiogasPlantRequests from "./Pages/BiogasPlant/ManageRequests/ManageRequests";


const RoutesComponent = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<PrivateRoute element={<Map />} />} />
        <Route path="/donate" element={<PrivateRoute element={<DonateFood />} />} />
        <Route path="/recycle" element={<PrivateRoute element={<Recycle />} />} />
        <Route path="/donations" element={<PrivateRoute element={<MyDonations />} />} />
        <Route path="/requests" element={<PrivateRoute element={<RecycleRequests />} />} />

        <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="admin" />} />
        <Route path="/admin/requests" element={<PrivateRoute element={<ManageRequests />} requiredRole="admin" />} />
        <Route path="/admin/manage" element={<PrivateRoute element={<Manage />} requiredRole="admin" />} />
        <Route path="/admin/viewplants" element={<PrivateRoute element={<ViewBiogasPlants />} requiredRole="admin" />} />

        <Route path="/biogasplant/dashboard" element={<PrivateRoute element={<BiogasPlantDashboard />} requiredRole="biogasplant" />} />
        <Route path="/biogasplant/requests" element={<PrivateRoute element={<BiogasPlantRequests />} requiredRole="biogasplant" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
