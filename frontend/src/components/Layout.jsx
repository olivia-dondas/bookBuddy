import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="layout">
      {user && <Sidebar />}
      <div className={`main-content ${user ? "with-sidebar" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
