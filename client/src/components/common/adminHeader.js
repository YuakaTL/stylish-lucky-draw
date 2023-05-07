import Image from "next/image";
import menu from "/public/menu.svg";

export default function AdminHeader({ isMenuOpen, setIsMenuOpen}) {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sticky top-0 z-10 bg-black py-6 pl-8">
      <Image
        src={menu}
        alt="menu"
        priority={true}
        onClick={toggleMenu}
        className="cursor-pointer"
      />
    </div>
  );
}
