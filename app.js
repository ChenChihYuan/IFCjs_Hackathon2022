import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    Loader,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
  } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {IFCLoader}  from "web-ifc-three"
  

const scene = new Scene();
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;


const lightColor = 0xffffff;
const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 2);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

window.addEventListener("resize", () => {
  (size.width = window.innerWidth), (size.height = window.innerHeight);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
// IFC loading
const ifcLoader = new IFCLoader();

ifcLoader.ifcManager.useWebWorkers(true, "./IFCWorker.js");

const input = document.getElementById('file-input')
input.addEventListener('change', async () => {
  console.log('file selected')
  const file = input.files[0];
  const url = URL.createObjectURL(file);
  const model = await ifcLoader.loadAsync(url);
  scene.add(model);
});

setupProgress();

function setupProgress(){
    const text = document.getElementById('progress-text');
    ifcLoader.ifcManager.setOnProgress((event) => {
        const percent = event.loaded / event.total * 100;
        const formatted = `${Math.trunc(percent)}%`;
        text.innerText = formatted;
    })
}