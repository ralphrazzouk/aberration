import { useEffect, useRef } from "react";

import "../output.css";
import * as THREE from "three";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Lut } from "three/addons/math/Lut.js";
import { GUI } from "./dat.gui.module.js"; // Import GUI module

///// DATA
//  assert { type: "json" }
import sm1979 from "../assets/nakamura_1979_sm_locations.json";
import dm2005 from "../assets/nakamura_2005_dm_locations.json";
import mm2003 from "../assets/lognonne_2003_meteorite_locations.json";
import lm1983 from "../assets/nakamura_1983_ai_locations.json";

import baysData from "../assets/locations/Bays.json";
import lakesData from "../assets/locations/Lakes.json";
import mountainrangeData from "../assets/locations/Mountain_Range.json";
import mountainsData from "../assets/locations/Mountains.json";
import seasData from "../assets/locations/Seas.json";
import valleysData from "../assets/locations/Valleys.json";
import cratersData from "../assets/locations/Craters.json";

///// INITIALIZATIONS
let manager, textureLoader, renderer, scene, camera, uiScene, orthoCamera, controls, gui;
let mixer, object, action, lut;
const glbLoader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const labelRenderer = new CSS2DRenderer();

let bg,
	moon,
	sun,
	topography,
	topographyImg,
	topographyLabel,
	layers,
	roughnessHE,
	roughnessMAS,
	gravityFA,
	gravityB,
	crustLayer,
	mantleLayer,
	partialMeltLayer,
	outerCoreLayer,
	innerCoreLayer,
	layersLight;
let sunlight, sunlight2, ambientLight, lvs;
let shallow, deep, meteorite, modules;
let bays, lakes, mountainrange, mountains, seas, valleys, craters;
let moonquakeFolder, moonFolder, locationsFolder, lightFolder, cameraFolder, dateFolder;
let waveform,
	magScale,
	sm_tori,
	sm_day_grp,
	moonquakeLabelDiv,
	moonquakeLabel,
	moonquakeTextDiv,
	moonquakeText,
	moonquakeImgDiv,
	moonquakeImg,
	coreLabelDiv,
	coreLabel,
	defaultYear,
	currentYear,
	defaultDay,
	currentDay,
	years1,
	Years,
	days,
	list2;

//////////////////// MAIN ////////////////////
const main = () => {
	scene = new THREE.Scene();
	uiScene = new THREE.Scene();

	createManager();
	createRenderer();
	createCamera();
	createOrthocamera();
	createControls();

	window.addEventListener("resize", onWindowResize);

	///// UNIVERSE
	createBackground();
	createMoon();
	createSun();
	createLights();

	///// MOONQUAKE DATA
	createShallowMoonquakes();
	createDeepMoonquakes();
	createMeteoriteMoonquakes();
	createLunarModules();

	///// MOON OPTIONS
	createTopography();
	createLayers();
	createRoughnessMaps();
	createGravityMaps();

	///// MOON LOCATIONS
	createLunarBays();
	createLunarCraters();
	createLunarLakes();
	createLunarMountains();
	createLunarSeas();
	createLunarValleys();

	///// GUI
	gui = new GUI({ width: 400 });
	createMoonquakeFolder();
	createMoonFolder();
	createLocationsFolder();
	createLightFolder();
	createCameraFolder();
	createDateFolder();

	///// MISC
	// createWaveform();
	// createColorBar();
	createLabels();
	createMoonquakeLabel();
	createLayerLabel();

	// ANIMATE
	animate();
};

//////////////////// FUNCTIONS ////////////////////
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	event.preventDefault();

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function toCartesian(lat, lon) {
	const radius = 15;
	var phi = (90 - lat) * (Math.PI / 180);
	var theta = (lon + 180) * (Math.PI / 180);

	var x = -(radius * Math.sin(phi) * Math.cos(theta));
	var z = radius * Math.sin(phi) * Math.sin(theta);
	var y = radius * Math.cos(phi);

	return new THREE.Vector3(x, y, z);
}

function rotateLatLon(lat, lon, angle = 0, radius = 15) {
	var phi = (90 - lat) * (Math.PI / 180);
	var theta = (lon + 180 + angle) * (Math.PI / 180);

	var x = -(radius * Math.sin(phi) * Math.cos(theta));
	var z = radius * Math.sin(phi) * Math.sin(theta);
	var y = radius * Math.cos(phi);

	return new THREE.Vector3(x, y, z);
}

const render = () => {
	renderer.render(scene, camera);
	renderer.render(uiScene, orthoCamera);
};
///////////////////////////////////////////////////

const createManager = () => {
	manager = new THREE.LoadingManager();
	textureLoader = new THREE.TextureLoader(manager);

	manager.onLoad = function () {
		console.log("Loading complete!");
		// document.querySelector('#bg');
		// document.getElementById("bg").style.zIndex = 1000;
		// document.getElementById("portfolio-loader").remove();
		document.getElementById("loadingScreen").remove();
	};
};

const createRenderer = () => {
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector("#canvas"),
		antialias: true,
	});
	renderer.autoClear = false;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// renderer.gammaFactor = 2.2;
	// renderer.gammaOutput = true;
	// renderer.physicallyCorrectLights = true;
	// container.appendChild(renderer.domElement);
};

