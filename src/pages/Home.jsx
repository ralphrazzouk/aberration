import React from "react";
import Navbar from "../components/Navbar";
import Icon from "/icon.svg";
import Logo from "/logo.png";
import Background from "/moon/MoonWallpaper1.jpg";

const Home = () => {
	return (
		<>
			{/* <img src={Background} alt="Moon Background" /> */}
			<div className="bg-homeBg min-h-screen dark:bg-homeBg-dark bg-no-repeat bg-center bg-cover bg-fixed  md:pb-16 w-full">
				<Navbar />
				<div className="text-center align-middle">
					<h1 className="font-bold">Aberration</h1>
					{/* <h2 className="font-medium">Make a Moonquake Map 2.0!</h2> */}
				</div>
			</div>
			{/* <div className="h-fit container-fluid bg-center bg-no-repeat bg-cover">
				<img src={Background} alt="Moon Background" />
			</div>

			<nav className="w-auto ml-12 mt-12 rounded-3xl fixed top-0 bg-[#ababab] text-xl">
				<div className="flex m-1 rounded-3xl bg-[#dddddd]">
					<a href="/" className="m-4 align-middle">
						<img className="w-[64px]" src={Icon} alt="Aberration Logo" />
					</a>
					<a className="m-4 self-center text-[#282828] hover:text-[#ff0000]" href="/module">
						Lunar Module 3D
					</a>
					<a className="m-4 self-center text-[#282828] hover:text-[#ff9900]" href="/quake">
						Experience Moonquakes
					</a>
					<a className="m-4 self-center text-[#282828] hover:text-[#0ff000]" href="/moonquakes">
						About Moonquakes
					</a>
					<a className="m-4 self-center text-[#282828] hover:text-[#0ffff0]" href="/paper">
						Paper
					</a>
					<a className="m-4 self-center text-[#282828] hover:text-[#000fff]" href="/about">
						About Us
					</a>
					<a
						className="m-4 mr-8 self-center text-[#282828] hover:text-[#f000ff]"
						href="https://github.com/ralphrazzouk/aberration"
						target="_blank"
					>
						GitHub
					</a>
				</div>
			</nav>

			<button class="button">Hello</button> */}
			{/* <div id="loadingScreen">
				<div class="center">
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
					<div class="wave"></div>
				</div>
			</div> */}
			{/* <div id="main">
				<canvas id="bg"></canvas>
				<script type="module" src="/src/js/moon.js"></script>
			</div> */}
		</>
	);
};

export default Home;
