import { useUserContext } from "@/context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet/> : <Navigate to='/signin' />
}
