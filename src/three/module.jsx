import { useEffect, useRef } from "react";

import "../index.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let manager, textureLoader, renderer, scene, camera, controls, mixer;
let bg, module, pointLight, pointLight2, pointLight3, pointLight4, ambientLight;
let glbLoader = new GLTFLoader();

const main = () => {
	scene = new THREE.Scene();

	createManager();
	createRenderer();
	createCamera();
	createControls();

	window.addEventListener("resize", onWindowResize);

	///// UNIVERSE
	createBackground();
	createModule();
	createLights();

	// ANIMATE
	animate();
};

//////////////////// FUNCTIONS ////////////////////
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

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
	controls.maxDistance = 50;
	controls.saveState();
};

const createLights = () => {
	pointLight = new THREE.PointLight(0xffffff, 1000);
	pointLight.position.set(0, -30, 0);
	scene.add(pointLight);

	pointLight2 = new THREE.PointLight(0xffffff, 5000, 100);
	pointLight2.position.set(20, 30, 0);
	scene.add(pointLight2);

	pointLight3 = new THREE.PointLight(0xffffff, 5000, 100);
	pointLight3.position.set(-20, 30, 5);
	scene.add(pointLight3);

	pointLight4 = new THREE.PointLight(0xffffff, 5000, 100);
	pointLight4.position.set(-20, -50, 5);
	scene.add(pointLight4);

	ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	// const lightHelper2 = new THREE.PointLightHelper(pointLight2);
	// const lightHelper3 = new THREE.PointLightHelper(pointLight3);
	// const lightHelper4 = new THREE.PointLightHelper(pointLight4);
	// scene.add(lightHelper2, lightHelper3, lightHelper4);
};

//////////////////// MOON ////////////////////
const createBackground = () => {
	const bgGeometry = new THREE.SphereGeometry(10000, 100, 100);
	const bgMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("/maps/milkyway.jpg"),
		side: THREE.DoubleSide, // Texture shows on both sides of sphere
		transparent: true,
		opacity: 0.4,
	});

	bg = new THREE.Mesh(bgGeometry, bgMaterial);
	scene.add(bg);
};

const createModule = () => {
	glbLoader.load("/3d/lunar_module.glb", function (gltf) {
		module = gltf.scene;
		mixer = new THREE.AnimationMixer(module);
		// const action = mixer.clipAction(gltf.animations[0]);
		// action.play();
		module.rotateX(Math.PI / 2);
		module.position.x = -5;
		module.position.z = 5;
		module.scale.x = 5;
		module.scale.y = 5;
		module.scale.z = 5;
		scene.add(module);
	});
};

/////////////////// ANIMATION ////////////////////
function animate() {
	requestAnimationFrame(animate);

	controls.update();
	camera.updateProjectionMatrix();

	if (mixer) {
		mixer.update(0.01); // Update the animation mixer
	}

	// Render scene
	renderer.clear();
	renderer.render(scene, camera);
}

function ModuleThree() {
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

export default ModuleThree;