const createCamera = () => {
	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 20000;

	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 0, 30);
};

const createOrthocamera = () => {
	const left = -25;
	const right = 25;
	const top = 25;
	const bottom = -25;
	const near = 1;
	const far = 50;

	orthoCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
	orthoCamera.position.set(0, 0, 30);
};

const createControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 16;
	controls.maxDistance = 200;
	controls.saveState();
};

const createLights = () => {
	sunlight = new THREE.PointLight(0xffffff, 5000);
	sunlight.position.set(50, 10, 50);
	scene.add(sunlight);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
	scene.add(ambientLight);

	// const lightHelper = new THREE.PointLightHelper(sunlight);
	// const gridHelper = new THREE.GridHelper(200, 50);
	// scene.add(lightHelper, gridHelper);
	// const axesHelper = new THREE.AxesHelper(30);
	// scene.add(axesHelper);
	// light rotation object
	lvs = new THREE.Mesh(new THREE.SphereGeometry(5, 3, 2), new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }));
	lvs.add(sunlight, sun);
	scene.add(lvs);
};

//////////////////// MOON ////////////////////
const createBackground = () => {
	const bgGeometry = new THREE.SphereGeometry(10000, 100, 100);
	const bgMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/milkyway.jpg"),
		side: THREE.DoubleSide, // Texture shows on both sides of sphere
		transparent: true,
		opacity: 1,
	});

	bg = new THREE.Mesh(bgGeometry, bgMaterial);
	scene.add(bg);
};

const createMoon = () => {
	const moonGeometry = new THREE.SphereGeometry(15, 100, 100, -Math.PI / 2);
	const moonMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/moon.jpg"),
	});

	moonMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	moonMaterial.bumpScale = 0.025;

	moon = new THREE.Mesh(moonGeometry, moonMaterial);
	moon.geometry.computeVertexNormals();
	// moon.rotation.z = 0.05; // Moon's oblique tilt
	scene.add(moon);
};

const createSun = () => {
	const sunGeometry = new THREE.SphereGeometry(10, 32, 32).rotateY(Math.PI);
	const sunMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/sun.jpg"),
		transparent: true,
		emissive: 0xffffff,
		emissiveIntensity: 0.75,
	});

	sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sun.position.set(200, 10, 200);
	scene.add(sun);
};

const createTopography = () => {
	const topographyGeometry = new THREE.SphereGeometry(15.004, 100, 100, Math.PI / 2);
	const topographyMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/colormaps/topography.jpg"),
	});
	topographyMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	topographyMaterial.bumpScale = 0.03;

	topography = new THREE.Mesh(topographyGeometry, topographyMaterial);
	topography.visible = false;
	scene.add(topography);
	moon.add(topography);

	// IMAGE
	topographyImg = document.createElement("img");
	topographyImg.className = "topographyLabel";
	topographyLabel = new CSS2DObject(topographyImg);
	topographyLabel.visible = false;
	topographyLabel.position.x = -18;
	topographyLabel.position.y = 0;
	uiScene.add(topographyLabel);
};

const createLayers = () => {
	layers = new THREE.Group();

	///// HALF MOON
	const halfMoonGeometry = new THREE.SphereGeometry(14.99, 100, 100, 0, Math.PI);
	const halfMoonMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/moonhalf.jpg"),
		side: THREE.DoubleSide,
	});
	halfMoonMaterial.bumpMap = textureLoader.load("/maps/moon16half.jpg");
	halfMoonMaterial.bumpScale = 0.025;
	const halfMoon = new THREE.Mesh(halfMoonGeometry, halfMoonMaterial);
	// layers.add(halfMoon);
	scene.add(halfMoon);

	///// CRUST LAYER
	const crustLayerGeometry = new THREE.CircleGeometry(15, 100);
	const crustLayerMaterial = new THREE.MeshStandardMaterial({
		color: 0x666566,
		side: THREE.DoubleSide,
	});
	crustLayer = new THREE.Mesh(crustLayerGeometry, crustLayerMaterial);
	crustLayer.userData.originalColor = 0x666566;
	crustLayer.translateZ(-0.01);
	crustLayer.name = "Crust (52 km)";
	layers.add(crustLayer);

	///// MANTLE LAYER
	const mantleLayerGeometry = new THREE.CircleGeometry(15 - 0.45, 100);
	const mantleLayerMaterial = new THREE.MeshStandardMaterial({
		color: 0x7f7f7f,
		side: THREE.DoubleSide,
	});
	mantleLayer = new THREE.Mesh(mantleLayerGeometry, mantleLayerMaterial);
	mantleLayer.userData.originalColor = 0x7f7f7f;
	mantleLayer.translateZ(-0.02);
	mantleLayer.name = "Mantle (1205 km)";
	layers.add(mantleLayer);

	///// PARTIAL MELT LAYER
	const partialMeltLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4, 100);
	const partialMeltLayerMaterial = new THREE.MeshStandardMaterial({
		color: 0xa62825,
		side: THREE.DoubleSide,
	});
	partialMeltLayer = new THREE.Mesh(partialMeltLayerGeometry, partialMeltLayerMaterial);
	partialMeltLayer.userData.originalColor = 0xa62825;
	partialMeltLayer.translateZ(-0.03);
	partialMeltLayer.name = "Partial Melt (150 km)";
	layers.add(partialMeltLayer);

	///// OUTER CORE LAYER
	const outerCoreLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4 - 1.3, 100);
	const outerCoreLayerMaterial = new THREE.MeshStandardMaterial({
		color: 0xa54c24,
		side: THREE.DoubleSide,
	});
	outerCoreLayer = new THREE.Mesh(outerCoreLayerGeometry, outerCoreLayerMaterial);
	outerCoreLayer.userData.originalColor = 0xa54c24;
	outerCoreLayer.translateZ(-0.04);
	outerCoreLayer.name = "Outer Core (90 km)";
	layers.add(outerCoreLayer);

	///// INNER CORE LAYER
	const innerCoreLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4 - 1.3 - 0.78, 100);
	const innerCoreLayerMaterial = new THREE.MeshStandardMaterial({
		color: 0xa4812e,
		side: THREE.DoubleSide,
	});
	innerCoreLayer = new THREE.Mesh(innerCoreLayerGeometry, innerCoreLayerMaterial);
	innerCoreLayer.userData.originalColor = 0xa4812e;
	innerCoreLayer.translateZ(-0.05);
	innerCoreLayer.name = "Inner Core (240 km)";
	layers.add(innerCoreLayer);

	///// LIGHT ON CORES
	layersLight = new THREE.PointLight(0xffffff, 1);
	layersLight.position.set(0, 10, -20);
	layers.add(layersLight);
	// const lightHelper = new THREE.PointLightHelper(coreLight);
	// scene.add(lightHelper);

	scene.add(layers);
	layers.visible = false;
};

