import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub, faDribbble } from "@fortawesome/free-brands-svg-icons";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer footer-center p-10 bg-black text-primary-content">
        <aside>
          <h2 className="text-5xl font-bold text-white italic mb-2">kopihabitat.</h2>
          <p className="font-bold dark:text-gray-400">
            kopihabitat. Industries Ltd. <br />
            {/* Providing reliable tech since 1992 */}
          </p>
          <p className="dark:text-gray-400">Copyright © 2024 - All right reserved</p>
        </aside>
        <nav>
          <p className="mb-1 dark:text-gray-400">keep in touch with us!</p>
          <div className="grid grid-flow-col gap-4 dark:text-gray-400">
            <a href="https://instagram.com/rfiazky" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
                icon={faInstagram}
              />
            </a>
            <a href="https://github.com/rafeezk" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
                icon={faGithub}
              />
            </a>
            <a href="https://dribbble.com/raavfy" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-white cursor-pointer text-3xl"
                icon={faDribbble}
              />
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
