// admin/AdminLayout.js
"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useSession } from "next-auth/react";

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];

  return (
    <div className="admin-layout">
      <Header />
      <div className="main-content">
        {/* <Sidebar /> */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