const createRoughnessMaps = () => {
	// SURFACE ROUGHESS MAP - Hurst Exponent
	const roughnessHEGeometry = new THREE.SphereGeometry(15.008, 100, 100, -Math.PI / 2);
	const roughnessHEMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/colormaps/heatmapHE.png"),
	});
	// roughnessHEMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	// roughnessHEMaterial.bumpScale = 0.03;

	roughnessHE = new THREE.Mesh(roughnessHEGeometry, roughnessHEMaterial);
	roughnessHE.visible = false;
	scene.add(roughnessHE);
	moon.add(roughnessHE);

	// SURFACE ROUGHESS MAP - Median Absolute Slope
	const roughnessMASGeometry = new THREE.SphereGeometry(15.012, 100, 100, -Math.PI / 2);
	const roughnessMASMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/colormaps/heatmapMAS.png"),
	});
	// roughnessMASMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	// roughnessMASMaterial.bumpScale = 0.03;

	roughnessMAS = new THREE.Mesh(roughnessMASGeometry, roughnessMASMaterial);
	roughnessMAS.visible = false;
	scene.add(roughnessMAS);
	moon.add(roughnessMAS);
};

const createGravityMaps = () => {
	// GRAVITY MAP - Free-Air
	const gravityFAGeometry = new THREE.SphereGeometry(15.016, 100, 100, -Math.PI / 2);
	const gravityFAMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/colormaps/gravityFA.jpg"),
	});
	// gravityFAMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	// gravityFAMaterial.bumpScale = 0.03;

	gravityFA = new THREE.Mesh(gravityFAGeometry, gravityFAMaterial);
	gravityFA.visible = false;
	scene.add(gravityFA);
	moon.add(gravityFA);

	// GRAVITY MAP - Bougeur
	const gravityBGeometry = new THREE.SphereGeometry(15.02, 100, 100, -Math.PI / 2);
	const gravityBMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/colormaps/gravityB.jpg"),
	});
	// gravityBMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
	// gravityBMaterial.bumpScale = 0.03;

	gravityB = new THREE.Mesh(gravityBGeometry, gravityBMaterial);
	gravityB.visible = false;
	scene.add(gravityB);
	moon.add(gravityB);
};
//////////////////////////////////////////////

