import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { auth, isLoading } = useAuth();

  // Saat auth masih loading, jangan redirect atau render
  if (isLoading) {
    return <div className="text-center p-6">Checking authentication...</div>;
  }

  // Jika user tidak ada setelah loading selesai, redirect
  if (!auth.user || !auth.token) {
    return <Navigate to="/LoginPage" replace />;
  }

  // Jika user valid, tampilkan elemen yang diminta
  return element;
};

export default ProtectedRoute;
