import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
