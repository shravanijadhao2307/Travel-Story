import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateStory from "../pages/CreateStory";
import StoryDetails from "../pages/StoryDetails";
import EditProfile from "../pages/EditProfile";
import MyStories from "../pages/MyStories"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-story"
          element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/story/:id"
          element={
            <ProtectedRoute>
              <StoryDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/my-stories" element={<ProtectedRoute>
              <MyStories />
            </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
