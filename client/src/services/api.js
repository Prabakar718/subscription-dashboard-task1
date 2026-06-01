import axios from "axios";
import { store } from "../app/store";
import { updateAccessToken, logout, setUser } from "../auth/authSlice";
import { API_BASE } from "../utils/constants";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = store.getState().auth.refreshToken;
      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        store.dispatch(updateAccessToken(data.accessToken));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        store.dispatch(logout());
      }
    }
    return Promise.reject(err);
  }
);

export { setUser };
export default api;
