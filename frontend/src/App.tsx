
import React from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, Dashboard, Register } from "./pages";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import {FullScreenLoader} from "./components/shared/FullScreenLoader";

// 1. Define the type structure of your Redux Store state
interface RootState {
  auth: {
    isAuth: boolean;
    user: any; // You can change 'any' to your specific User type if needed
  };
}

// 2. Type definitions for Route Wrappers
interface RouteProps {
  children: ReactNode;
}

const App: React.FC = () => {
  const { loading } = useLoadingWithRefresh() as { loading: boolean };

  return loading ? (
    <FullScreenLoader />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Fallback route to redirect unknown URLs safely */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// 3. Strongly Typed Route Guards
const GuestRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  return isAuth ? <Navigate to="/dashboard" replace={true} /> : <>{children}</>;
};

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  return isAuth ? <>{children}</> : <Navigate to="/" replace={true} />;
};

export default App;