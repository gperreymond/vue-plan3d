<template></template>

<script setup>
import { CameraHelper, PerspectiveCamera } from "three";
import { onMounted } from "vue";

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000,
);
camera.position.set(0, window.innerWidth / 2, window.innerHeight / 2);
camera.lookAt(0, 0, 0);

const helper = new CameraHelper(camera);

const onresizeHandler = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, window.innerWidth / 2, window.innerHeight / 2);
};
window.onresize = onresizeHandler;

defineExpose({
  camera,
  helper,
});

onMounted(async () => {
  console.log("Camera", "onMounted");
});
</script>
