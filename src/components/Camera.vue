<template></template>

<script setup lang="ts">
import { CameraHelper, PerspectiveCamera } from "three";
import { onMounted } from "vue";

const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  3000,
);
camera.position.set(0, window.innerWidth / 2, window.innerHeight / 2);
camera.lookAt(0, 0, 0);

const helper = new CameraHelper(camera);

defineExpose({
  camera,
  helper,
});

onMounted(async () => {
  console.log("Camera", "onMounted");
});
</script>
