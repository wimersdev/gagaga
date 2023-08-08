import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as dat from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

gsap.registerPlugin(ScrollTrigger); //Initialize scrollTrigger

console.clear(); //Clear console after reloading

// Debug
const gui = new dat.GUI();
gui.destroy(); //Remove GUI

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const galaxy = new THREE.Object3D();
scene.add(galaxy);

//Configure galaxy
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

//Galaxy Generator
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

//**GUI
const guiAdd = () => {
  gui.add(parameters, 'count').min(100).max(1000000).step(100).onChange(generateGalaxy);
  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
  gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
  gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
  gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
  gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
};
guiAdd();

//Canvas sizing
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

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.z = 200;
scene.add(camera);

//ROUTES
const circlesPoints = [
  {
    position: new THREE.Vector3(0, 0, 0),
    element: document.querySelector('.circle-0'),
  },
  {
    position: new THREE.Vector3(-3, 0, -3),
    element: document.querySelector('.circle-1'),
  },
  {
    position: new THREE.Vector3(2, 0, -2.5),
    element: document.querySelector('.circle-2'),
  },
  {
    position: new THREE.Vector3(-3.5, 0, 2.75),
    element: document.querySelector('.circle-3'),
  },
  {
    position: new THREE.Vector3(1.5, 0, 2),
    element: document.querySelector('.circle-4'),
  },
];

const routesIn = () => {
  circlesPoints.forEach((point) => {
    point.element?.classList.add('visible-circle'); // Removed '.' before 'visible'
  });
};
routesIn();

//Routes-internal page

//Fleet

//RENDER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//**GSAP ANIMATION */

//Control sections elements
const sections = [
  //{ section: 'loader', x: 0, y: 0, z: 200, r: 0 },
  { section: 'hero', x: 0, y: 0, z: 3, r: 0 },
  { section: 'route', x: -5, y: 10, z: 0, r: (Math.PI / 2) * -1 },
  { section: 'fleet', x: -8, y: 4, z: 16, r: (Math.PI / 16) * -1 },
  { section: 'testimonials', x: 0, y: 3, z: 6, r: 0 },
  { section: 'credits', x: 0, y: 2, z: 3, r: 0 },
];

//Get all contentHolders
const contentHolders = document.querySelectorAll('.content-holder');

//Main function sections content control and camera movement
const sectionMove = ({ section, x, y, z, r }) => {
  contentHolders.forEach((el) => el.classList.remove('visible'));
  gsap.to(camera.position, {
    x: x,
    y: y,
    z: z,
    duration: 3,
  });
  gsap.to(camera.rotation, {
    x: r,
    y: 0,
    z: 0,
    duration: 3,
  });
  console.log(`move to ${section}`);
};

let number = false;

//Page loader
const sectionCounter = (i, n) => {
  if (n) {
    contentHolders[i].classList.add('visible');
    console.log(contentHolders[i]);
  } else {
    setTimeout(function () {
      document.querySelectorAll('.navbar')[0].classList.add('visible');
      contentHolders[0].classList.add('visible');
    }, 3000);
    number = true;
  }
};

//Control Buttons
const navButtons = document.querySelectorAll('.nav-link');
const sectionTriggers = document.querySelectorAll('.section');

//Triggers enabling loading
for (let i = 0; i < navButtons.length; i++) {
  sectionTriggers[i].id = 'section' + i;
  ScrollTrigger.create({
    trigger: `#section${[i]}`,
    start: 'top 48%',
    end: 'bottom 48%',
    onToggle: (self) => [sectionMove(sections[i], i), sectionCounter(i, number)],
  });
  navButtons[i].addEventListener('click', function () {
    sectionMove(sections[i], i);
    location.href = `#${sectionTriggers[i].id}`;
  });
}

//*CONTROLS//
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

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
  for (const point of circlesPoints) {
    const screenPosition = point.position.clone();
    screenPosition.project(camera);

    const translateX = screenPosition.x * sizes.width * 0.5;
    const translateY = -screenPosition.y * sizes.height * 0.5;
    point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
