import * as THREE from 'three';
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  'https://uploads-ssl.webflow.com/64b8d770b95f3502e5b9ae53/64ba9b30ebb7b01a0e145b9e_image-about.png'
);

export default function aboutSphere() {
  const geometry = new THREE.CircleGeometry(5, 32);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    blending: THREE.MultiplyBlending,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = (Math.PI / 2) * -1;
  return mesh;
}