//////////////////// MOONQUAKES ////////////////////
const createShallowMoonquakes = () => {
	shallow = new THREE.Group();
	sm_tori = new THREE.Group();
	magScale = 0.1;
	sm_day_grp = [];
	for (var i = 0; i < sm1979.length; i++) {
		var sm_year = sm1979[i].Year;
		var sm_day = sm1979[i].Day;
		var sm_h = sm1979[i].H;
		var sm_m = sm1979[i].M;
		var sm_s = sm1979[i].S;
		var sm_lat = sm1979[i].Lat;
		var sm_long = sm1979[i].Long;
		var sm_magnitude = sm1979[i].Magnitude;

		var sm_cartesian = rotateLatLon(sm_lat, sm_long, -90);
		var sm_mesh = new THREE.Mesh(new THREE.SphereGeometry(sm_magnitude / 12, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

		sm_mesh.position.set(sm_cartesian.x, sm_cartesian.y, sm_cartesian.z);
		sm_mesh.name =
			"Year: " +
			sm_year +
			"\r\nDay: " +
			sm_day +
			"\r\nHour: " +
			sm_h +
			"\r\nMin: " +
			sm_m +
			"\r\nSec: " +
			sm_s +
			"\r\nLat: " +
			sm_lat +
			"\r\nLon: " +
			sm_long +
			"\r\nMag: " +
			sm_magnitude;

		// var name = "";
		// for (let val in sm1979[i]) {
		// 	name += val + ": " + sm1979[i][val] + "\n";
		// }
		// sm_mesh.name = name;

		// sm_mesh.name = JSON.stringify(sm1979[i]);

		sm_mesh.userData = sm_year;
		sm_day_grp.push(sm_day);
		shallow.add(sm_mesh);

		var radius_sm = sm_magnitude / 12;
		var sm_torus = new THREE.Mesh(new THREE.TorusGeometry(radius_sm, 0.01, 100, 100), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
		sm_torus.position.set(sm_cartesian.x, sm_cartesian.y, sm_cartesian.z);
		sm_torus.lookAt(0, 0, 0);
		sm_torus.userData = sm_year;

		sm_tori.add(sm_torus);
	}

	shallow.add(sm_tori);
	shallow.visible = false;
	moon.add(shallow);
	// scene.add(shallow);
	// scene.add(sm_tori);
};

const createDeepMoonquakes = () => {
	deep = new THREE.Group();
	for (var i = 0; i < dm2005.length; i++) {
		var dm_A = dm2005[i].A;
		var dm_side = dm2005[i].Side;
		var dm_lat = dm2005[i].Lat;
		var dm_lat_err = dm2005[i].Lat_err;
		var dm_lon = dm2005[i].Long;
		var dm_lon_err = dm2005[i].Long_err;
		var dm_depth = dm2005[i].Depth;
		var dm_depth_err = dm2005[i].Depth_err;
		var dm_assumed = dm2005[i].Assumed;

		var dm_cartesian = rotateLatLon(dm_lat, dm_lon, -90);
		var dm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xfff000 }));
		dm_mesh.position.set(dm_cartesian.x, dm_cartesian.y, dm_cartesian.z);

		dm_mesh.name =
			"A: " +
			dm_A +
			"\r\nSide: " +
			dm_side +
			"\r\nLat: " +
			dm_lat +
			"\r\nLat_err: " +
			dm_lat_err +
			"\r\nLon: " +
			dm_lon +
			"\r\nLon_err: " +
			dm_lon_err +
			"\r\nDepth: " +
			dm_depth +
			"\r\nDepth_err: " +
			dm_depth_err +
			"\r\nAssumed: " +
			dm_assumed;

		deep.add(dm_mesh);
	}
	deep.visible = false;
	scene.add(deep);
	moon.add(deep);
};

const createMeteoriteMoonquakes = () => {
	meteorite = new THREE.Group();
	for (var i = 0; i < mm2003.length; i++) {
		var mm_type = mm2003[i].Type;
		var mm_lat = mm2003[i].Lat;
		var mm_long = mm2003[i].Long;
		var mm_depth = mm2003[i].Depth;
		var mm_phi = mm2003[i].Phi;
		var mm_date = mm2003[i].Date;
		var mm_seconds = mm2003[i].Seconds;
		var mm_time_err = mm2003[i].Time_err;

		var mm_cartesian = rotateLatLon(mm_lat, mm_long, -90);
		var mm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0066ff }));
		mm_mesh.position.set(mm_cartesian.x, mm_cartesian.y, mm_cartesian.z);

		mm_mesh.name =
			"Type: " +
			mm_type +
			"\r\nLat: " +
			mm_lat +
			"\r\nLong: " +
			mm_long +
			"\r\nDepth: " +
			mm_depth +
			"\r\nPhi: " +
			mm_phi +
			"\r\nDate: " +
			mm_date +
			"\r\nSeconds: " +
			mm_seconds +
			"\r\nTime_err: " +
			mm_time_err;

		meteorite.add(mm_mesh);
	}
	meteorite.visible = false;
	scene.add(meteorite);
	moon.add(meteorite);
};

const createLunarModules = () => {
	modules = new THREE.Group();
	for (var i = 0; i < lm1983.length; i++) {
		var lm_AI = lm1983[i].AI;
		var lm_lat = lm1983[i].Lat;
		var lm_long = lm1983[i].Long;
		var lm_year = lm1983[i].Y;
		var lm_JD = lm1983[i].JD;
		var lm_hour = lm1983[i].Hour;
		var lm_min = lm1983[i].Min;
		var lm_sec = lm1983[i].Sec;

		var lm_cartesian = rotateLatLon(lm_lat, lm_long, -90);
		var lm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 20), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
		lm_mesh.position.set(lm_cartesian.x, lm_cartesian.y, lm_cartesian.z);

		lm_mesh.name =
			"AI: " +
			lm_AI +
			"\r\nLat: " +
			lm_lat +
			"\r\nLong: " +
			lm_long +
			"\r\nYear: " +
			lm_year +
			"\r\nJD: " +
			lm_JD +
			"\r\nHour: " +
			lm_hour +
			"\r\nMin: " +
			lm_min +
			"\r\nSec: " +
			lm_sec;

		modules.add(lm_mesh);
	}

	var lunarmodules = new THREE.Group();
	glbLoader.load("/3d/lunar_module.glb", function (gltf) {
		for (var i = 0; i < lm1983.length; i++) {
			var lm_AI = lm1983[i].AI;
			var lm_lat = lm1983[i].Lat;
			var lm_long = lm1983[i].Long;
			var lm_year = lm1983[i].Y;
			var lm_JD = lm1983[i].JD;
			var lm_hour = lm1983[i].Hour;
			var lm_min = lm1983[i].Min;
			var lm_sec = lm1983[i].Sec;
			const object = gltf.scene.clone();

			object.children[0].name =
				"AI: " +
				lm_AI +
				"\r\nLat: " +
				lm_lat +
				"\r\nLong: " +
				lm_long +
				"\r\nYear: " +
				lm_year +
				"\r\nJD: " +
				lm_JD +
				"\r\nHour: " +
				lm_hour +
				"\r\nMin: " +
				lm_min +
				"\r\nSec: " +
				lm_sec;

			console.log(object);

			var lm_cartesian = rotateLatLon(lm_lat, lm_long, -90);
			object.position.set(lm_cartesian.x, lm_cartesian.y, lm_cartesian.z);
			object.scale.set(0.1, 0.1, 0.1);
			object.lookAt(0, 0, 0);
			lunarmodules.add(object);
		}
	});

	modules.visible = false;
	modules.add(lunarmodules);
	scene.add(modules);
	moon.add(modules);
};
////////////////////////////////////////////////////

