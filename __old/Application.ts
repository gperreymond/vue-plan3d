import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Application {
  stats: Stats;
  gui: GUI | undefined;
  controls: OrbitControls | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.Camera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  animationFrameId: number | undefined;

  constructor() {
    this.stats = new Stats();
  }

  init(innerWidth: number, innerHeight: number) {
    // Scene
    this.scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(500);
    this.scene.add(axesHelper);
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x80a0e0);
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      5000,
    );
    this.camera.position.set(0, innerWidth / 2, innerHeight / 2);
    this.camera.lookAt(0, 0, 0);
    // Directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    light.castShadow = true;
    this.scene.add(light);
    // Ambiance light
    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.2;
    this.scene.add(ambient);
    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
  }

  animate = () => {
    if (!this.scene || !this.camera) {
      return false;
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.stats.update();
    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  };

  cancel = () => {
    if (!this.animationFrameId) {
      return false;
    }
    cancelAnimationFrame(this.animationFrameId);
    this.renderer?.dispose();
    this.controls?.dispose();
  };
}

export default Application;
