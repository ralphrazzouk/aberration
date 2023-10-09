// router.js
import page from "page";

function handleHome() {
	console.log("Home Page");
}

function handleAbout() {
	console.log("About Page");
}

page("/", handleHome);
page("/about", handleAbout);

export default page;

const routes = {
	404: "/pages/404.html",
	"/": "/index.html",
	"/about": "/pages/about.html",
	"/experience": "/pages/experience.html",
	"/moonquakes": "/pages/moonquakes.html",
	"/lunar_module": "/pages/lunar_module.html",
	"/moon": "/pages/moon.html",
};

const handleLocation = async () => {
	const path = window.location.pathname;
	const route = routes[path] || routes[404];
	const html = await fetch(route).then((data) => data.text());
	document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
