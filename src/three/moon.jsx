import { useEffect, useRef } from "react";

import "../index.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
// import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
// import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Lut } from "three/addons/math/Lut.js";
import { GUI } from "./dat.gui.module.js"; // Import GUI module

// assert { type: "json" }
import sm1979 from "../assets/nakamura_1979_sm_locations.json";
import dm2005 from "../assets/nakamura_2005_dm_locations.json";
import mm2003 from "../assets/lognonne_2003_meteorite_locations.json";
import lm1983 from "../assets/nakamura_1983_ai_locations.json";

import bays from "../assets/locations/Bays.json";
import lakes from "../assets/locations/Lakes.json";
import mountainrange from "../assets/locations/Mountain_Range.json";
import mountains from "../assets/locations/Mountains.json";
import seas from "../assets/locations/Seas.json";
import valleys from "../assets/locations/Valleys.json";
import craters from "../assets/locations/Craters.json";

function MoonThree() {
	const refContainer = useRef(null);
	useEffect(() => {
		function onPointerMove(event) {
			// calculate pointer position in normalized device coordinates
			// (-1 to +1) for both components
			event.preventDefault();

			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		}

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

		// LATITUDE & LONGITUDE TO SPHERICAL COORDINATES
		function toCartesian(lat, lon) {
			const radius = 15;
			var phi = (90 - lat) * (Math.PI / 180);
			var theta = (lon + 180) * (Math.PI / 180);

			var x = -(radius * Math.sin(phi) * Math.cos(theta));
			var z = radius * Math.sin(phi) * Math.sin(theta);
			var y = radius * Math.cos(phi);

			return new THREE.Vector3(x, y, z);
		}

		// ROTATE LATITUDE AND LONGITUDE BY ANGLE
		function rotateLatLon(lat, lon, angle = 0, radius = 15) {
			var phi = (90 - lat) * (Math.PI / 180);
			var theta = (lon + 180 + angle) * (Math.PI / 180);

			var x = -(radius * Math.sin(phi) * Math.cos(theta));
			var z = radius * Math.sin(phi) * Math.sin(theta);
			var y = radius * Math.cos(phi);

			return new THREE.Vector3(x, y, z);
		}

		// DEFINING SCENE, CAMERA, AND RENDERER
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
		camera.position.setZ(30);

		const uiScene = new THREE.Scene();
		const orthoCamera = new THREE.OrthographicCamera(-25, 25, 25, -25, 1, 50);
		orthoCamera.position.setZ(30);

		const renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector("#canvas"),
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
		controls.minDistance = 16;
		controls.maxDistance = 200;

		// DEFINE ASPECT RATIO - Taking the device's window size as default
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
		renderer.render(uiScene, orthoCamera);
		controls.saveState(); // To save starting point for 'Reset Camera' option in GUI

		// CREATE WAVEFORM
		let mixer;
		const glbLoader = new GLTFLoader();

		const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();

		const labelRenderer = new CSS2DRenderer();
		labelRenderer.setSize(innerWidth, innerHeight);
		labelRenderer.domElement.style.position = "absolute";
		labelRenderer.domElement.style.top = "0px";
		labelRenderer.domElement.style.pointerEvents = "none";
		document.body.appendChild(labelRenderer.domElement);
		window.addEventListener("pointermove", onPointerMove);

		// COLOR BAR
		const lut = new Lut("rainbow", 512);
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
		// uiScene.add(colorbar);

		// SUN GEOMETRY - Creating the Sun geometry
		const sunGeometry = new THREE.SphereGeometry(10, 32, 32).rotateY(Math.PI);
		const sunMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/maps/sun.jpg"),
			transparent: true,
			emissive: 0xffffff,
			emissiveIntensity: 0.75,
		});

		const sun = new THREE.Mesh(sunGeometry, sunMaterial);
		sun.position.set(200, 10, 200);
		scene.add(sun);

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
		pointLight.position.set(50, 10, 50);
		scene.add(pointLight);

		const ambientLight = new THREE.AmbientLight(0x282828);
		scene.add(ambientLight);

		// const lightHelper = new THREE.PointLightHelper(pointLight);
		// const gridHelper = new THREE.GridHelper(200, 50)
		// scene.add(lightHelper, gridHelper)
		// const axesHelper = new THREE.AxesHelper(30);
		// scene.add(axesHelper);
		// light rotation object
		const lvs = new THREE.Mesh(new THREE.SphereGeometry(5, 3, 2), new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }));
		scene.add(lvs);
		lvs.add(pointLight, sun);

		// MOON GEOMETRY - Consists of a map of the surface with a bumpMap on top to emphasize depth
		const moonGeometry = new THREE.SphereGeometry(15, 100, 100, -Math.PI / 2);
		const moonMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/maps/moon.jpg"),
		});

		moonMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
		moonMaterial.bumpScale = 0.025;

		const moon = new THREE.Mesh(moonGeometry, moonMaterial);
		// moon.rotation.z = 0.05; // Moon's oblique tilt
		scene.add(moon);

		// TOPOGRAPHY - Elevation map
		const topographyGeometry = new THREE.SphereGeometry(15.004, 100, 100, Math.PI / 2);
		const topographyMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/colormaps/topography.jpg"),
		});
		topographyMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
		topographyMaterial.bumpScale = 0.03;

		const topography = new THREE.Mesh(topographyGeometry, topographyMaterial);
		topography.visible = false;
		scene.add(topography);
		moon.add(topography);

		// MOON LAYERS - CRUST, MANTLE, OUTER CORE, INNER CORE
		var layers_group = new THREE.Group();
		///// HALF MOON
		const halfMoonGeometry = new THREE.SphereGeometry(14.99, 100, 100, 0, Math.PI);
		const halfMoonMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/maps/moonhalf.jpg"),
			side: THREE.DoubleSide,
		});
		halfMoonMaterial.bumpMap = textureLoader.load("/maps/moon16half.jpg");
		halfMoonMaterial.bumpScale = 0.025;
		const halfMoon = new THREE.Mesh(halfMoonGeometry, halfMoonMaterial);
		// layers_group.add(halfMoon);
		scene.add(halfMoon);

		///// CRUST LAYER
		const crustLayerGeometry = new THREE.CircleGeometry(15, 100);
		const crustLayerMaterial = new THREE.MeshStandardMaterial({
			color: 0x666566,
			side: THREE.DoubleSide,
		});
		const crustLayer = new THREE.Mesh(crustLayerGeometry, crustLayerMaterial);
		crustLayer.userData.originalColor = 0x666566;
		crustLayer.translateZ(-0.01);
		crustLayer.name = "Crust (52 km)";
		layers_group.add(crustLayer);
		// scene.add(crustLayer);

		///// MANTLE LAYER
		const mantleLayerGeometry = new THREE.CircleGeometry(15 - 0.45, 100);
		const mantleLayerMaterial = new THREE.MeshStandardMaterial({
			color: 0x7f7f7f,
			side: THREE.DoubleSide,
		});
		const mantleLayer = new THREE.Mesh(mantleLayerGeometry, mantleLayerMaterial);
		mantleLayer.userData.originalColor = 0x7f7f7f;
		mantleLayer.translateZ(-0.02);
		mantleLayer.name = "Mantle (1205 km)";
		layers_group.add(mantleLayer);
		// scene.add(mantleLayer);

		///// PARTIAL MELT LAYER
		const partialMeltLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4, 100);
		const partialMeltLayerMaterial = new THREE.MeshStandardMaterial({
			color: 0xa62825,
			side: THREE.DoubleSide,
		});
		const partialMeltLayer = new THREE.Mesh(partialMeltLayerGeometry, partialMeltLayerMaterial);
		partialMeltLayer.userData.originalColor = 0xa62825;
		partialMeltLayer.translateZ(-0.03);
		partialMeltLayer.name = "Partial Melt (150 km)";
		layers_group.add(partialMeltLayer);
		// scene.add(mantleLayer);

		///// OUTER CORE LAYER
		const outerCoreLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4 - 1.3, 100);
		const outerCoreLayerMaterial = new THREE.MeshStandardMaterial({
			color: 0xa54c24,
			side: THREE.DoubleSide,
		});
		const outerCoreLayer = new THREE.Mesh(outerCoreLayerGeometry, outerCoreLayerMaterial);
		outerCoreLayer.userData.originalColor = 0xa54c24;
		outerCoreLayer.translateZ(-0.04);
		outerCoreLayer.name = "Outer Core (90 km)";
		layers_group.add(outerCoreLayer);
		// scene.add(outerCoreLayer);

		///// INNER CORE LAYER
		const innerCoreLayerGeometry = new THREE.CircleGeometry(15 - 0.45 - 10.4 - 1.3 - 0.78, 100);
		const innerCoreLayerMaterial = new THREE.MeshStandardMaterial({
			color: 0xa4812e,
			side: THREE.DoubleSide,
		});
		const innerCoreLayer = new THREE.Mesh(innerCoreLayerGeometry, innerCoreLayerMaterial);
		innerCoreLayer.userData.originalColor = 0xa4812e;
		innerCoreLayer.translateZ(-0.05);
		innerCoreLayer.name = "Inner Core (240 km)";
		layers_group.add(innerCoreLayer);
		// scene.add(innerCoreLayer);

		///// LIGHT ON CORES
		const layersLight = new THREE.PointLight(0xffffff, 1);
		layersLight.position.set(0, 10, -20);
		layers_group.add(layersLight);
		// const lightHelper = new THREE.PointLightHelper(coreLight);
		// scene.add(lightHelper);

		scene.add(layers_group);
		layers_group.visible = false;

		// SURFACE ROUGHESS MAP - Hurst Exponent
		const roughnessHEGeometry = new THREE.SphereGeometry(15.008, 100, 100, -Math.PI / 2);
		const roughnessHEMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/colormaps/heatmapHE.png"),
		});
		// roughnessHEMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
		// roughnessHEMaterial.bumpScale = 0.03;

		const roughnessHE = new THREE.Mesh(roughnessHEGeometry, roughnessHEMaterial);
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

		const roughnessMAS = new THREE.Mesh(roughnessMASGeometry, roughnessMASMaterial);
		roughnessMAS.visible = false;
		scene.add(roughnessMAS);
		moon.add(roughnessMAS);

		// GRAVITY MAP - Free-Air
		const gravityFAGeometry = new THREE.SphereGeometry(15.016, 100, 100, -Math.PI / 2);
		const gravityFAMaterial = new THREE.MeshStandardMaterial({
			map: textureLoader.load("/colormaps/gravityFA.jpg"),
		});
		// gravityFAMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
		// gravityFAMaterial.bumpScale = 0.03;

		const gravityFA = new THREE.Mesh(gravityFAGeometry, gravityFAMaterial);
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

		const gravityB = new THREE.Mesh(gravityBGeometry, gravityBMaterial);
		gravityB.visible = false;
		scene.add(gravityB);
		moon.add(gravityB);

		// // UNIFIED MAP - Unified Geologic Map of The Moon
		// const unifiedGeometry = new THREE.SphereGeometry(15.004, 100, 100, Math.PI / 2);
		// const unifiedMaterial = new THREE.MeshStandardMaterial({
		// 	map: textureLoader.load("/colormaps/unified.jpg"),
		// });
		// unifiedMaterial.bumpMap = textureLoader.load("/maps/moon16.jpg");
		// unifiedMaterial.bumpScale = 0.03;

		// const unified = new THREE.Mesh(unifiedGeometry, unifiedMaterial);
		// unified.visible = false;
		// scene.add(unified);
		// moon.add(unified);

		// DATA POINTS IN GROUPS - Add each data point to a group to be used to enable/disable on the Moon's surface
		///// SHALLOW MOONQUAKE DATA
		var sm1979_group = new THREE.Group();
		var sm1979_torus_group = new THREE.Group();
		var magScale = 0.1;
		let sm_day_grp = [];
		for (var i = 0; i < sm1979.length; i++) {
			var sm_year = sm1979[i].Year;
			var sm_day = sm1979[i].Day;
			var sm_hour = sm1979[i].H;
			var sm_min = sm1979[i].M;
			var sm_sec = sm1979[i].S;
			var sm_latitude = sm1979[i].Lat;
			var sm_longitude = sm1979[i].Long;
			var sm_magnitude = sm1979[i].Magnitude;

			var sm_cartesian = rotateLatLon(sm_latitude, sm_longitude, -90);
			var sm_mesh = new THREE.Mesh(new THREE.SphereGeometry(sm_magnitude / 12, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

			sm_mesh.position.set(sm_cartesian.x, sm_cartesian.y, sm_cartesian.z);
			// sm_mesh.name = [sm_year, sm_day, sm_hour, sm_min, sm_sec, sm_latitude, sm_longitude, sm_magnitude];
			sm_mesh.name =
				"Year: " +
				sm_year +
				"\r\nDay: " +
				sm_day +
				"\r\nHour: " +
				sm_hour +
				"\r\nMin: " +
				sm_min +
				"\r\nSec: " +
				sm_sec +
				"\r\nLat: " +
				sm_latitude +
				"\r\nLon: " +
				sm_longitude +
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
			sm1979_group.add(sm_mesh);

			var radius_sm = sm_magnitude / 12;
			var sm_torus = new THREE.Mesh(new THREE.TorusGeometry(radius_sm, 0.01, 100, 100), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
			sm_torus.position.set(sm_cartesian.x, sm_cartesian.y, sm_cartesian.z);
			sm_torus.lookAt(0, 0, 0);
			sm_torus.userData = sm_year;

			sm1979_torus_group.add(sm_torus);
		}

		sm1979_group.add(sm1979_torus_group);
		sm1979_group.visible = false;
		moon.add(sm1979_group);
		// scene.add(sm1979_group);
		// scene.add(sm1979_torus_group);

		///// DEEP MOONQUAKE DATA
		var dm2005_group = new THREE.Group();
		for (var i = 0; i < dm2005.length; i++) {
			var dm_cartesian = rotateLatLon(dm2005[i].Lat, dm2005[i].Long, -90);
			var dm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xfff000 }));
			dm_mesh.position.set(dm_cartesian.x, dm_cartesian.y, dm_cartesian.z);
			dm2005_group.add(dm_mesh);
		}
		dm2005_group.visible = false;
		scene.add(dm2005_group);
		moon.add(dm2005_group);

		///// METEORITE MOONQUAKE DATA
		var mm2003_group = new THREE.Group();
		for (var i = 0; i < mm2003.length; i++) {
			var mm_cartesian = rotateLatLon(mm2003[i].Lat, mm2003[i].Long, 90);
			var mm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0066ff }));
			mm_mesh.position.set(mm_cartesian.x, mm_cartesian.y, mm_cartesian.z);
			mm2003_group.add(mm_mesh);
		}
		mm2003_group.visible = false;
		scene.add(mm2003_group);
		moon.add(mm2003_group);

		///// LUNAR MODULE DATA
		var lm1983_group = new THREE.Group();
		for (var i = 0; i < lm1983.length; i++) {
			var lm_cartesian = rotateLatLon(lm1983[i].Lat, lm1983[i].Long, -90);
			var lm_mesh = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 20), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
			lm_mesh.position.set(lm_cartesian.x, lm_cartesian.y, lm_cartesian.z);
			lm1983_group.add(lm_mesh);
		}

		var lunarmodules = new THREE.Group();
		glbLoader.load("/3d/lunar_module.glb", function (gltf) {
			for (var i = 0; i < lm1983_group.children.length; i++) {
				const object = gltf.scene.clone();

				object.position.set(lm1983_group.children[i].position.x, lm1983_group.children[i].position.y, lm1983_group.children[i].position.z);
				object.scale.set(0.1, 0.1, 0.1);
				object.lookAt(0, 0, 0);
				// object.rotation.z = Math.PI/2;

				// object.traverse((child) => {
				// 	if (child instanceof THREE.Mesh) {
				// 		child.material.emissiveIntensity = 2;
				// 		console.log(child.material);
				// 		child.castShadow = true;
				// 		child.receiveShadow = true;
				// 	}
				// });

				lunarmodules.add(object);
			}
		});

		lm1983_group.visible = false;
		lm1983_group.add(lunarmodules);
		scene.add(lm1983_group);
		moon.add(lm1983_group);

		// LUNAR BAYS, CRATERS, LAKES, MOUNTAIN RANGE, MOUNTAINS, SEAS, VALLEYS
		///// LUNAR BAYS
		var bays_group = new THREE.Group();
		for (var i = 0; i < bays.length; i++) {
			var bays_cartesian = rotateLatLon(bays[i].Lat, bays[i].Long, -90, 15.4);
			// var bays_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.75 })
			// );

			// bays_mesh.position.set(bays_cartesian.x, bays_cartesian.y, bays_cartesian.z);
			// bays_group.add(bays_mesh);

			var bays_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarBays.png"),
				})
			);
			bays_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			bays_icon.position.set(bays_cartesian.x, bays_cartesian.y, bays_cartesian.z);
			bays_group.add(bays_icon);
		}
		bays_group.visible = false;
		scene.add(bays_group);
		moon.add(bays_group);

		///// LUNAR CRATERS
		var craters_group = new THREE.Group();
		for (var i = 0; i < craters.length; i++) {
			var craters_cartesian = rotateLatLon(craters[i].Lat, craters[i].Long, -90, 15.4);
			// var craters_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.75 })
			// );
			// craters_mesh.position.set(craters_cartesian.x, craters_cartesian.y, craters_cartesian.z);
			// craters_group.add(craters_mesh);

			var craters_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarCraters.png"),
				})
			);
			craters_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			craters_icon.position.set(craters_cartesian.x, craters_cartesian.y, craters_cartesian.z);
			craters_group.add(craters_icon);
		}
		craters_group.visible = false;
		scene.add(craters_group);
		moon.add(craters_group);

		///// LUNAR LAKES
		var lakes_group = new THREE.Group();
		for (var i = 0; i < lakes.length; i++) {
			var lakes_cartesian = rotateLatLon(lakes[i].Lat, lakes[i].Long, -90, 15.4);
			// var lakes_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0x0ff000, transparent: true, opacity: 0.75 })
			// );
			// lakes_mesh.position.set(lakes_cartesian.x, lakes_cartesian.y, lakes_cartesian.z);
			// lakes_group.add(lakes_mesh);

			var lakes_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarLakes.png"),
				})
			);
			lakes_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			lakes_icon.position.set(lakes_cartesian.x, lakes_cartesian.y, lakes_cartesian.z);
			lakes_group.add(lakes_icon);
		}
		lakes_group.visible = false;
		scene.add(lakes_group);
		moon.add(lakes_group);

		// ///// LUNAR MOUNTAIN RANGE
		// var mountainrange_group = new THREE.Group();
		// for (var i = 0; i < mountainrange.length; i++) {
		// 	var mountainrange_cartesian = rotateLatLon(mountainrange[i].Lat, mountainrange[i].Long, -90, 15.4);
		// 	var mountainrange_mesh = new THREE.Mesh(
		// 		new THREE.SphereGeometry(0.1, 20, 20),
		// 		new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.75  })
		// 	);
		// 	mountainrange_mesh.position.set(mountainrange_cartesian.x, mountainrange_cartesian.y, mountainrange_cartesian.z);
		// 	mountainrange_group.add(mountainrange_mesh);
		// }
		// mountainrange_group.visible = false;
		// scene.add(mountainrange_group);
		// moon.add(mountainrange_group);

		///// LUNAR MOUNTAINS
		var mountains_group = new THREE.Group();
		for (var i = 0; i < mountains.length; i++) {
			var mountains_cartesian = rotateLatLon(mountains[i].Lat, mountains[i].Long, -90, 15.4);
			// var mountains_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0x00ffe9, transparent: true, opacity: 0.75 })
			// );
			// mountains_mesh.position.set(mountains_cartesian.x, mountains_cartesian.y, mountains_cartesian.z);
			// mountains_group.add(mountains_mesh);

			var mountains_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarMountains.png"),
				})
			);
			mountains_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			mountains_icon.position.set(mountains_cartesian.x, mountains_cartesian.y, mountains_cartesian.z);
			mountains_group.add(mountains_icon);
		}
		mountains_group.visible = false;
		scene.add(mountains_group);
		moon.add(mountains_group);

		///// LUNAR SEAS
		var seas_group = new THREE.Group();
		for (var i = 0; i < seas.length; i++) {
			var seas_cartesian = rotateLatLon(seas[i].Lat, seas[i].Long, -90, 15.4);
			// var seas_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0x000fff, transparent: true, opacity: 0.75 })
			// );
			// seas_mesh.position.set(seas_cartesian.x, seas_cartesian.y, seas_cartesian.z);
			// seas_group.add(seas_mesh);

			var seas_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarSeas.png"),
				})
			);
			seas_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			seas_icon.position.set(seas_cartesian.x, seas_cartesian.y, seas_cartesian.z);
			seas_group.add(seas_icon);
		}
		seas_group.visible = false;
		scene.add(seas_group);
		moon.add(seas_group);

		///// LUNAR VALLEYS
		var valleys_group = new THREE.Group();
		for (var i = 0; i < valleys.length; i++) {
			var valleys_cartesian = rotateLatLon(valleys[i].Lat, valleys[i].Long, -90, 15.4);
			// var valleys_mesh = new THREE.Mesh(
			// 	new THREE.SphereGeometry(0.1, 20, 20),
			// 	new THREE.MeshBasicMaterial({ color: 0xf000ff, transparent: true, opacity: 0.75 })
			// );
			// valleys_mesh.position.set(valleys_cartesian.x, valleys_cartesian.y, valleys_cartesian.z);
			// valleys_group.add(valleys_mesh);

			var valleys_icon = new THREE.Sprite(
				new THREE.SpriteMaterial({
					map: textureLoader.load("/icons/LunarValleys.png"),
				})
			);
			valleys_icon.material.map.colorSpace = THREE.SRGBColorSpace;

			valleys_icon.position.set(valleys_cartesian.x, valleys_cartesian.y, valleys_cartesian.z);
			valleys_group.add(valleys_icon);
		}
		valleys_group.visible = false;
		scene.add(valleys_group);
		moon.add(valleys_group);

		// GRAPHICAL USER INTERFACE
		const gui = new GUI({ width: 400 });

		let quakeFolder = gui.addFolder("Moonquake Options");
		let moonFolder = gui.addFolder("Moon Options");
		let locationsFolder = gui.addFolder("Moon Locations");
		let lightFolder = gui.addFolder("Light Options");
		let cameraFolder = gui.addFolder("Camera Options");
		let dateFolder = gui.addFolder("Date & Time Options");
		// let temporalFolder = gui.addFolder("Date & Time Options");

		// MOONQUAKE FOLDER
		quakeFolder.add(sm1979_group, "visible").name("Shallow Moonquakes");
		quakeFolder.add(dm2005_group, "visible").name("Deep Moonquakes");
		quakeFolder.add(mm2003_group, "visible").name("Meteorite Moonquakes");
		quakeFolder.add(lm1983_group, "visible").name("Lunar Modules");

		// MOON FOLDER
		moonFolder.add(topography, "visible").name("Topography Map");
		moonFolder.add(roughnessHE, "visible").name("Surface Roughness - Hurst Exponent");
		moonFolder.add(roughnessMAS, "visible").name("Surface Roughness - Median Absolute Slope");
		moonFolder.add(gravityFA, "visible").name("Gravity Map - Free-Air");
		moonFolder.add(gravityB, "visible").name("Gravity Map - Bougeur");
		// moonFolder.add(unified, "visible").name("Unified Map Visibility");
		moonFolder
			.add(layers_group, "visible")
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

		// LOCATIONS FOLDER
		locationsFolder.add(bays_group, "visible").name("Lunar Bays");
		locationsFolder.add(craters_group, "visible").name("Lunar Craters");
		locationsFolder.add(lakes_group, "visible").name("Lunar Lakes");
		// locationsFolder.add(mountainrange_group, "visible").name("Lunar Mountain Range");
		locationsFolder.add(mountains_group, "visible").name("Lunar Mountains");
		locationsFolder.add(seas_group, "visible").name("Lunar Seas");
		locationsFolder.add(valleys_group, "visible").name("Lunar Valleys");

		// LIGHT FOLDER
		lightFolder.add(pointLight, "intensity", 0, 2).name("Sunlight Intensity");
		lightFolder.add(lvs.rotation, "y", 0, 2 * Math.PI, 0.02).name("Sunlight Position");
		lightFolder.add(ambientLight, "intensity", 0, 6).name("Universal Intensity");
		var universalLightStatus = {
			toggleStatus: function () {
				if (pointLight.intensity != 0 || ambientLight.intensity != 5) {
					pointLight.intensity = 0;
					ambientLight.intensity = 5;
				} else {
					pointLight.intensity = 1;
					ambientLight.intensity = 1;
				}
			},
		};
		lightFolder.add(universalLightStatus, "toggleStatus").name("Disable Realistic Light");

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

		// DATE AND TIME FOLDER
		let years1 = { All: "All" };
		for (var i = 0; i < sm1979.length; i++) {
			years1[sm1979[i].Year] = sm1979[i].Year;
		}

		var Years = {
			Years: "years",
		};
		dateFolder.add(Years, "Years", years1);

		let days = {};
		for (var i = 0; i < sm_day_grp.length; i++) {
			days[sm_day_grp[i]] = sm_day_grp[i];
		}

		var list2 = {
			Days: "Day",
		};
		dateFolder.add(list2, "Days", days);

		var defaultYear = dateFolder.__controllers[0].getValue();
		var currentYear;

		var defaultDay = dateFolder.__controllers[1].getValue();
		var currentDay;
		const wave_check = new THREE.Group();

		// Tooltip Menu
		const moonquakeLabelDiv = document.createElement("div");
		moonquakeLabelDiv.className = "moonquakeLabel";
		const moonquakeLabel = new CSS2DObject(moonquakeLabelDiv);
		moonquakeLabel.visible = false;
		moonquakeLabel.position.x = -20;
		moonquakeLabel.position.y = 10;
		uiScene.add(moonquakeLabel);

		const coreLabelDiv = document.createElement("div");
		coreLabelDiv.className = "coreLabel";
		const coreLabel = new CSS2DObject(coreLabelDiv);
		coreLabel.visible = false;
		scene.add(coreLabel);

		// ANIMATE
		function animate() {
			requestAnimationFrame(animate);
			moon.rotation.y += moonFolder.__controllers[6].getValue() / 100;

			camera.fov = cameraFolder.__controllers[0].getValue();

			controls.update();
			camera.updateProjectionMatrix();

			// Calculate pointer intersection with data point
			raycaster.setFromCamera(pointer, camera);

			var sm1979Hovered, dm2005Hovered, mm2003Hovered, lm1983Hovered;
			if (sm1979_group.visible == true) {
				[sm1979Hovered] = raycaster.intersectObjects(sm1979_group.children);
			} else if (dm2005_group.visible == true) {
				[dm2005Hovered] = raycaster.intersectObjects(dm2005_group.children);
			} else if (dm2005_group.visible == true) {
				[mm2003Hovered] = raycaster.intersectObjects(mm2003_group.children);
			} else if (lm1983.visible == true) {
				[lm1983Hovered] = raycaster.intersectObjects(lm1983_group.children);
			}

			const moonquakesHovered = sm1979Hovered || dm2005Hovered || mm2003Hovered || lm1983Hovered;
			if (moonquakesHovered) {
				renderer.domElement.className = "moonquakesHovered";
				moonquakeLabel.visible = true;
				moonquakeLabelDiv.textContent = moonquakesHovered.object.name;
				console.log(moonquakesHovered.object);
				// // Get offset from object's dimensions
				// const offset = new THREE.Vector3();
				// new THREE.Box3().setFromObject(moonquakesHovered.object).getSize(offset);

				// // Move label over hovered moonquake element
				// moonquakeLabel.position.set(
				// 	moonquakesHovered.object.position.x,
				// 	moonquakesHovered.object.position.y + 2,
				// 	moonquakesHovered.object.position.z
				// );
			} else {
				// Reset label
				renderer.domElement.className = "";
				moonquakeLabel.visible = false;
				moonquakeLabelDiv.textContent = "";
			}

			if (moon.visible == false) {
				var [coresHovered] = raycaster.intersectObjects(layers_group.children);
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

			// if (moon.visible == false) {
			// 	var [intersects] = raycaster.intersectObjects(crustLayer);
			// 	if (intersects) {
			// 		console.log(intersects);
			// 		intersects.object.material.color.set(0xff4543);
			// 		console.log("hello");
			// 	} else {
			// 		crustLayerMaterial.color.set(0x628fff);
			// 	}
			// }

			for (var i = 0; i < sm1979_torus_group.children.length; i++) {
				sm1979_torus_group.children[i].scale.setScalar(magScale);
				if (magScale <= 1) {
					sm1979_torus_group.children[i].material.color.set(0xd60000);
				} else if (magScale <= 1.2) {
					sm1979_torus_group.children[i].material.color.set(0xd61000);
				} else if (magScale <= 1.4) {
					sm1979_torus_group.children[i].material.color.set(0xd62000);
				} else if (magScale <= 1.6) {
					sm1979_torus_group.children[i].material.color.set(0xd63000);
				} else if (magScale <= 1.8) {
					sm1979_torus_group.children[i].material.color.set(0xd64000);
				} else if (magScale <= 2) {
					sm1979_torus_group.children[i].material.color.set(0xd65000);
				} else if (magScale <= 2.2) {
					sm1979_torus_group.children[i].material.color.set(0xd66000);
				} else if (magScale <= 2.4) {
					sm1979_torus_group.children[i].material.color.set(0xd67600);
				} else if (magScale <= 2.6) {
					sm1979_torus_group.children[i].material.color.set(0xd68600);
				} else if (magScale <= 2.8) {
					sm1979_torus_group.children[i].material.color.set(0xd69600);
				} else if (magScale <= 3) {
					sm1979_torus_group.children[i].material.color.set(0xd6a600);
				} else if (magScale <= 3.2) {
					sm1979_torus_group.children[i].material.color.set(0xd6b600);
				} else if (magScale <= 3.4) {
					sm1979_torus_group.children[i].material.color.set(0xd6c600);
				} else {
					sm1979_torus_group.children[i].material.color.set(0xd6d600);
				}
				magScale += 0.0005;
				if (magScale >= 4.3) {
					magScale = 0.1;
				}
			}

			var currentYear = dateFolder.__controllers[0].getValue();
			if (defaultYear != currentYear) {
				defaultYear = dateFolder.__controllers[0].getValue();
				console.log("check");
				console.log(dateFolder.__controllers[0].getValue());
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
						console.log(sm1979[i].Year);
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
				glbLoader.load("/3d/wave.glb", function (gltf) {
					for (var i = 0; i < sm_day_grp.length; i++) {
						// console.log(i);
						if (sm_day_grp[i] == dateFolder.__controllers[1].getValue()) {
							console.log(dateFolder.__controllers[1].getValue());

							const object = gltf.scene;
							mixer = new THREE.AnimationMixer(object);
							const action = mixer.clipAction(gltf.animations[0]);
							action.play();
							wave_check.children[0] = object;
							object.position.set(
								sm1979_group.children[i].position.x,
								sm1979_group.children[i].position.y,
								sm1979_group.children[i].position.z
							);
							object.scale.set(sm1979[i].Magnitude / 2, sm1979[i].Magnitude / 2, sm1979[i].Magnitude / 2);
							object.up.set(0, 1, 0);
							object.lookAt(0, 0, 0);
							// camera.target.position.copy(object);
							camera.position.set(
								sm1979_group.children[i].position.x * 1.5,
								sm1979_group.children[i].position.y * 1.5,
								sm1979_group.children[i].position.z * 1.5
							);
						}
					}
				});
				scene.add(wave_check);
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
				<canvas id="canvas"></canvas>
				<div ref={refContainer} />
			</div>

			<a class="backbutton" href="/">
				Back
			</a>
		</>
	);
}

export default MoonThree;
