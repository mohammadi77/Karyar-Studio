import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useVisitorTracking } from "../../hooks/useVisitorTracking";
import "./MainLayout.css";

function MainLayout() {
  useVisitorTracking();

  return (
    <>
      {" "}
      <div className="container">
        <Navbar />{" "}
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
