import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) {
    navigate("/login");
    return null;
  }

  return user;
};
