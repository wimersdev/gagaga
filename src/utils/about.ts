import * as THREE from 'three';
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  'https://uploads-ssl.webflow.com/64b8d770b95f3502e5b9ae53/64c3da3dd93d4b910c58a0e5_about03.jpg'
);

export default function aboutSphere() {
  const geometry = new THREE.CircleGeometry(8, 32);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    blending: THREE.SubtractiveBlending,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = (Math.PI / 2) * -1;
  return mesh;
}
