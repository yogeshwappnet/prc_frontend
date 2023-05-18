import React, { useContext, useEffect } from "react";
import "./App.css";
import { Navigate } from "react-router";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Campaigns from "./pages/Campaigns";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoutes";
import AddCampaign from "./pages/AddCampaign";
import Conversations from "./pages/Conversations";
import { useNavigationInterceptor } from "./AxiosInterceptor";
import Conversation from "./pages/Conversation";

const App: React.FC = () => {
  useNavigationInterceptor();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <AddCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <AddCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="conversations"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />
            <Route
            path="conversation/:id"
            element={
              <ProtectedRoute>
                <Conversation />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;
