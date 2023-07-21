import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import aboutSphere from '$utils/about';

gsap.registerPlugin(ScrollTrigger);

console.clear();
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
//gui.destroy();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const galaxy = new THREE.Object3D();
scene.add(galaxy);

/**
 * Test cube
 */

const parameters = {
  count: 123000,
  size: 0.01,
  radius: 7,
  branches: 10,
  spin: -1.023,
  randomness: 2,
  randomnessPower: 6,
  insideColor: '#ff3300',
  outsideColor: '#0f57ff',
  opacity: 1,
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = (opacityValue) => {
  // Destroy old galaxy

  if (points !== null) {
    geometry.dispose();
    material.dispose();
    galaxy.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  //Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    opacity: opacityValue,
  });

  points = new THREE.Points(geometry, material);
  galaxy.add(points);
  console.log(points.material.opacity);
};

generateGalaxy(0.8);

gui.add(parameters, 'count').min(100).max(1000000).step(100).onChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.z = 200;

//camera.position.z = 3;
//camera.rotation.z = -1;
scene.add(camera);

//AboutObject
const about = aboutSphere();
console.log(about);
scene.add(about);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//**GSAP ANIMATION */

const rotAngle = Math.PI / 2;

const loaderMove = () => {
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 200,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 3,
  });
  console.log('move to loader(start position)');
};

const heroMove = () => {
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 3,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 3,
  });

  console.log('move to hero');
};

const aboutMove = () => {
  gsap.to(camera.position, {
    x: -10,
    y: 20,
    z: 0,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: (Math.PI / 2) * -1,
    y: 0,
    z: 0,
    duration: 3,
  });

  console.log('move to about ');
};

const routeMove = () => {
  gsap.to(camera.position, {
    x: -5,
    y: 10,
    z: 0,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: (Math.PI / 2) * -1,
    y: 0,
    z: 0,
    duration: 3,
  });

  console.log('move to routes');
};

const fleetMove = () => {
  gsap.to(camera.position, {
    x: -8,
    y: 5,
    z: 16,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: (Math.PI / 16) * -1,
    y: 0,
    z: 0,
    duration: 3,
  });
  console.log('move to fleet');
};

const testMove = () => {
  gsap.to(camera.position, {
    x: 0,
    y: 3,
    z: 6,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 3,
  });

  console.log('move to testimonials');
};

const credMove = () => {
  gsap.to(camera.position, {
    x: 0,
    y: 2,
    z: 3,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 3,
  });
  console.log('move to credits');
};

//Control Buttons
const loaderbtn = document.getElementById('loaderbtn').addEventListener('click', loaderMove);
const herobtn = document.getElementById('herobtn').addEventListener('click', heroMove);
const aboutbtn = document.getElementById('aboutbtn').addEventListener('click', aboutMove);
const routesbtn = document.getElementById('routesbtn').addEventListener('click', routeMove);
const fleetbtn = document.getElementById('fleetbtn').addEventListener('click', fleetMove);
const testbtn = document.getElementById('testbtn').addEventListener('click', testMove);
const credbtn = document.getElementById('credbtn').addEventListener('click', credMove);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Rotate galaxy
  galaxy.rotation.y += 0.00005;
  // Update controls
  //controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/*
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

*/
