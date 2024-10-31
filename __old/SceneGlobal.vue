<template>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import ground from "./Ground";
import {
  barrier,
  barrierGap,
  barrierHorizontalLong,
  barrierVerticalLong,
} from "./items/Barrier";
import { gardener, gardenerWoodLong } from "./Gardener";

const sceneContainer = ref(null);
let scene, camera, renderer, controls, plane, animationFrameId;

onMounted(() => {
  // UI Setup
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  // Scene
  scene = new THREE.Scene();
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
  const axesHelper = new THREE.AxesHelper(1000);
  axesHelper.position.set(0, 0, 0);
  scene.add(axesHelper);
  // Construct all
  const gui = new GUI();
  const params = {
    barrierGap,
    barrierHorizontalLong,
    barrierVerticalLong,
    gardenerWoodLong,
  };
  gui.add(params, "barrierGap").name("barrierGap");
  gui.add(params, "barrierHorizontalLong").name("barrierHorizontalLong");
  gui.add(params, "barrierVerticalLong").name("barrierVerticalLong");
  gui.add(params, "gardenerWoodLong").name("gardenerWoodLong");
  // scene.add(ground)
  scene.add(barrier);
  scene.add(gardener);
  ground.position.set(0, 0, 0);
  animate();
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
