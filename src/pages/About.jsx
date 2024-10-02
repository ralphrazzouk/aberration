import React from "react";
import "../output.css";

import { AiOutlineMail, AiFillTwitterCircle, AiFillLinkedin, AiOutlineGithub } from "react-icons/ai";

const team = [
	{
		name: "Ralph Razzouk",
		email: "rlphrazz@gmail.com",
		url: "https://ralphrazzouk.com",
		linkedin: "",
		image: "",
	},
	{
		name: "Peter Mouaikel",
		email: "petermouaikel11@gmail.com",
		url: "",
		linkedin: "https://www.linkedin.com/in/peter-mouaikel-b52b6420a/",
		image: "",
	},
	{
		name: "Albert El Haddad",
		email: "albert.haddad@outlook.com",
		url: "",
		linkedin: "https://www.linkedin.com/in/albert-el-haddad-1974a6190/s",
		image: "",
	},
	{
		name: "Raphael El Khoury",
		email: "raphaelelkhoury@gmail.com",
		url: "",
		linkedin: "",
		image: "",
	},
	{
		name: "Christelle El Helou",
		email: "",
		url: "",
		linkedin: "",
		image: "",
	},
	{
		name: "Patrick Eid",
		email: "patrickeid10@gmail.com",
		url: "",
		linkedin: "https://www.linkedin.com/in/patrick-eid-986059192/",
		image: "",
	},
];

const About = () => {
	return (
		<>
			<a className="backbutton" href="/">
				Back
			</a>
			<div class="row">
				<h1>
					<b>Meet The Team</b>
				</h1>
			</div>
			<div class="row">
				{/* Column 1 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Razz.jpeg" />
						</div>
						<h3>Ralph Razzouk</h3>
						<p>Team Leader | Mathematics & Physics</p>
						<div class="icons">
							<a href="https://twitter.com/rlphrazz" target="_blank">
								<AiFillTwitterCircle />
							</a>
							<a href="https://linkedin.com/in/ralphrazzouk" target="_blank">
								<AiFillLinkedin />
							</a>
							<a href="https://github.com/rlphrazz" target="_blank">
								<AiOutlineGithub />
							</a>
							<a href="rlphrazz@gmail.com" target="_blank">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>

				{/* Column 2 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Peets.jpeg" />
						</div>
						<h3>Peter Mouaikel</h3>
						<p>Developer | Mechanical Engineer</p>
						<div class="icons">
							<a href="https://twitter.com/Peter_Mouaikel" target="_blank">
								<AiFillTwitterCircle />
							</a>
							<a href="https://www.linkedin.com/in/peter-mouaikel-b52b6420a/" target="_blank">
								<AiFillLinkedin />
							</a>
							<a href="petermouaikel11@gmail.com" target="_blank">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>

				{/* Column 3 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Chris.jpeg" />
						</div>
						<h3>Christelle El Helou</h3>
						<p>Researcher | Physics</p>
						<div class="icons">
							<a href="#">
								<AiFillLinkedin />
							</a>
							<a href="#">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>

				{/* Column 4 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Pats.jpeg" />
						</div>
						<h3>Patrick Eid</h3>
						<p>Project Management | Mechanical Engineer</p>
						<div class="icons">
							<a href="https://www.linkedin.com/in/patrick-eid-986059192/">
								<AiFillLinkedin />
							</a>
							<a href="patrickeid10@gmail.com">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>

				{/* Column 5 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Albort.jpeg" />
						</div>
						<h3>Albert El Haddad</h3>
						<p>Developer | Mechanical Engineer</p>
						<div class="icons">
							<a href="https://twitter.com/AlbertDHaddad" target="_blank">
								<AiFillTwitterCircle />
							</a>
							<a href="https://www.linkedin.com/in/albert-el-haddad-1974a6190/" target="_blank">
								<AiFillLinkedin />
							</a>
							<a href="albert.haddad@outlook.com">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>

				{/* Column 6 */}
				<div class="column">
					<div class="card">
						<div class="img-container">
							<img src="/professionalphotos/Rafx.jpeg" />
						</div>
						<h3>Raphael El Khoury</h3>
						<p>3D Artist | Computer Graphics Artist</p>
						<div class="icons">
							<a href="raphaelelkhoury@gmail.com">
								<AiOutlineMail />
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default About;
