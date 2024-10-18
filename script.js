const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 14;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x404040); // Luce soffusa
scene.add(ambientLight);
function createBowlingBall(radius, color, x, y, z) {
  const ballGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ 
    color: color, 
    metalness: 0.5, 
    roughness: 0.3 
  });
  const bowlingBall = new THREE.Mesh(ballGeometry, ballMaterial);
  bowlingBall.position.set(x, y, z);
  scene.add(bowlingBall);
  return bowlingBall;
}
const centralBall = createBowlingBall(1.5, 0x000000, 0, 0, 0);
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new THREE.TextGeometry('8', {
    font: font,
    size: 0.6,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-0.3, 0.5, 1.5); 
  scene.add(textMesh);

  const textMeshBack = new THREE.Mesh(textGeometry, textMaterial);
  textMeshBack.position.set(-0.3, 0.5, -1.5); 
  scene.add(textMeshBack);
});
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]; 
const orbitRadius = 5;
const bowlingBalls = [];
const numBalls = 6;

for (let i = 0; i < numBalls; i++) {
  const angle = (i / numBalls) * Math.PI * 2;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;

  const ball = createBowlingBall(1.2, colors[i], x, 0, z); 
  bowlingBalls.push({
    mesh: ball,
    angle: angle,
    orbitRadius: orbitRadius + i * 0.2 
  });
}
function animate() {
  requestAnimationFrame(animate);
  centralBall.rotation.y += 0.01;
  bowlingBalls.forEach((ballObj, index) => {
    ballObj.angle += 0.01 * (index + 1); 
    ballObj.mesh.position.x = Math.cos(ballObj.angle) * ballObj.orbitRadius;
    ballObj.mesh.position.z = Math.sin(ballObj.angle) * ballObj.orbitRadius;
  });

  renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
