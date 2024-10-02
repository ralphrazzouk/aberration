import { useEffect, useRef } from "react";

import "../index.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "./dat.gui.module.js"; // Import GUI module

function QuakeThree() {
	const refContainer = useRef(null);
	useEffect(() => {
		// var TEXTURES_LOADED = false;
		var manager = new THREE.LoadingManager();
		const textureLoader = new THREE.TextureLoader(manager);
		const glbLoader = new GLTFLoader(manager);

		manager.onLoad = function () {
			console.log("Loading experience complete!");
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
		controls.maxDistance = 100;
		controls.maxPolarAngle = 0.45 * Math.PI;
		controls.saveState(); // To save starting point for 'Reset Camera' option in GUI

		// DEFINE ASPECT RATIO - Taking the device's window size as default
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.position.setZ(30);
		renderer.render(scene, camera);

		var quakeGroup = new THREE.Group();

		const gui = new GUI({ width: 400 });
		let quakeFolder = gui.addFolder("Moonquake");

		var quakeState = {
			state: false,
		};
		quakeFolder.add(quakeState, "state").name("Enable/Disable Moonquakes");

		let mixer;

		glbLoader.load("/3d/lunar_module.glb", function (gltf) {
			const object = gltf.scene;
			mixer = new THREE.AnimationMixer(object);
			// const action = mixer.clipAction(gltf.animations[0]);
			// action.play();
			object.rotateX(Math.PI / 2);
			object.scale.set(7, 7, 7);
			object.position.set(-5, 2.3, 5);
			quakeGroup.add(object);
			scene.add(object);
		});

		glbLoader.load("/3d/Lunar_Surface_2.glb", function (gltf) {
			const object = gltf.scene;
			mixer = new THREE.AnimationMixer(object);
			// const action = mixer.clipAction(gltf.animations[0]);
			// action.play();
			object.rotateX(Math.PI / 2);
			object.scale.set(3, 3, 3);
			object.position.set(0, 7.3, 0);
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
			quakeGroup.add(object);
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
		const pointLight = new THREE.PointLight(0xffffff, 1, 400);
		pointLight.position.set(50, 75, 0);
		scene.add(pointLight);

		const pointLight2 = new THREE.PointLight(0xffffff, 1, 400);
		pointLight2.position.set(-50, 50, -30);
		scene.add(pointLight2);

		// const lightHelper = new THREE.PointLightHelper(pointLight);
		// const lightHelper2 = new THREE.PointLightHelper(pointLight2);
		// scene.add(lightHelper, lightHelper2);

		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		console.log(quakeGroup);

		var campos = 0;
		var campos2 = 0;
		// ANIMATE
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
					// camera.position.x += Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
					// camera.position.y += Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
					// camera.position.z += Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
				} else {
					camera.rotation.x -= 0.003;
					camera.rotation.y -= 0.003;
					camera.rotation.z -= 0.003;
					// camera.position.set(60, 20, 30);
				}
				// var random1 = randFloat(-5, 5);
				// var random2 = randFloat(-5, 5);
				// var random3 = randFloat(-5, 5);
				// quakeGroup.position.x += Math.floor(random1 * (-0.5 - 0.5)) + 0.5;
				// quakeGroup.position.y += Math.floor(random2 * (-0.5 - 0.5)) + 0.5;
				// quakeGroup.position.z += Math.floor(random3 * (-0.5 - 0.5)) + 0.5;
				// if (random < 5) {
				//     console.log(random);
				// } else {
				//     quakeGroup.position.x -= Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
				//     quakeGroup.position.y -= Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
				//     quakeGroup.position.z -= Math.floor(Math.random() * (-0.5 - 0.5)) + 0.5;
				// }
			}

			// Render scene
			renderer.clear();
			renderer.render(scene, camera);
		}

		// var screenShake = ScreenShake();
		// function loop() {
		// 	requestAnimationFrame(loop);
		// 	screenShake.update(camera);
		// 	controls.update();
		// 	camera.updateProjectionMatrix();

		// 	renderer.clear();
		// 	renderer.render(scene, camera);

		// };

		// screenShake.shake( camera, new THREE.Vector3(0.1, 0, 0), 300 );

		animate();
	}, []);
	return (
		<>
			<div id="loadingScreen">
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
			</div>

			<div id="main">
				<canvas id="bg"></canvas>
				<div ref={refContainer}></div>
			</div>

			<a class="backbutton" href="/">
				Back
			</a>
		</>
	);
}

export default QuakeThree;
