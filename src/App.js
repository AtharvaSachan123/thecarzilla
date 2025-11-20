import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Function from "./Function";
import Home from "./Components/Home";
import PrivacyPolicy from './Components/PrivacyPolicy';
import TermsCons from './Components/TermsCond';
import CustomerSupport from "./Components/CustomerSupport";
import HowDoesItWorks from './Components/HowDoesItWork';
import AboutUs from './Components/AboutUs';
import TermsCondII from './Components/TermsCondII';
import PrivacyPolicyII from './Components/PrivacyPolicyII';
import Login from "./Components/Login";
import LoginII from "./Components/LoginII";
import Footer from "./Components/Footer";
import Services from "./Components/Services";
import CancellationAndRefund from "./Components/CancellationAndRefund";
import LoadBlog from "./Components/LoadBlog"
import DetailedBlog from "./Components/DetailedBlog"
import Careers from "./Components/Careers"
import MobileNewCar from "./Components/MobileNewCar"
import MobileFooter from  "./Components/MobileFooter"


const App = () => {
  const location = useLocation();

  const isLoginPage = location.pathname.startsWith('/Login');
  const [size, setSize] = useState(window.innerWidth);
  const checkSize = () => setSize(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return(
    <>
      <Routes>          
        <Route exact path="/" element={<Function/>} />
        <Route exact path="/Home"  element={<Home/>} />
        <Route exact path="/TermsAndConditions" element={<TermsCons />} />
        <Route exact path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route exact path="/HowItWorks" element={<HowDoesItWorks />} />
        <Route exact path="/Support" element={<CustomerSupport />} />
        <Route exact path="/AboutUs" element={<AboutUs />} />
        <Route exact path="/TermsAndConditions/:TermsAndConditionsII" element={<TermsCondII/>} />
        <Route exact path="/PrivacyPolicy/:PrivacyPolicyII" element={<PrivacyPolicyII />} />
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/Login/:OtpVerify" element={<LoginII />} />
        <Route exact path="/Services" element={<Services />} />
        <Route exact path="/CancellationAndRefundPolicy" element={<CancellationAndRefund />} />
        <Route exact path="/Careers" element={<Careers/>} />
        <Route path="*" element={<Function />} /> 
        <Route path="/mobileblogs" element={<LoadBlog/>}/>
        <Route path="/mobiledetailblog" element={<DetailedBlog/>}/>
        <Route path="/mobilenewcar" element={<MobileNewCar/>}/>
      </Routes>

      {/* Hide footer if on the Login page */}
      
      {
          size<=500 ?(<MobileFooter/>):(!isLoginPage && <Footer />)
      }
    </>
  );
};

export default App;
