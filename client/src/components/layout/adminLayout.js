import AdminSideBar from "@/components/common/adminSideBar";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminSideBar />
      {children}
    </>
  );
}
