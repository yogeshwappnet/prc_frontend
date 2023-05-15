import http from "../http-common";
import IAuth from "../types/Auth";

const login = (email: string, password: string) => {
  return http.post<IAuth>(`/auth/login`, { email: email, password: password });
};

const AuthService = {
  login
};

export default AuthService;
