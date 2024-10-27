<template></template>

<script setup lang="ts">
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});


const totalWidth = props.data.width || 200;
const totalHeight = props.data.height || 100;
const thickness = props.data.thickness || 20;
const color = props.data.color || 0xff0000

let geometry, material, item;

const group = new Group();

geometry = new BoxGeometry(totalWidth, totalHeight, thickness);
material = new MeshStandardMaterial({ color });
item = new Mesh(geometry, material);
item.rotation.set(0, props.data.rotation || 0, 0);
item.receiveShadow = true;
item.castShadow = true;
group.add(item);

group.position.set(0, totalHeight / 2, thickness / 2);

const calculateTotalSurface = () => {
  return (totalWidth / 100) * (totalHeight / 100);
};

const gui = new GUI({
  autoPlace: false,
  title: props.data.title,
});
const setupGUI = () => {
  const surfaceLabel = gui
    .add({ totalSurface: calculateTotalSurface() }, "totalSurface")
    .name("Total surface (m²)")
    .listen();
  surfaceLabel.domElement.style.pointerEvents = "none";
  surfaceLabel.domElement.style.color = "red";
};

defineExpose({
  group,
  gui,
});

onMounted(async () => {
  console.log("Wall", "onMounted", props.data.title);
  setupGUI();
});
</script>
