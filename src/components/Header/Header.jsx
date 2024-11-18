import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";

const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "On Top",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const [userTokens, setUserTokens] = useState(0); // State to store token count

  // Fetch token data from the backend or API
  const fetchUserTokens = async () => {
    try {
      const response = await axios.get("https://mantea-mongodbnft.hf.space/get-voter/", {
        params: { userId: "current-user-id" }, // Replace with actual user identification logic
      });

      if (response.status === 200) {
        setUserTokens(response.data.tokens); // Assume API returns { tokens: number }
      } else {
        console.error("Failed to fetch tokens");
      }
    } catch (error) {
      console.error("Error fetching user tokens:", error.message);
    }
  };

  // Add/remove shrink class based on scroll position
  const handleScroll = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add("header__shrink");
    } else {
      headerRef.current.classList.remove("header__shrink");
    }
  };

  // Add event listeners and fetch initial token data
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchUserTokens();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className="d-flex gap-2 align-items-center">
              <span>
                <i className="ri-fire-fill"></i>
              </span>
              IDEATHON
            </h2>
          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5">
            <button className="btn d-flex gap-2 align-items-center">
              <span>
                <i className="ri-wallet-line"></i>
              </span>
              <div style={{ marginBottom: "0.2rem" }}>
                <p style={{ marginBottom: "0" }}>Tokens: {userTokens}</p>
              </div>
            </button>
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
