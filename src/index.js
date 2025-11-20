import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./responsiveness.css";
import Navbar from "./Components/Navbar";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import 'aos/dist/aos.css';

ReactDOM.render(
<BrowserRouter>
<AuthProvider>
<Navbar />
<App />
</AuthProvider>
</BrowserRouter>,document.getElementById('root'));

//"homepage": "https://vrinda2606.github.io/thecarzilla",