//////////////////// LOCATIONS ////////////////////
const createLunarBays = () => {
	bays = new THREE.Group();
	for (var i = 0; i < baysData.length; i++) {
		var bays_cartesian = rotateLatLon(baysData[i].Lat, baysData[i].Long, -90, 15.4);
		var bays_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarBays.png"),
			})
		);
		bays_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		bays_icon.position.set(bays_cartesian.x, bays_cartesian.y, bays_cartesian.z);
		bays.add(bays_icon);
	}
	bays.visible = false;
	scene.add(bays);
	moon.add(bays);
};

const createLunarCraters = () => {
	craters = new THREE.Group();
	for (var i = 0; i < cratersData.length; i++) {
		var craters_cartesian = rotateLatLon(cratersData[i].Lat, cratersData[i].Long, -90, 15.4);
		var craters_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarCraters.png"),
			})
		);
		craters_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		craters_icon.position.set(craters_cartesian.x, craters_cartesian.y, craters_cartesian.z);
		craters.add(craters_icon);
	}
	craters.visible = false;
	scene.add(craters);
	moon.add(craters);
};

const createLunarLakes = () => {
	lakes = new THREE.Group();
	for (var i = 0; i < lakesData.length; i++) {
		var lakes_cartesian = rotateLatLon(lakesData[i].Lat, lakesData[i].Long, -90, 15.4);
		var lakes_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarLakes.png"),
			})
		);
		lakes_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		lakes_icon.position.set(lakes_cartesian.x, lakes_cartesian.y, lakes_cartesian.z);
		lakes.add(lakes_icon);
	}
	lakes.visible = false;
	scene.add(lakes);
	moon.add(lakes);
};

const createLunarMountains = () => {
	mountains = new THREE.Group();
	for (var i = 0; i < mountainsData.length; i++) {
		var mountains_cartesian = rotateLatLon(mountainsData[i].Lat, mountainsData[i].Long, -90, 15.4);
		var mountains_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarMountains.png"),
			})
		);
		mountains_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		mountains_icon.position.set(mountains_cartesian.x, mountains_cartesian.y, mountains_cartesian.z);
		mountains.add(mountains_icon);
	}
	mountains.visible = false;
	scene.add(mountains);
	moon.add(mountains);
};

const createLunarSeas = () => {
	seas = new THREE.Group();
	for (var i = 0; i < seasData.length; i++) {
		var seas_cartesian = rotateLatLon(seasData[i].Lat, seasData[i].Long, -90, 15.4);
		var seas_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarSeas.png"),
			})
		);
		seas_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		seas_icon.position.set(seas_cartesian.x, seas_cartesian.y, seas_cartesian.z);
		seas.add(seas_icon);
	}
	seas.visible = false;
	scene.add(seas);
	moon.add(seas);
};

const createLunarValleys = () => {
	valleys = new THREE.Group();
	for (var i = 0; i < valleysData.length; i++) {
		var valleys_cartesian = rotateLatLon(valleysData[i].Lat, valleysData[i].Long, -90, 15.4);
		var valleys_icon = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: textureLoader.load("/icons/LunarValleys.png"),
			})
		);
		valleys_icon.material.map.colorSpace = THREE.SRGBColorSpace;

		valleys_icon.position.set(valleys_cartesian.x, valleys_cartesian.y, valleys_cartesian.z);
		valleys.add(valleys_icon);
	}
	valleys.visible = false;
	scene.add(valleys);
	moon.add(valleys);
};
///////////////////////////////////////////////////

//////////////////// GUI ////////////////////
const createMoonquakeFolder = () => {
	moonquakeFolder = gui.addFolder("Moonquake Options");

	moonquakeFolder.add(shallow, "visible").name("Shallow Moonquakes");
	moonquakeFolder.add(deep, "visible").name("Deep Moonquakes");
	moonquakeFolder.add(meteorite, "visible").name("Meteorite Moonquakes");
	moonquakeFolder.add(modules, "visible").name("Lunar Modules");
};

