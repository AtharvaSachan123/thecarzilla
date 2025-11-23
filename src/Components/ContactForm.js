
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Aos from "aos";
import emailjs from "@emailjs/browser";
import axios from "axios";
import newCardCardPhoto from "./Images/mobile version/new-car-card-photo.png";
import newCar from "./Images/mobile version/car 1.png"
import repairCar from "./Images/mobile version/repairing-service (1) 1.png"
import BlogCar from "./Images/mobile version/blog (2) 1.png"
import AdviceCar from "./Images/mobile version/advice (1) 1.png"
import { useNavigate } from "react-router-dom"; 
const ContactForm = () => {
  const navigate = useNavigate();
  const cardData = [
    {
      title: "New Cars",
      background: "#FFFFFF",
      color: "#000000",
      image:  newCar ,
      onClick: () => navigate("/mobilenewcar"),
    },
    {
      title: "Services",
      background: "#000000",
      color: "#FFFFFF",
      image:  repairCar ,
      onClick: ()=> navigate("/mobileservices"),
    },
    {
      title: "Blogs",
      background: "#000000",
      color: "#FFFFFF",
      image:  BlogCar ,
      onClick: () => navigate("/mobileblogs"),
    },
    {
      title: "Expert Advice",
      background: "#FFFFFF",
      color: "#000000",
      image:  AdviceCar ,

    }
  ];
  // resize fucnction
  const [size, setSize] = useState(window.innerWidth);
  const checkSize = () => setSize(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  const url = "https://sheetdb.io/api/v1/kitjormnr8ebr";

  const sendData = async (formData) => {
    try {
      const response = await axios.post(url, { data: formData });
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);


  const [popupVis, setPopupVis] = useState(false);
  const form = useRef();

  const openPopup = (e) => {
    const formData = {
      name: document.getElementById("fname").value.trim(),
      email: document.getElementById("email").value.trim(),
      number: document.getElementById("number").value.trim(),
      brand: document.getElementById("brandChosen").value.trim(),
      model: document.getElementById("modelChosen").value.trim(),
      city: document.getElementById("cityChosen").value.trim(),
    };
    if (Object.values(formData).every(field => field)) {
      e.preventDefault();
      emailjs.sendForm("service_hrraeq5", "template_ulf7l9f", form.current, {
        publicKey: "WAwu7R3mje_b0w9WY",
      })
        .then(() => {
          console.log("SUCCESS!");
          e.target.reset();
        })
        .catch(error => alert("FAILED...", error.text));

      setPopupVis(true);
      sendData(formData);
    }
  };

  const closePopup = () => setPopupVis(false);

  return (
    <div className="form-wrapper">
      {size >= 500 ? (
        <div id="contact-form-container" className="BlackBg" style={{ height: "38vw" }}>
          <div className={`contactFormDiv ${popupVis ? "active" : ""}`}>
            <div className="HeadingBoxBlack" data-aos="fade-up">
              <div className="HeadingBlackDiv">
                <span className="BlackDivfirst">
                  <hr />
                  <p>BOOK YOUR DREAM CAR</p>
                  <hr />
                </span>
                <span className="BlackDivMiddle">
                  <h1>Get Personalized Quote</h1>
                </span>
                <span className="BlackDivLast">
                  Our experts will assist you personally
                </span>
              </div>
            </div>
            <div className="contactForm" data-aos="fade-up">
              <form ref={form} onSubmit={openPopup} id="contact-form" className="contact-form">
                <div className="input-box">
                  <div className="input-field">
                    <label>
                      Your Name<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="name"
                      id="fname"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>
                      Your Email<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="email"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>
                      Phone Number<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="number"
                      id="number"
                      type="number"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="input-box">
                  <div className="input-field">
                    <label>
                      Brand<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="brandChosen"
                      id="brandChosen"
                      type="text"
                      placeholder="For Eg: Maruti Suzuki"
                      required
                      name="brand"
                    />
                  </div>
                  <div className="input-field">
                    <label>
                      Model<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="modelChosen"
                      id="modelChosen"
                      type="text"
                      name="model"
                      placeholder="For Eg: Swift ZXI+"
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>
                      City<span className="asterisk">*</span>
                    </label>
                    <br />
                    <input
                      className="cityChosen"
                      id="cityChosen"
                      type="text"
                      name="city"
                      placeholder="For Eg: Jaipur"
                      required
                    />
                  </div>
                </div>

                <div className="buttonContact">
                  <button type="submit" className="btnContact">
                    Enquire Now
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Popup Modal */}
          <div className={`BlackBg popup ${popupVis ? "active" : ""}`}>
            <span className="popupCloseDiv">
              <button id="close_popup" onClick={closePopup}>
                <FontAwesomeIcon className="popupCloseDivIcon" icon={faCircleXmark} />
              </button>
            </span>
            <div className="HeadingBoxBlack">
              <div className="HeadingBlackDiv">
                <span className="BlackDivfirst" style={{ color: "black" }}>
                  <p>INQUIRY SUBMITTED</p>
                </span>
                <span className="BlackDivMiddle" style={{ color: "black" }}>
                  <h1>VROOM-VROOM!!</h1>
                </span>
                <span className="BlackDivMiddle" style={{ color: "black" }}>
                  <h1>Your query has been heard</h1>
                </span>
                <span className="BlackDivLast" style={{ color: "black" }}>
                  Our team will contact you soon
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="services-container">
          <div className="cards-grid">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="card-mobile"
                style={{
                  backgroundColor: card.background,
                  color: card.color,
                }}
                onClick={card.onClick}
              >
                <div className="card-content">
                  <h3 style={{ color: card.color }}>{card.title}</h3>
                  <p style={{ color: card.color }}>with Exciting Offers</p>
                  <div className="car-image-wrapper">
                    <img
                      src={card.image}
                      alt={`${card.title} image`}
                      className="car-image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ContactForm;
