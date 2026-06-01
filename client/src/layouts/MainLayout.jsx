import { Outlet } from "react-router-dom";
import Navbar from "../reusecomponents/Navbar";

export default function MainLayout() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }} className="transition-colors">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
