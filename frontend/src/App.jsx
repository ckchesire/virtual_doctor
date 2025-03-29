import React from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Consultations from "./pages/Consultations";
import DoctorDashboard from "./pages/DoctorDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Logout from "./pages/Logout";  // Import Logout component
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import FindDoctor from "./pages/FindDoctor";


function App() {
  const { user, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />  {/* Correct Logout */}
          <Route path="/" element={<Home />} />  {/* Correct Logout */}

          {/* Admin Route - Only accessible to admins */}
          <Route
          path="/admin"
          element={
            user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="*" />
          }
        />

        
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/consultations" 
            element={
              <ProtectedRoute>
                <Consultations />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route 
          path="/find-doctor" 
          element={
            <ProtectedRoute>
              <FindDoctor />
            </ProtectedRoute>
          } 
        />


          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
