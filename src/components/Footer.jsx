import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer footer-center p-10 bg-black text-primary-content">
        <aside>
          <h2 className="text-5xl font-bold text-white">kopihabitat.</h2>
          <p className="font-bold">
            kopihabitat. Industries Ltd. <br />
            {/* Providing reliable tech since 1992 */}
          </p>
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav>
          <p className="mb-1">keep in touch with us!</p>
          <div className="grid grid-flow-col gap-4">
            <FontAwesomeIcon
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
              icon="fa-brands fa-instagram"
            />
            <FontAwesomeIcon
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
              icon="fa-brands fa-github"
            />
            <FontAwesomeIcon
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
              icon="fa-brands fa-dribbble"
            />
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;

// <footer className="footer p-5 bg-[#282726] text-center items-center justify-center border-t border-black text-white">
//   <div>
//     <p>rafeyproject | Copyright &copy; 2023</p>
//   </div>
// </footer>
