import { useEffect, useRef } from "react";

import "../index.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "./dat.gui.module.js"; // Import GUI module

let manager, textureLoader, glbLoader, renderer, scene, camera, controls, gui, mixer;
let bg, surface, center, pointLight, pointLight2, ambientLight, campos, campos2;
let quakeFolder, quakeState;

const main = () => {
	scene = new THREE.Scene();

	createManager();
	createRenderer();
	createCamera();
	createControls();

	window.addEventListener("resize", onWindowResize);

	///// UNIVERSE
	createBackground();
	createSurface();
	createLights();

	///// GUI
	gui = new GUI({ width: 400 });
	createQuakeFolder();

	// ANIMATE
	animate();
};

//////////////////// FUNCTIONS ////////////////////
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const render = () => {
	renderer.render(scene, camera);
};
///////////////////////////////////////////////////

const createManager = () => {
	manager = new THREE.LoadingManager();
	textureLoader = new THREE.TextureLoader(manager);
	glbLoader = new GLTFLoader(manager);

	manager.onLoad = function () {
		console.log("Loading complete!");
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
};

const createCamera = () => {
	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 20000;

	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 0, 30);
};

const createControls = () => {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 5;
	controls.maxDistance = 100;
	controls.maxPolarAngle = 0.45 * Math.PI;
	controls.saveState();
};

const createLights = () => {
	pointLight = new THREE.PointLight(0xffffff, 10000, 400);
	pointLight.position.set(50, 75, 0);
	// pointLight.target = center;
	scene.add(pointLight);

	pointLight2 = new THREE.PointLight(0xffffff, 10000, 400);
	pointLight2.position.set(-50, 50, -30);
	scene.add(pointLight2);

	// const lightHelper = new THREE.PointLightHelper(pointLight);
	// const lightHelper2 = new THREE.PointLightHelper(pointLight2);
	// scene.add(lightHelper, lightHelper2);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
};

//////////////////// MOON ////////////////////
const createBackground = () => {
	const bgGeometry = new THREE.SphereGeometry(10000, 100, 100);
	const bgMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/milkyway.jpg"),
		side: THREE.DoubleSide, // Texture shows on both sides of sphere
		transparent: true,
		opacity: 0.5,
	});

	bg = new THREE.Mesh(bgGeometry, bgMaterial);
	scene.add(bg);
};

const createSurface = () => {
	surface = new THREE.Group();

	center = new THREE.Mesh(new THREE.SphereGeometry(1, 3, 2), new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }));
	scene.add(center);

	glbLoader.load("/3d/lunar_module.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(7, 7, 7);
		object.position.set(-5, 2.3, 5);
		surface.add(object);
		scene.add(object);
	});

	// const pos_x = [0, 550, -550, 0, 0, 550, -550, 550, -550];
	// const pos_y = [7.3, 0, 0, 0, 0, 0, 0, 0, 0];
	// const pos_z = [0, 0, 0, 550, -550, -550, 550, 550, -550];

	// glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
	// 	for (var i = 0; i < pos_x.length; i++) {
	// 		const object = gltf.scene;
	// 		mixer = new THREE.AnimationMixer(object);
	// 		// const action = mixer.clipAction(gltf.animations[0]);
	// 		// action.play();
	// 		object.rotateX(Math.PI / 2);
	// 		object.scale.set(3, 3, 3);
	// 		object.position.set(pos_x[i], pos_y[i], pos_z[i]);
	// 		surface.add(object);
	// 		scene.add(object);
	// 	}
	// });

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(0, 7.3, 0);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(550, 0, 0);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(-550, 0, 0);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(0, 0, 550);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(0, 0, -550);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(550, 0, -550);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(-550, 0, 550);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(550, 0, 550);
		surface.add(object);
		scene.add(object);
	});

	glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
		const object = gltf.scene;
		mixer = new THREE.AnimationMixer(object);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		object.rotateX(Math.PI / 2);
		object.scale.set(3, 3, 3);
		object.position.set(-550, 0, -550);
		surface.add(object);
		scene.add(object);
	});

	console.log(surface);
};

const createQuakeFolder = () => {
	quakeFolder = gui.addFolder("Moonquake");

	quakeState = {
		state: false,
	};
	quakeFolder.add(quakeState, "state").name("Enable/Disable Moonquakes");
};

//////////////////// ANIMATE ////////////////////
function animate() {
	requestAnimationFrame(animate);

	controls.update();
	camera.updateProjectionMatrix();

	if (mixer) {
		mixer.update(0.01); // Update the animation mixer
	}

	if (quakeState["state"] == true) {
		campos2++;
		if (campos2 % 8 == 0) {
			campos++;
		}
		if (campos % 2 == 0) {
			camera.rotation.x += 0.003;
			camera.rotation.y += 0.003;
			camera.rotation.z += 0.003;
		} else {
			camera.rotation.x -= 0.003;
			camera.rotation.y -= 0.003;
			camera.rotation.z -= 0.003;
		}
	}

	// Render scene
	renderer.clear();
	renderer.render(scene, camera);
}

function QuakeThree() {
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
				<div ref={refContainer}></div>
			</div>

			<a className="backbutton" href="/">
				Back
			</a>
		</>
	);
}

export default QuakeThree;
