import { useState, useEffect } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

export default function AdminSideBar({ isMenuOpen, setIsMenuOpen }) {
  const [menuClass, setMenuClass] = useState();
  const [active, setActive] = useState("");

  useEffect(() => {
    if (isMenuOpen) {
      setMenuClass("-translate-x-full transition-all duration-500 ease-in-out");
    } else {
      setMenuClass("translate-x-0 transition-all duration-500 ease-in-out");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const href = window.location.href;
    const lastWord = href.split("/").pop();
    if (lastWord === "event") {
      setActive("event");
    } else if (lastWord === "record") {
      setActive("record");
    }
  }, []);

  const clickLink = (e) => {
    const target = e.target.innerText;
    if (target === "活動管理") {
      setActive("event");
    } else if (target === "獲獎記錄") {
      setActive("record");
    }
  };

  return (
    <div
      className={`${menuClass} fixed bottom-0 top-[66px] h-full w-64 overflow-hidden shadow z-20 bg-white`}
    >
      <h1
        className={`${playfairDisplay.className} mt-6 pl-8 text-[28px] font-bold`}
      >
        StyLish
      </h1>
      <div className="mt-6">
        <Link
          href={"event"}
          onClick={clickLink}
          className={`${
            active == "event" ? "bg-adminGray" : "bg-transparent"
          } block py-4 pl-8`}
        >
          活動管理
        </Link>
        <Link
          href={"record"}
          onClick={clickLink}
          className={`${
            active == "record" ? "bg-adminGray" : "bg-transparent"
          } block py-4 pl-8 hover:bg-adminGray`}
        >
          獲獎記錄
        </Link>
      </div>
    </div>
  );
}
