import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Module from "./pages/Module";
import Moon from "./pages/Moon";
import Moonquakes from "./pages/Moonquakes";
import Paper from "./pages/Paper";
import Quake from "./pages/Quake";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route path="/" element={<Home />} />
					<Route path="/moon" element={<Moon />} />
					<Route path="/lunar-module" element={<Module />} />
					<Route path="/quake" element={<Quake />} />
					<Route path="/moonquakes" element={<Moonquakes />} />
					<Route path="/paper" element={<Paper />} />
					<Route path="/about" element={<About />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
