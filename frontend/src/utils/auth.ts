import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
}

export const getToken = () => localStorage.getItem("token");

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => !!getToken();

export const getLoggedUserId = (): number | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.id;
  } catch {
    return null;
  }
};