const createMoonFolder = () => {
	moonFolder = gui.addFolder("Moon Options");

	moonFolder
		.add(topography, "visible")
		.onChange(function () {
			topographyLabel.visible = !topographyLabel.visible;
		})
		.name("Topography Map");
	moonFolder.add(roughnessHE, "visible").name("Surface Roughness - Hurst Exponent");
	moonFolder.add(roughnessMAS, "visible").name("Surface Roughness - Median Absolute Slope");
	moonFolder.add(gravityFA, "visible").name("Gravity Map - Free-Air");
	moonFolder.add(gravityB, "visible").name("Gravity Map - Bougeur");
	// moonFolder.add(unified, "visible").name("Unified Map Visibility");
	moonFolder
		.add(layers, "visible")
		.onChange(function () {
			moon.visible = !moon.visible;
		})
		.name("Show Moon Layers");

	var moonStatus = {
		speed: 0,
		toggleStatus: function () {
			if (this.speed != 0) {
				this.speed = 0;
			}
		},
	};
	moonFolder.add(moonStatus, "speed", -5, 5, 0.01).name("Rotation Speed");
	moonFolder.add(moonStatus, "toggleStatus").name("Stop Rotation");
};

const createLocationsFolder = () => {
	locationsFolder = gui.addFolder("Moon Locations");

	locationsFolder.add(bays, "visible").name("Lunar Bays");
	locationsFolder.add(craters, "visible").name("Lunar Craters");
	locationsFolder.add(lakes, "visible").name("Lunar Lakes");
	// locationsFolder.add(mountainrange, "visible").name("Lunar Mountain Range");
	locationsFolder.add(mountains, "visible").name("Lunar Mountains");
	locationsFolder.add(seas, "visible").name("Lunar Seas");
	locationsFolder.add(valleys, "visible").name("Lunar Valleys");
};

const createLightFolder = () => {
	lightFolder = gui.addFolder("Light Options");

	lightFolder.add(sunlight, "intensity", 1000, 10000).name("Sunlight Intensity");
	lightFolder.add(lvs.rotation, "y", 0, 2 * Math.PI, 0.02).name("Sunlight Position");
	lightFolder.add(ambientLight, "intensity", 0, 1).name("Universal Intensity");
	var universalLightStatus = {
		toggleStatus: function () {
			if (sunlight.intensity != 0 || ambientLight.intensity != 5) {
				sunlight.intensity = 0;
				ambientLight.intensity = 5;
			} else {
				sunlight.intensity = 1;
				ambientLight.intensity = 1;
			}
		},
	};
	lightFolder.add(universalLightStatus, "toggleStatus").name("Disable Realistic Light");
};

const createCameraFolder = () => {
	cameraFolder = gui.addFolder("Camera Options");

	// CAMERA FOLDER
	var fovSettings = {
		fovValue: 75,
		fovReset: function () {
			this.fovValue = 75;
		},
	};
	cameraFolder.add(fovSettings, "fovValue", 50, 120, 1).name("Field of View");
	cameraFolder.add(fovSettings, "fovReset").name("Reset Camera");
	cameraFolder.add(controls, "reset").name("Reset Position");
	// cameraFolder.add(axesHelperSettings, "")
};

const createDateFolder = () => {
	dateFolder = gui.addFolder("Date & Time Options");

	years1 = { All: "All" };
	for (var i = 0; i < sm1979.length; i++) {
		years1[sm1979[i].Year] = sm1979[i].Year;
	}

	Years = {
		Years: "years",
	};
	dateFolder.add(Years, "Years", years1);

	days = {};
	for (var i = 0; i < sm_day_grp.length; i++) {
		days[sm_day_grp[i]] = sm_day_grp[i];
	}

	list2 = {
		Days: "Day",
	};
	dateFolder.add(list2, "Days", days);
};
/////////////////////////////////////////////

//////////////////// MISC ////////////////////
const createWaveform = () => {
	defaultYear = dateFolder.__controllers[0].getValue();
	defaultDay = dateFolder.__controllers[1].getValue();

	waveform = new THREE.Group();
	glbLoader.load("/3d/wave.glb", function (gltf) {
		for (var i = 0; i < sm_day_grp.length; i++) {
			if (sm_day_grp[i] == dateFolder.__controllers[1].getValue()) {
				// console.log(dateFolder.__controllers[1].getValue());

				object = gltf.scene;
				mixer = new THREE.AnimationMixer(object);
				action = mixer.clipAction(gltf.animations[0]);
				action.play();
				waveform.children[0] = object; //.scene

				object.position.set(shallow.children[i].position.x, shallow.children[i].position.y, shallow.children[i].position.z);
				object.scale.set(sm1979[i].Magnitude / 2, sm1979[i].Magnitude / 2, sm1979[i].Magnitude / 2);
				object.up.set(0, 1, 0);
				object.lookAt(0, 0, 0);
				// camera.target.position.copy(object);
				camera.position.set(shallow.children[i].position.x * 1.5, shallow.children[i].position.y * 1.5, shallow.children[i].position.z * 1.5);
			}
		}
	});
	scene.add(waveform);
};

