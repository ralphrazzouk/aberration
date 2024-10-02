import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Moon from "./pages/Moon";
import DetectQuake from "./pages/DetectQuake";
import VisualizeQuake from "./pages/VisualizeQuake";
import Module from "./pages/Module";
import Moonquakes from "./pages/Moonquakes";
import About from "./pages/About";
import Paper from "./pages/Paper";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route path="/" element={<Home />} />
					<Route path="/moon" element={<Moon />} />
					<Route path="/detect-quake" element={<DetectQuake />} />
					<Route path="/visualize-quake" element={<VisualizeQuake />} />
					<Route path="/lunar-module" element={<Module />} />
					<Route path="/moonquakes" element={<Moonquakes />} />
					<Route path="/paper" element={<Paper />} />
					<Route path="/about" element={<About />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
