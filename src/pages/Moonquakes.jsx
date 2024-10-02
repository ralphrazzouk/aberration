import React from "react";
import "../output.css";

const Moonquakes = () => {
	return (
		<>
			<div className="bg-homeBg min-h-screen dark:bg-homeBg-dark bg-no-repeat bg-center bg-cover bg-scroll flex justify-center bg-attac">
				<div className="absolute w-3/4 m-12 py-16 px-24 bg-[#141414] bg-opacity-90 rounded-3xl">
					<div className="text-center align-middle">
						<h1 className="font-bold text-7xl">About Moonquakes</h1>
						<h2 className="font-light text-2xl">
							There are three types of moonquakes large enough for us to observe them at great distances. They are deep moonquakes,
							those caused by meteoroids, and shallow moonquakes.
						</h2>
					</div>

					<br />
					<br />

					<div className="text-center align-middle">
						<h1 className="font-medium text-6xl">Deep Moonquakes</h1>
						<h2 className="font-light text-xl">
							Deep moonquakes are the most common type, reaching up to two thousand quakes detected per year during the Apollo lunar
							seismic experiment. They occur about halfway to the center of the moon. However, the most intriguing part of deep
							moonquakes is the regularity in time of their occurrence, showing a clear correlation with the tidal periodicity of the
							moon. No such quakes have been identified on Earth, likely due to the lack of sufficiently sensitive seismographs. Despite
							their large numbers, the total energy released by them is quite insignificant in comparison with that of earthquakes
							(Lammlein et al., 1974). Deep moonquakes appear to represent merely a process of storage and release of tidal energy
							without a significant release of tectonic energy. (Nakamura, 1978; Koyama and Nakamura, 1980)
						</h2>
					</div>

					<br />
					<br />

					<div className="text-center align-middle">
						<h1 className="font-medium text-6xl">Shallow Moonquakes</h1>
						<h2 className="font-light text-xl">
							The rarest type of moonquakes are the shallow moonquakes. They were detected only four to five times yearly by the Apollo
							seismic network. However, they represent the most energetic sources in the moon, and account for most of the seismic
							energy released in the moon. They occur at depths generally shallower than about 100 km (Nakamura et al., 1979), and
							appear to be the only moonquakes that may be related to earthquakes in their origin.
						</h2>
					</div>

					<br />
					<br />

					<div className="text-center align-middle">
						<h1 className="font-medium text-6xl">Meteorite Moonquakes</h1>
						<h2 className="font-light text-xl">
							The second most abundant type of moonquakes are those formed by meteoroid impacts. About three hundred of them were
							observed yearly by the Apollo seismic network. They are obviously of external origin and are in no way comparable to
							earthquakes.
						</h2>
					</div>
				</div>
			</div>

			<header className="z-10">
				<a class="backbutton" href="/">
					Back
				</a>
			</header>
		</>
	);
};

export default Moonquakes;
