import { useUserContext } from "@/context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user } = useUserContext();

  return user ? <Outlet/> : <Navigate to='/signin' />
}
