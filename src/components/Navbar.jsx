import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "/icon.svg";

import { AiOutlineMenu, AiOutlineClose, AiOutlineHome, AiOutlineGithub } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { FiSun, FiMoon, FiCodesandbox } from "react-icons/fi";
import { GiLunarModule, GiLunarWand, GiQuakeStomp } from "react-icons/gi";
import { RiFilePaper2Fill } from "react-icons/ri";
import { WiEarthquake, WiMoonAltWaxingCrescent1 } from "react-icons/wi";

const Navbar = () => {
	const [check, setCheck] = useState(false);
	const [local, setLocal] = useState(localStorage.getItem("theme"));
	const [isOpen, setIsOpen] = useState(false);

	// dark and light theme controls
	useEffect(() => {
		const themeValue = localStorage?.getItem("theme");

		if (!themeValue) {
			setCheck(false);
			localStorage.setItem("theme", "light");
		} else {
			themeValue === "dark" && setCheck(true);
			themeValue === "light" && setCheck(false);
		}

		localStorage?.getItem("theme") === "dark"
			? document.documentElement.classList.add("dark")
			: document.documentElement.classList.remove("dark");
	}, []);

	// Create and light theme function
	const handleTheme = (value) => {
		if (value === "light") {
			setCheck(false);
			localStorage.setItem("theme", "light");
			setLocal("light");
		} else {
			setCheck(true);
			localStorage.setItem("theme", "dark");
			setLocal("dark");
		}
		localStorage?.getItem("theme") === "dark"
			? document.documentElement.classList.add("dark")
			: document.documentElement.classList.remove("dark");
	};

	// Active navlinks function
	function NavLink({ to, className, activeClassName, inactiveClassName, ...rest }) {
		let location = useLocation();
		let isActive = location.pathname === to;
		let allClassNames = className + (isActive ? `${activeClassName}` : `${inactiveClassName}`);
		return <Link className={allClassNames} to={to} {...rest} />;
	}

	// Menu items for Homepage One
	const menuItem = [
		{
			id: "01",
			name: "Moon",
			link: "/moon",
			icon: <WiMoonAltWaxingCrescent1 />,
		},
		{
			id: "02",
			name: "Detect Quake",
			link: "/detect-quake",
			icon: <WiEarthquake />,
		},
		{
			id: "03",
			name: "Visualize Quake",
			link: "/visualize-quake",
			icon: <GiQuakeStomp />,
		},
		{
			id: "04",
			name: "Lunar Module",
			link: "/lunar-module",
			icon: <GiLunarModule />,
		},
		{
			id: "05",
			name: "About Moonquakes",
			link: "/moonquakes",
			icon: <GiLunarWand />,
		},
		{
			id: "06",
			name: "About Us",
			link: "/about",
			icon: <BsFillPeopleFill />,
		},
		{
			id: "07",
			name: "Paper",
			link: "/paper",
			icon: <RiFilePaper2Fill />,
		},
		{
			id: "08",
			name: "Source",
			link: "https://github.com/ralphrazzouk/aberration",
			icon: <AiOutlineGithub />,
		},
	];

	const [menuOpen, setMenuOpen] = useState(false);
	// const { handleTheme, check, NavLink } = UseData();
	const handle = (e) => {
		handleTheme(e);
	};
	const a = useLocation();

	return (
		<div className="z-50 ">
			<div className="container">
				{/* Navbar menu start  */}
				<header className="flex justify-between items-center fixed top-0 left-0 w-full lg:static z-[1111111111]">
					<div className=" flex justify-between w-full px-4 lg:px-0 bg-gray dark:bg-gray lg:bg-transparent lg:dark:bg-transparent">
						<div className="flex justify-between w-full items-center space-x-4 lg:my-8 my-5 ">
							<Link className="text-5xl font-semibold" to="/">
								{/* website logo  */}

								<img className="h-[48px] lg:h-[64px]" src={logo} alt="Aberration Logo" />
							</Link>
							<div className="flex items-center">
								{/* dark mode icon */}

								{!check ? (
									<span
										onClick={() => handle("dark")}
										className="flex justify-center items-center w-[40px] h-[40px] ml-4 rounded-full opacity-100 visible cursor-pointer lg:opacity-0 lg:hidden text-black hover:text-white bg-black hover:bg-secondary transition-all duration-300 ease-in-out"
									>
										<FiMoon className="  text-3xl" />
									</span>
								) : (
									<span
										onClick={() => handle("light")}
										className="flex justify-center items-center w-[40px] h-[40px] ml-4 rounded-full opacity-100 visible cursor-pointer lg:opacity-0 lg:hidden bg-[#282828] hover:bg-secondary transition-all duration-300 ease-in-out"
									>
										<FiSun className="text-white text-3xl" />
									</span>
								)}

								{/* mobile menu icon */}

								{!menuOpen ? (
									<span
										onClick={() => setMenuOpen(!menuOpen)}
										className="flex justify-center items-center w-[40px] h-[40px] rounded-full ml-3 visible opacity-100 cursor-pointer lg:opacity-0 lg:invisible text-3xl dark:text-white bg-tertiary"
									>
										<AiOutlineMenu />
									</span>
								) : (
									<span
										onClick={() => setMenuOpen(!menuOpen)}
										className="flex justify-center items-center w-[40px] h-[40px] rounded-full ml-3 visible opacity-100 cursor-pointer lg:opacity-0 lg:invisible text-3xl text-white bg-tertiary"
									>
										<AiOutlineClose />
									</span>
								)}
							</div>
						</div>
					</div>
					<nav className={`${menuOpen ? "block  dark:bg-black" : "hidden lg:block"}`}>
						{/* Menu items start  */}

						<ul
							className={`${
								menuOpen
									? "block absolute w-full left-0 rounded-b-[20px] top-20 py-4 lg:hidden z-[22222222222222] bg-white dark:bg-[#282828] drop-shadow-lg "
									: "flex my-12 "
							}`}
						>
							{menuItem.map((item) => (
								<li onClick={() => setMenuOpen(false)} key={item.id} className=" ">
									<NavLink
										key={item.id}
										activeClassName={`${
											menuOpen
												? "text-secondary dark:text-secondary"
												: "text-white dark:text-white bg-gradient-to-r from-secondary to-tertiary"
										}`}
										inactiveClassName={`${
											menuOpen
												? "dark:hover:text-secondary"
												: "dark:hover:text-white dark:bg-[#141414] hover:text-white hover:bg-gradient-to-r from-secondary to-tertiary dark:text-[#ececec]"
										}  transition-all duration-300 ease-in-out`}
										className={`${
											a.pathname === "/home" && item.id === "01"
												? "text-white linked dark:text-white bg-gradient-to-r from-secondary to-tertiary"
												: " "
										} ${
											menuOpen
												? "pl-4 dark:text-white hover:text-secondary dark:hover:text-secondary"
												: "rounded-md cursor-pointer font-poppins bg-white text-gray"
										} flex items-center mx-2.5 py-2.5 md:px-4 xl:px-5 font-medium text-xtiny transition-all duration-300 ease-in-out`}
										to={item?.link}
									>
										<span className="mr-2 text-xl">{item?.icon}</span> {item?.name}
									</NavLink>
								</li>
							))}

							{/* dark mode */}

							{!check ? (
								<span
									onClick={() => handle("dark")}
									className="w-[40px] h-[40px] ml-2 hidden rounded-full lg:flex justify-center items-center cursor-pointer text-black hover:text-white bg-white hover:bg-tertiary transition-all duration-300 ease-in-out"
								>
									<FiMoon className="text-3xl" />
								</span>
							) : (
								<span
									onClick={() => handle("light")}
									className="w-[40px] h-[40px] ml-2 hidden rounded-full lg:flex justify-center items-center cursor-pointer bg-[#282828] hover:bg-tertiary transition-all duration-300 ease-in-out"
								>
									<FiSun className="text-white text-3xl" />
								</span>
							)}
						</ul>

						{/* Menu items end  */}
					</nav>
				</header>

				{/* Navbar menu End  */}

				{<Outlet />}
			</div>
		</div>
	);
};

export default Navbar;
