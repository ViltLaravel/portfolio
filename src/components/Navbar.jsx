import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex items-center p-5 sticky top-0 z-20 bg-primary">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center justify-center"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="Nicole Amoguis home" className="w-10 h-10 object-contain" />
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-10">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        {/* Place your resume as /public/resume.pdf */}
        <a
          href="/resume.pdf"
          download
          className="hidden md:flex items-center gap-2 bg-[#915EFF] hover:bg-[#7c4de8] text-white text-[14px] font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Download CV
        </a>

        <div className="md:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  download
                  className="text-[#915EFF] font-semibold text-[16px]"
                  onClick={() => setToggle(false)}
                >
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
