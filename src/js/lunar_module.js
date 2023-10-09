import "../../public/style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// var TEXTURES_LOADED = false;
var manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);

manager.onLoad = function () {
	console.log("Loading complete!");
	// document.querySelector('#bg');
	// document.getElementById("bg").style.zIndex = 1000;
	// document.getElementById("portfolio-loader").remove();
	document.getElementById("loadingScreen").remove();
};

// DEFINING SCENE, CAMERA, AND RENDERER
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
	antialias: true,
});
renderer.autoClear = false;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

// ORBITAL CONTROLS - Allows user to use mouse to navigate the 3D scene within the boundaries of the environment
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
controls.maxDistance = 50;

// DEFINE ASPECT RATIO - Taking the device's window size as default
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);
controls.saveState(); // To save starting point for 'Reset Camera' option in GUI

// CREATE WAVEFORM
let mixer;
const glbLoader = new GLTFLoader();

glbLoader.load("/3d/lunar_module.glb", function (gltf) {
	const object = gltf.scene;
	mixer = new THREE.AnimationMixer(object);
	// const action = mixer.clipAction(gltf.animations[0]);
	// action.play();
	object.rotateX(Math.PI / 2);
	object.position.x = -5;
	object.position.z = 5;
	object.scale.x = 5;
	object.scale.y = 5;
	object.scale.z = 5;
	scene.add(object);
});

// MILKY WAY BACKGROUND - We have to simulate the universe, what better way to do it than with this background :)
const bgGeometry = new THREE.SphereGeometry(10000, 100, 100);
const bgMaterial = new THREE.MeshStandardMaterial({
	map: textureLoader.load("/maps/milkyway.jpg"),
	side: THREE.DoubleSide, // Texture shows on both sides of sphere
	transparent: true,
	opacity: 0.25,
});

const bg = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bg);

// LIGHTING - One that mimics the sun's light and another is ambient light in the universe for better user experience
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, -30, 0);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 5, 100);
pointLight2.position.set(20, 30, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 5, 100);
pointLight3.position.set(-20, 30, 5);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 5, 100);
pointLight4.position.set(-20, -50, 5);
scene.add(pointLight4);

const ambientLight = new THREE.AmbientLight(0x282828);
scene.add(ambientLight);

// const lightHelper2 = new THREE.PointLightHelper(pointLight2);
// const lightHelper3 = new THREE.PointLightHelper(pointLight3);
// const lightHelper4 = new THREE.PointLightHelper(pointLight4);
// scene.add(lightHelper2, lightHelper3, lightHelper4);

// ANIMATE
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

animate();
