import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import ExpertSectionBackground from "./Images/mobile version/newcarexpert.png"
import MobileSearchBar from "./MobileSearchBar";
import Background from "./Images/mobile version/futuristic-interior-sci-fi-room-background 2.png";
import Car from "./Images/mobile version/view-3d-car-removebg-preview 1 (1).png";
import ExportImage from "./Images/mobile version/newcarexport.png"
import HomeII from "./HomeII";
import FindCar from "./FindCar";
import MobileBlogs from "./MobileBlogs";
import MobileTestimonial from "./MobileTestimonial";
import LiteApp from "./LiteApp";
import Master from "./Master";

const MobileNewCar = () => {
  const [size, setSize] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState("SUV");
  const [PrizeactiveTab, setPrizeActiveTab] = useState("1-5 Lakh");

  // Function to update window size
  const checkSize = () => setSize(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const cars = [
    {
      name: "Mahindra Thar",
      price: "₹ 11.35 - 17.60 Lakhs",
      background: Background,
      carImage: Car,
    },
    {
      name: "Mahindra Thar",
      price: "₹ 11.35 - 17.60 Lakhs",
      background: Background,
      carImage: Car,
    },
    {
      name: "Mahindra Thar",
      price: "₹ 11.35 - 17.60 Lakhs",
      background: Background,
      carImage: Car,
    },
    {
      name: "Mahindra Thar",
      price: "₹ 11.35 - 17.60 Lakhs",
      background: Background,
      carImage: Car,
    },

  ];

  return (
    <>
      {size <= 500 ? (
        <>
          <MobileSearchBar />
          <div className="mobile-new-car-section-master">
            <Master />
          </div>
          <div className="mobile-new-car-container ">
            <div className="mobile-new-car-section">
              <h2 className="mobile-new-car-title">
                Find right car by body type
              </h2>
              <div className="mobile-new-car-tabs">
                {["SUV", "Hatchback", "Sedan", "MUV", "Luxury"].map((tab) => (
                  <button
                    key={tab}
                    className={`mobile-new-car-tab ${activeTab === tab ? "active" : ""
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Swiper
                className="mobile-new-car-swiper"
                spaceBetween={20}
                slidesPerView={2.5}
                loop={false}

                centeredSlides={false}
                modules={[Autoplay]}
              >
                {cars.map((car, index) => (
                  <SwiperSlide key={index} className="mobile-new-car-slide">
                    <div className="mobile-new-car-card">
                      <div className="mobile-new-car-card-image">
                        <img
                          src={car.background}
                          alt="Background"
                          className="mobile-new-car-card-bg"
                        />
                        <img
                          src={car.carImage}
                          alt={car.name}
                          className="mobile-new-car-card-car"
                        />
                      </div>
                      <h3 className="mobile-new-car-card-name">{car.name}</h3>
                      <p className="mobile-new-car-card-price">{car.price}</p>
                      <button className="mobile-new-car-card-btn">
                        View best price
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mobile-new-car-view-all">
                <button>View All SUV Cars <img style={{ width: "8px", height: "8px", marginLeft: "2px" }} src={ExportImage} /></button>
              </div>
            </div>
            <div className="mobile-new-car-brand-section">
              <HomeII />
            </div>
            <div className="mobile-new-car-brand-section">

              <div className="expert-advice-section">
                <div className="expert-advice-container">

                  <div className="expert-advice-image-container">
                    <img
                      src={ExpertSectionBackground} 
                      alt="Expert Advice"
                      className="expert-advice-full-image"
                    />
                    <button className="expert-advice-button-bottom-left">
                      Contact Expert
                    </button>
                  </div>
                </div>
              </div>


            </div>

            <div className="mobile-new-car-section">
              <h2 className="mobile-new-car-title">
                Search new car by price
              </h2>
              <div className="mobile-new-car-tabs-price">
                {["1-5 Lakh", "5-10 Lakh", "10-15 Lakh", "15-20 Lakh", "20-25 Lakh"].map((tab) => (
                  <button

                    key={tab}
                    className={`mobile-new-car-tab ${PrizeactiveTab === tab ? "active" : ""
                      }`}
                    onClick={() => setPrizeActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Swiper
                className="mobile-new-car-swiper"
                spaceBetween={20}
                slidesPerView={2.5}
                loop={false}

                centeredSlides={false}
                modules={[Autoplay]}
              >
                {cars.map((car, index) => (
                  <SwiperSlide key={index} className="mobile-new-car-slide">
                    <div className="mobile-new-car-card">
                      <div className="mobile-new-car-card-image">
                        <img
                          src={car.background}
                          alt="Background"
                          className="mobile-new-car-card-bg"
                        />
                        <img
                          src={car.carImage}
                          alt={car.name}
                          className="mobile-new-car-card-car"
                        />
                      </div>
                      <h3 className="mobile-new-car-card-name">{car.name}</h3>
                      <p className="mobile-new-car-card-price">{car.price}</p>
                      <button className="mobile-new-car-card-btn">
                        View best price
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mobile-new-car-view-all">
                <button>View All Cars Under 5 Lakh <img style={{ width: "8px", height: "8px", marginLeft: "2px" }} src={ExportImage} /></button>
              </div>
            </div>

            <div>
              <FindCar />
            </div>

            <div className="mobile-new-car-section">
              <h2 className="mobile-new-car-title">
                Latest Car
              </h2>


              <Swiper
                className="mobile-new-car-swiper"
                spaceBetween={20}
                slidesPerView={2.5}
                loop={false}

                centeredSlides={false}
                modules={[Autoplay]}
              >
                {cars.map((car, index) => (
                  <SwiperSlide key={index} className="mobile-new-car-slide">
                    <div className="mobile-new-car-card">
                      <div className="mobile-new-car-card-image">
                        <img
                          src={car.background}
                          alt="Background"
                          className="mobile-new-car-card-bg"
                        />
                        <img
                          src={car.carImage}
                          alt={car.name}
                          className="mobile-new-car-card-car"
                        />
                      </div>
                      <h3 className="mobile-new-car-card-name">{car.name}</h3>
                      <p className="mobile-new-car-card-price">{car.price}</p>
                      <button className="mobile-new-car-card-btn">
                        View best price
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mobile-new-car-view-all">
                <button>View All Latest cars <img style={{ width: "8px", height: "8px", marginLeft: "2px" }} src={ExportImage} /></button>
              </div>
            </div>




            <div >
              <MobileBlogs />
            </div>
            <div >
              <MobileTestimonial />
            </div>
            <div>
              <LiteApp />
            </div>
          </div>

        </>
      ) : (
        <h1>
          This page is available only for mobile view. Please switch to mobile
          view.
        </h1>
      )}
    </>
  );
};

export default MobileNewCar;
