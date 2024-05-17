// import React, { Component } from "react";
import "./App.css";
// import MediaElement from "./MediaElement";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatR from "./components/CreateR";
import ReceptDetails from "./components/ReceptDetails";
import NotFound from "./components/NotFound";
import Products from "./components/Products";
import CreateP from "./components/CreateP";
import PrintPage from "./components/PrintPage";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Summry from "./components/Summry";

// import { Router, Route } from "react-router-dom";

function App() {
	const isPrintPage = window.location.href.includes("PrintPage");
	const style = window.location.href.includes("PrintPage");
	let AppStyle = "App";
	let mainStyle = "mainContainer";
	if (style) {
		AppStyle = "print";
		mainStyle = "";
	}

	return (
		<Router>
			<div className={`${AppStyle}`}>
				{!isPrintPage && <Navbar />}
				<div className={`${mainStyle}`}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/createR" element={<CreatR />} />
						<Route path="/recepts/:id" element={<ReceptDetails />} />
						<Route path="/products" element={<Products />} />
						<Route path="/createP" element={<CreateP />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/summry" element={<Summry />} />
						<Route path="/PrintPage/:id" element={<PrintPage />} />

						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
				{!isPrintPage && <Footer />}
			</div>
		</Router>
	);
}
export default App;