const createColorBar = () => {
	lut = new Lut("rainbow", 512);
	const color = lut.getColor(0.5);

	var colorbar = new THREE.Sprite(
		new THREE.SpriteMaterial({
			map: new THREE.CanvasTexture(lut.createCanvas()),
		})
	);
	colorbar.material.map.colorSpace = THREE.SRGBColorSpace;
	colorbar.scale.x = 10;
	colorbar.scale.y = 10;
	colorbar.scale.z = 10;
	colorbar.scale.x = 0.5;
	colorbar.position.x = -20;
	colorbar.position.y = 10;
	uiScene.add(colorbar);
};

const createLabels = () => {
	labelRenderer.setSize(innerWidth, innerHeight);
	labelRenderer.domElement.style.position = "absolute";
	labelRenderer.domElement.style.top = "0px";
	labelRenderer.domElement.style.pointerEvents = "none";

	document.body.appendChild(labelRenderer.domElement);
	window.addEventListener("pointermove", onPointerMove);
};

const createMoonquakeLabel = () => {
	//LABEL
	// moonquakeLabelDiv = document.createElement("div");
	// moonquakeLabelDiv.className = "moonquakeLabel";
	// moonquakeLabel = new CSS2DObject(moonquakeLabelDiv);
	// moonquakeLabel.visible = false;
	// moonquakeLabel.position.x = -20;
	// moonquakeLabel.position.y = 10;

	// TEXT
	moonquakeTextDiv = document.createElement("div");
	moonquakeTextDiv.className = "moonquakeText";
	moonquakeText = new CSS2DObject(moonquakeTextDiv);
	moonquakeText.visible = false;
	moonquakeText.position.x = -22;
	moonquakeText.position.y = -3;
	uiScene.add(moonquakeText);

	// IMAGE
	moonquakeImgDiv = document.createElement("img");
	moonquakeImgDiv.className = "moonquakeImg";
	moonquakeImg = new CSS2DObject(moonquakeImgDiv);
	moonquakeImg.visible = false;
	moonquakeImg.position.x = -17.5;
	moonquakeImg.position.y = -17;
	uiScene.add(moonquakeImg);

	// BOTH
	// moonquakeLabelDiv.appendChild(moonquakeImgDiv);
	// moonquakeLabelDiv.appendChild(moonquakeTextDiv);
	// uiScene.add(moonquakeLabel);
	// document.getElementById("info").appendChild();
};

const createLayerLabel = () => {
	coreLabelDiv = document.createElement("div");
	coreLabelDiv.className = "coreLabel";

	coreLabel = new CSS2DObject(coreLabelDiv);
	coreLabel.visible = false;

	scene.add(coreLabel);
};
//////////////////////////////////////////////

