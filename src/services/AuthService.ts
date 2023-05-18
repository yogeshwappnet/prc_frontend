import api from "../AxiosInterceptor";
import IAuth from "../types/Auth";

const login = (email: string, password: string) => {
  return api.post<IAuth>(`/auth/login`, { email: email, password: password });
};

const AuthService = {
  login
};

export default AuthService;
