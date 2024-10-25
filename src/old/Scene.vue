<template>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sceneContainer = ref(null);
let scene, camera, renderer, controls, plane, animationFrameId;

const textureLoader = new THREE.TextureLoader();
function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}
const textures = {
  terrace: {
    src: "assets/textures/terrace.jpeg",
    width: 200,
    height: 200,
  },
  cement: {
    src: "assets/textures/cement-white.jpg",
    width: 250,
    height: 250,
  },
  greenGrass: {
    src: "assets/textures/green-grass.jpg",
    width: 250,
    height: 250,
  },
};

onMounted(() => {
  // Data
  const APP_TOTAL_WIDTH = 420;
  const APP_TOTAL_HEIGHT = 860;
  const APP_TERRACE_HEIGHT = 350;
  const APP_WALL_THICKNESS = 15;
  const APP_STAIRS_WIDTH = 80;
  const APP_BENCH_WIDTH =
    APP_TOTAL_WIDTH - APP_STAIRS_WIDTH - 2 * APP_WALL_THICKNESS;
  const APP_BENCH_HEIGHT = 60;
  const APP_WALL_EXT_HEIGHT = 20;
  const APP_WALL_EXT_THICKNESS = 7.2;
  const APP_WALL_EXT_PADDING = 7;
  // UI Setup
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  // Scene
  scene = new THREE.Scene({ color: "#ffcc00" });
  // Camera
  const camera = new THREE.PerspectiveCamera(
    75, // champ de vision (FOV)
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near
    5000, // far
  );
  camera.position.set(0, window.innerWidth / 2, window.innerHeight / 2);
  camera.lookAt(0, 0, 0);
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x80a0e0);
  sceneContainer.value.appendChild(renderer.domElement);
  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable damping for smoother controls
  controls.dampingFactor = 0.25; // Damping factor
  controls.enableZoom = true; // Allow zooming with the mouse wheel
  // Directional light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  light.castShadow = true;
  scene.add(light);
  // Ambiance light
  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.2;
  scene.add(ambient);
  // Animation loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    stats.update();
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  // scene.fog = new THREE.Fog(0x80a0e0, 50, 75);
  // ---------------------------------------------------------------
  // GENERATE
  // ---------------------------------------------------------------
  const data = [
    // Ref
    // { x: 10, y: 10, z: 100, color: 'red', position: { x: 0, y: 0, z: 0 } },
    // Me as Humain
    {
      x: 90,
      y: 90,
      z: 170,
      wireframe: true,
      color: "Red",
      position: { x: -APP_TOTAL_WIDTH, y: 100, z: 80 },
    },
    // Gardener
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 60,
      z: 24,
      color: "Sienna",
      position: { x: -APP_TOTAL_WIDTH, y: APP_WALL_EXT_HEIGHT, z: 80 },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 60,
      z: 1,
      color: "Tan",
      position: { x: -APP_TOTAL_WIDTH, y: APP_WALL_EXT_HEIGHT, z: 104 },
    },
    // Out
    {
      x: APP_TOTAL_WIDTH * 2,
      y: APP_WALL_EXT_HEIGHT,
      z: 20,
      color: "Snow",
      texture: textures.cement,
      position: { x: -APP_TOTAL_WIDTH, y: 0, z: 80 },
    },
    // Out Verticals
    {
      x: 10,
      y: 10,
      z: 90,
      color: "Sienna",
      position: { x: -APP_TOTAL_WIDTH, y: 5, z: APP_WALL_EXT_HEIGHT + 80 },
    },
    {
      x: 10,
      y: 10,
      z: 90,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH + 180,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80,
      },
    },
    {
      x: 10,
      y: 10,
      z: 90,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH + 180 * 2,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80,
      },
    },
    {
      x: 10,
      y: 10,
      z: 90,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH + 180 * 3,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80,
      },
    },
    {
      x: 10,
      y: 10,
      z: 90,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH + 180 * 4,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80,
      },
    },
    // Out Horizontals
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: { x: -APP_TOTAL_WIDTH, y: 5, z: APP_WALL_EXT_HEIGHT + 80 },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80 + APP_WALL_EXT_PADDING * 2,
      },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80 + APP_WALL_EXT_PADDING * 4,
      },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80 + APP_WALL_EXT_PADDING * 6,
      },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80 + APP_WALL_EXT_PADDING * 8,
      },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 10,
      z: APP_WALL_EXT_THICKNESS,
      color: "Sienna",
      position: {
        x: -APP_TOTAL_WIDTH,
        y: 5,
        z: APP_WALL_EXT_HEIGHT + 80 + APP_WALL_EXT_PADDING * 10,
      },
    },
    // Terrace
    {
      x: APP_TOTAL_WIDTH,
      y: APP_TERRACE_HEIGHT,
      z: 80,
      color: "Snow",
      texture: textures.cement,
      position: { x: 0, y: 0, z: 0 },
    },
    // External walls
    {
      x: APP_WALL_THICKNESS,
      y: APP_TOTAL_HEIGHT,
      z: 80,
      color: "Snow",
      texture: textures.cement,
      position: { x: APP_TOTAL_WIDTH - APP_WALL_THICKNESS, y: 0, z: 0 },
    },
    {
      x: APP_WALL_THICKNESS,
      y: APP_TOTAL_HEIGHT,
      z: 80,
      color: "Snow",
      texture: textures.cement,
      position: { x: 0, y: 0, z: 0 },
    },
    {
      x: APP_TOTAL_WIDTH,
      y: APP_WALL_THICKNESS,
      z: 140,
      color: "Snow",
      texture: textures.cement,
      position: { x: 0, y: APP_TOTAL_HEIGHT - APP_WALL_THICKNESS, z: 0 },
    },
    // Stairs 1
    {
      x: APP_STAIRS_WIDTH,
      y: 30,
      z: 80,
      color: "Snow",
      texture: textures.cement,
      position: { x: APP_WALL_THICKNESS, y: APP_TERRACE_HEIGHT, z: 0 },
    },
    {
      x: APP_STAIRS_WIDTH,
      y: 30,
      z: 60,
      color: "Snow",
      texture: textures.cement,
      position: { x: APP_WALL_THICKNESS, y: APP_TERRACE_HEIGHT + 30, z: 0 },
    },
    {
      x: APP_STAIRS_WIDTH,
      y: 30,
      z: 40,
      color: "Snow",
      texture: textures.cement,
      position: { x: APP_WALL_THICKNESS, y: APP_TERRACE_HEIGHT + 60, z: 0 },
    },
    {
      x: APP_STAIRS_WIDTH,
      y: 30,
      z: 20,
      color: "Snow",
      texture: textures.cement,
      position: { x: APP_WALL_THICKNESS, y: APP_TERRACE_HEIGHT + 90, z: 0 },
    },
    // Stairs 2
    {
      x: 30,
      y: APP_STAIRS_WIDTH,
      z: 80,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_WALL_THICKNESS,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS,
        z: 0,
      },
    },
    {
      x: 30,
      y: APP_STAIRS_WIDTH,
      z: 60,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_WALL_THICKNESS + 30,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS,
        z: 0,
      },
    },
    {
      x: 30,
      y: APP_STAIRS_WIDTH,
      z: 40,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_WALL_THICKNESS + 60,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS,
        z: 0,
      },
    },
    {
      x: 30,
      y: APP_STAIRS_WIDTH,
      z: 20,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_WALL_THICKNESS + 90,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS,
        z: 0,
      },
    },
    // Bench 1
    {
      x: APP_BENCH_WIDTH,
      y: APP_BENCH_HEIGHT,
      z: 40,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_STAIRS_WIDTH + APP_WALL_THICKNESS,
        y: APP_TERRACE_HEIGHT,
        z: 0,
      },
    },
    // Bench 2
    {
      x: APP_BENCH_HEIGHT,
      y: APP_BENCH_WIDTH,
      z: 40,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: APP_TOTAL_WIDTH - 60 - APP_WALL_THICKNESS,
        y: APP_TERRACE_HEIGHT,
        z: 0,
      },
    },
    // Table
    {
      x: 100,
      y: 160,
      z: 80,
      wireframe: true,
      color: "Red",
      position: {
        x: APP_TOTAL_WIDTH - APP_BENCH_HEIGHT - 100 - APP_WALL_THICKNESS - 25,
        y: APP_TERRACE_HEIGHT + APP_BENCH_HEIGHT + 25,
        z: 0,
      },
    },
    // Bar
    {
      x: 40,
      y: 200,
      z: 5,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: -10,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS - 200,
        z: 110,
      },
    },
    {
      x: APP_WALL_THICKNESS,
      y: 200,
      z: 110,
      color: "Snow",
      texture: textures.cement,
      position: {
        x: 0,
        y: APP_TOTAL_HEIGHT - APP_STAIRS_WIDTH - APP_WALL_THICKNESS - 200,
        z: 0,
      },
    },
    // Grounds
    {
      x: APP_TOTAL_WIDTH,
      y: APP_TOTAL_HEIGHT,
      z: 5,
      color: "Tan",
      texture: textures.terrace,
      position: { x: 0, y: 0, z: -5 },
    },
    {
      x: APP_TOTAL_WIDTH,
      y: APP_TOTAL_HEIGHT,
      z: 5,
      color: "LightSteelBlue",
      position: { x: -APP_TOTAL_WIDTH, y: 0, z: 80 - 5 },
    },
    {
      x: APP_TOTAL_WIDTH * 2,
      y: 100,
      z: 5,
      color: "LightSteelBlue",
      position: { x: -APP_TOTAL_WIDTH, y: APP_TOTAL_HEIGHT, z: 80 - 5 },
    },
  ];
  // Trees
  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    "public/assets/models/Tree.fbx",
    (object) => {
      const scale = 0.1;
      object.scale.set(scale, scale, scale);
      object.position.set(
        APP_TOTAL_WIDTH - APP_WALL_THICKNESS - 40 - 20 - 20,
        5,
        APP_TOTAL_HEIGHT - APP_WALL_THICKNESS - 40 - 20 - 20,
      );
      scene.add(object);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    },
  );
  // Green in Gardener
  for (let i = -3; i < 4; i++) {
    let geometry = new THREE.SphereGeometry(25, 30, 30);
    let material = new THREE.MeshBasicMaterial({ color: "DarkOliveGreen" });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(120 * i, 110, 50);
    scene.add(sphere);
  }
  // Construct
  data.map((item) => {
    let geometry = new THREE.BoxGeometry(item.x, item.z, item.y);
    if (item.texture) {
      let t = loadTexture(item.texture.src);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(item.x / item.texture.width, item.y / item.texture.height);
      item.texture = t;
    }
    let material = new THREE.MeshLambertMaterial({
      map: item.texture ? item.texture : null,
      color: item.texture ? null : item.color,
      wireframe: item.wireframe ? item.wireframe : false,
    });
    let block = new THREE.Mesh(geometry, material);
    block.position.set(
      item.x / 2 + item.position.x,
      item.z / 2 + item.position.z,
      item.y / 2 + item.position.y,
    );
    scene.add(block);
    return true;
  });
});

onBeforeUnmount(() => {
  // Cleanup when component is destroyed
  cancelAnimationFrame(animationFrameId);
  renderer.dispose();
  controls.dispose();
});
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
