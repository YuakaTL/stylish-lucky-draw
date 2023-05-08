import { useState } from "react";
import AdminHeader from "@/components/common/adminHeader";
import AdminSideBar from "@/components/common/adminSideBar";

export default function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AdminHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <AdminSideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="ml-64">{children}</div>
    </>
  );
}
