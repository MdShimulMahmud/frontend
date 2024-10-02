import authService from "../services/authService";

export const useAuth = () => {
  const user = authService.getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
};
