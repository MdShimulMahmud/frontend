import axios from "axios";
import { ReactNode } from "react";

const API_URL = "http://localhost:5000/api";

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  username: ReactNode;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

class AuthService {
  async signup(data: SignupData): Promise<void> {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      data
    );
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem("user");
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

export default new AuthService();
