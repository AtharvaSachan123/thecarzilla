import React, { useState, useEffect } from 'react';
import { Stack } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { images } from '../utils/constants';
import SearchBar from './SearchBar';
import MobileLogin from './MobileLogin';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

const iconContainerStyle = {
  width: "2.6vw",
  height: "2.6vw",
  border: "0.15vw solid #C3D4E966",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer"
};

const iconStyle = {
  color: "#596780",
  fontSize: "1.3vw"
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [size, setSize] = useState(window.innerWidth);

  const checkSize = () => setSize(window.innerWidth);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('menu-open', !menuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    toggleMenu();
  };

  const navbarHeight = 90;

  const scrollToContactForm = () => {
    const contactFormElement = document.getElementById('contact-form-container');
    if (contactFormElement) {
      const topPosition = contactFormElement.offsetTop - navbarHeight;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
    toggleMenu();
  };

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    return () => {
      window.removeEventListener("resize", checkSize);
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <>
      <Stack direction="row"
        alignItems="center"
        p={2}
        width="100%"
        className='Navbar'
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background: 'white',
          justifyContent: 'space-between'
        }}
      >

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginLeft: "1vw" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={images[0].url} alt="logo" style={{ width: "12vw", height: "4vw" }} />
        </Link>

        {/* Desktop nav links */}
        <div className='navLinks navbarIcons'>
          <NavLink exact="true" activeclassname='active' to="/" onClick={scrollToTop}>Home</NavLink>
          <NavLink to="/" onClick={scrollToContactForm}>Buy New Car</NavLink>
          <NavLink activeclassname='active' to="/">Blog</NavLink>
          <NavLink activeclassname='active' onClick={scrollToTop} to="/Services">Services</NavLink>
        </div>

        {/* Right side */}
        <div className="rightNavSection" 
          style={{ display: "flex", alignItems: "center", gap: size <= 500 ? "10px" : "1vw" }}
        >
          <div className='navbarIcons'>
            <SearchBar />
          </div>

          {/* Desktop icons */}
          {size > 500 && (
            <div className='options navbarIcons' style={{ display: "flex", gap: "1vw" }}>
              <div className='like' style={iconContainerStyle}>
                <FavoriteIcon style={iconStyle} />
              </div>
              <div className='notification' style={iconContainerStyle}>
                <FontAwesomeIcon icon={faBell} style={iconStyle} />
              </div>
              <div className='setting' style={iconContainerStyle}>
                <FontAwesomeIcon icon={faGear} style={iconStyle} />
              </div>
              <div className='profile' style={iconContainerStyle}
                onClick={() => setLoginOpen(true)}
              >
                <FontAwesomeIcon icon={faUser} style={{ color: "black", fontSize: "1.5vw" }} />
              </div>
            </div>
          )}

          {/* Mobile Login Button */}
          {size <= 500 && (
            <button onClick={() => setLoginOpen(true)} className="mobileLoginBtn">
              Login
            </button>
          )}

          {/* Menu Icon */}
          <FontAwesomeIcon 
            icon={menuOpen ? faX : faBars} 
            className='menuIconNav' 
            onClick={toggleMenu} 
          />
        </div>

        {/* Menu Dropdown */}
        <div className={`MenuDropdown ${menuOpen ? 'MenuShow' : ''}`}>
          <NavLink className='MenuDropdownOpt' exact="true" to="/" onClick={scrollToTop}>Home</NavLink>
          <NavLink className='MenuDropdownOpt' to="/" onClick={scrollToContactForm}>Buy New Car</NavLink>
          <NavLink className='MenuDropdownOpt' to="/">Blog</NavLink>
          <NavLink className='MenuDropdownOpt' onClick={scrollToTop} to="/Services">Services</NavLink>
        </div>
      </Stack>

      <MobileLogin isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
