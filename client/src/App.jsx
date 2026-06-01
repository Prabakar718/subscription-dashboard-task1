import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./app/store";
import { setUser, logout } from "./auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import api from "./services/api";

function AppInit() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((s) => s.auth);

  useEffect(() => {
    // On refresh, token is in localStorage but user object is lost — re-fetch profile
    if (accessToken && !user) {
      api.get("/profile")
        .then((r) => dispatch(setUser(r.data)))
        .catch(() => dispatch(logout()));
    }
  }, [accessToken, user, dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInit />
      </BrowserRouter>
    </Provider>
  );
}