//////////////////// ANIMATE ////////////////////
function animate() {
	requestAnimationFrame(animate);
	moon.rotation.y += moonFolder.__controllers[6].getValue() / 100;
	camera.fov = cameraFolder.__controllers[0].getValue();

	controls.update();
	camera.updateProjectionMatrix();

	// Calculate pointer intersection with data point
	raycaster.setFromCamera(pointer, camera);

	// FOR MOONQUAKE LABEL
	var shallowHovered, deepHovered, meteoriteHovered, modulesHovered;
	if (shallow.visible == true) {
		[shallowHovered] = raycaster.intersectObjects(shallow.children);
	} else if (deep.visible == true) {
		[deepHovered] = raycaster.intersectObjects(deep.children);
	} else if (meteorite.visible == true) {
		[meteoriteHovered] = raycaster.intersectObjects(meteorite.children);
	} else if (modules.visible == true) {
		[modulesHovered] = raycaster.intersectObjects(modules.children);
	}

	const moonquakesHovered = shallowHovered || deepHovered || meteoriteHovered || modulesHovered;
	if (moonquakesHovered) {
		renderer.domElement.className = "moonquakeHover";
		moonquakeText.visible = true;
		moonquakeTextDiv.textContent = moonquakesHovered.object.name;

		if (shallowHovered) {
			moonquakeImg.visible = true;
		}
		console.log(moonquakesHovered.object);
	} else {
		// Reset label
		renderer.domElement.className = "";
		moonquakeText.visible = false;
		moonquakeImg.visible = false;
		moonquakeTextDiv.textContent = "";
	}

	// FOR CORES
	if (moon.visible == false) {
		var [coresHovered] = raycaster.intersectObjects(layers.children);
		if (coresHovered) {
			coreLabel.visible = true;
			coreLabelDiv.textContent = coresHovered.object.name;
			console.log(coresHovered.object);
			// Get offset from object's dimensions
			const offset = new THREE.Vector3();
			new THREE.Box3().setFromObject(coresHovered.object).getSize(offset);

			if (coresHovered.object === crustLayer) {
				crustLayer.material.color.set(0x979699);
				// Move coreLabel over hovered core element
				coreLabel.position.set(coresHovered.object.position.x, coresHovered.object.position.y + 10, coresHovered.object.position.z);
			} else {
				crustLayer.material.color.set(crustLayer.userData.originalColor);
			}

			if (coresHovered.object === mantleLayer) {
				mantleLayer.material.color.set(0xcccccb);
				// Move coreLabel over hovered core element
				coreLabel.position.set(coresHovered.object.position.x, coresHovered.object.position.y + 8, coresHovered.object.position.z);
			} else {
				mantleLayer.material.color.set(mantleLayer.userData.originalColor);
			}

			if (coresHovered.object === partialMeltLayer) {
				partialMeltLayer.material.color.set(0xef3f33);
				// Move coreLabel over hovered core element
				coreLabel.position.set(coresHovered.object.position.x, coresHovered.object.position.y + 7, coresHovered.object.position.z);
			} else {
				partialMeltLayer.material.color.set(partialMeltLayer.userData.originalColor);
			}

			if (coresHovered.object === outerCoreLayer) {
				outerCoreLayer.material.color.set(0xf37321);
				// Move coreLabel over hovered core element
				coreLabel.position.set(coresHovered.object.position.x, coresHovered.object.position.y + 6, coresHovered.object.position.z);
			} else {
				outerCoreLayer.material.color.set(outerCoreLayer.userData.originalColor);
			}

			if (coresHovered.object === innerCoreLayer) {
				innerCoreLayer.material.color.set(0xf4c223);
				// Move coreLabel over hovered core element
				coreLabel.position.set(coresHovered.object.position.x, coresHovered.object.position.y + 5, coresHovered.object.position.z);
			} else {
				innerCoreLayer.material.color.set(innerCoreLayer.userData.originalColor);
			}
		} else {
			crustLayer.material.color.set(crustLayer.userData.originalColor);
			mantleLayer.material.color.set(mantleLayer.userData.originalColor);
			outerCoreLayer.material.color.set(outerCoreLayer.userData.originalColor);
			innerCoreLayer.material.color.set(innerCoreLayer.userData.originalColor);

			renderer.domElement.className = "";
			coreLabel.visible = false;
			coreLabelDiv.textContent = "";
		}
	}

	// FOR TORUS RINGS
	for (var i = 0; i < sm_tori.children.length; i++) {
		sm_tori.children[i].scale.setScalar(magScale);
		if (magScale <= 1) {
			sm_tori.children[i].material.color.set(0xd60000);
		} else if (magScale <= 1.2) {
			sm_tori.children[i].material.color.set(0xd61000);
		} else if (magScale <= 1.4) {
			sm_tori.children[i].material.color.set(0xd62000);
		} else if (magScale <= 1.6) {
			sm_tori.children[i].material.color.set(0xd63000);
		} else if (magScale <= 1.8) {
			sm_tori.children[i].material.color.set(0xd64000);
		} else if (magScale <= 2) {
			sm_tori.children[i].material.color.set(0xd65000);
		} else if (magScale <= 2.2) {
			sm_tori.children[i].material.color.set(0xd66000);
		} else if (magScale <= 2.4) {
			sm_tori.children[i].material.color.set(0xd67600);
		} else if (magScale <= 2.6) {
			sm_tori.children[i].material.color.set(0xd68600);
		} else if (magScale <= 2.8) {
			sm_tori.children[i].material.color.set(0xd69600);
		} else if (magScale <= 3) {
			sm_tori.children[i].material.color.set(0xd6a600);
		} else if (magScale <= 3.2) {
			sm_tori.children[i].material.color.set(0xd6b600);
		} else if (magScale <= 3.4) {
			sm_tori.children[i].material.color.set(0xd6c600);
		} else {
			sm_tori.children[i].material.color.set(0xd6d600);
		}
		magScale += 0.0005;
		if (magScale >= 4.3) {
			magScale = 0.1;
		}
	}

	// FOR WAVEFORM
	var currentYear = dateFolder.__controllers[0].getValue();
	if (defaultYear != currentYear) {
		defaultYear = dateFolder.__controllers[0].getValue();
		dateFolder.remove(dateFolder.__controllers[1]);

		if (dateFolder.__controllers[0].getValue() == "All") {
			days = {};

			for (var i = 0; i < sm_day_grp.length; i++) {
				days[sm_day_grp[i]] = sm_day_grp[i];
			}

			dateFolder.add(list2, "Days", days);
		} else {
			days = {};

			for (var i = 0; i < sm_day_grp.length; i++) {
				if (sm1979[i].Year == dateFolder.__controllers[0].getValue()) {
					days[sm_day_grp[i]] = sm_day_grp[i];
				}
			}

			dateFolder.add(list2, "Days", days);
		}
	}

	currentDay = dateFolder.__controllers[1].getValue();
	if (defaultDay != currentDay) {
		defaultDay = currentDay;
		console.log("checked");
		createWaveform();
	}

	if (mixer) {
		mixer.update(0.01); // Update the animation mixer
	}

	// Render scene
	renderer.clear();
	renderer.render(scene, camera);
	renderer.render(uiScene, orthoCamera);

	// Render labels
	labelRenderer.render(uiScene, orthoCamera);
}

function MoonThree() {
	const refContainer = useRef(null);
	useEffect(() => {
		main();
	}, []);
	return (
		<>
			<div id="loadingScreen">
				<div className="center">
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
					<div className="wave"></div>
				</div>
			</div>

			<div id="main">
				<canvas id="canvas"></canvas>
				<div ref={refContainer} />
			</div>

			<div id="info"></div>

			<a className="backbutton" href="/">
				Back
			</a>
		</>
	);
}

export default MoonThree;
