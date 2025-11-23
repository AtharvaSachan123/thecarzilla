import React, { useEffect, useState } from "react";
import MobileSearchBar from "./MobileSearchBar";
import PopUp from "./PopUp";

import ServiceImage from "./Images/mobile version/mobileservice.jpg";
import FindCar from "./FindCar";
import ExploreService from "./ExploreService";
import MobileTestimonial from "./MobileTestimonial";
import LiteApp from "./LiteApp";
import { Padding } from "@mui/icons-material";

const MobileServices = () => {
const [size, setSize] = useState(window.innerWidth);


const checkSize = () => setSize(window.innerWidth);


useEffect(() => {
window.addEventListener("resize", checkSize);
return () => window.removeEventListener("resize", checkSize);
}, []);


const [isPopupOpen, setIsPopupOpen] = useState(false);


const openPopup = () => setIsPopupOpen(true);
const closePopup = () => setIsPopupOpen(false);

const services = [
{ name: "Pay traffic challan", icon: require("./Images/mobile version/pay.png") },
{ name: "Recharge FASTag", icon: require("./Images/mobile version/fastag.png") },
{ name: "Get vehicle Info", icon: require("./Images/mobile version/info.png") },
{ name: "Book your HSRP", icon: require("./Images/mobile version/hsrp.png") },
{ name: "Insurance Renew", icon: require("./Images/mobile version/insurance.png") },
{ name: "Transport your vehicle", icon: require("./Images/mobile version/pay.png") },
{ name: "Buy Spare Parts", icon: require("./Images/mobile version/spare.png") },
{ name: "Vehicle Accessories", icon: require("./Images/mobile version/accessories.png") },
{ name: "Road Side Assistant(RSA)", icon: require("./Images/mobile version/rsa.png") },
{ name: "Book a Driver", icon: require("./Images/mobile version/driver.png") },
];


return (
<>
{size <= 500 ? (
<>
<MobileSearchBar />


<div className="mobile-services-container-wrapper">
<div className="mobile-service-container">
<div className="mobile-service-background">
<div className="mobile-service-content">
<h2 className="mobile-service-heading">
Enhance your ride with our diverse services
</h2>


<p className="mobile-service-description">
Choose from a diverse range of car services designed to maintain
and enhance your car journey
</p>


<button className="mobile-service-btn" onClick={openPopup}>
Enquire Now
</button>
</div>
</div>


<img
src={ServiceImage}
alt="services"
className="mobile-service-image"
/>
</div>


<PopUp isOpen={isPopupOpen} onClose={closePopup} />
</div>
{/* Diverse Section */}
<div className="mobile-new-car-brand-section" style={{ padding: "0px" }}>
<div className="mobile-diverseServices-wrapper">
<div className="mobile-diverseServices-heading-row">
<h2 className="mobile-diverseServices-heading">Our diverse services</h2>
</div>
<div className="mobile-diverseServices-grid">
{services.map((item, idx) => (
<div key={idx} className="mobile-diverseServices-card">
<img src={item.icon} alt={item.name} className="mobile-diverseServices-icon" />
<p className="mobile-diverseServices-text">{item.name}</p>
</div>
))}
</div>


<div className="mobile-diverseServices-viewBtnContainer">
<button className="mobile-diverseServices-viewBtn">View All Services 
  <img style={{ width: "8px", height: "8px", marginLeft: "2px" }} src={require("./Images/mobile version/newcarexport.png")} />
</button>
</div>
</div>
</div>
<div className="mobile-new-car-brand-section">
  <FindCar />
</div>

<ExploreService />
<MobileTestimonial />
<LiteApp />
</>
) : (
<>Please Switch to mobile view to see this page</>
)}
</>
);
};


export default MobileServices;