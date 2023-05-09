import { useState } from "react";
import AdminHeader from "@/components/common/adminHeader";
import AdminSideBar from "@/components/common/adminSideBar";

export default function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AdminHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <AdminSideBar isMenuOpen={isMenuOpen} />
      <div className={`${isMenuOpen ? "ml-0" : "ml-64"} transition-all duration-500 ease-in-out`}>{children}</div>
    </>
  );
}
