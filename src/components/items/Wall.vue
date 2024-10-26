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

let geometry, material, item;

const group = new Group();

geometry = new BoxGeometry(
  props.data.width,
  props.data.height,
  props.data.thickness,
);
material = new MeshStandardMaterial({ color: props.data.color });
item = new Mesh(geometry, material);
item.position.set(
  props.data.posX || 0,
  props.data.height / 2,
  props.data.posY || 0,
);
item.rotation.set(0, props.data.rotation || 0, 0);
item.receiveShadow = true;
item.castShadow = true;
group.add(item);

const calculateTotalSurface = () => {
  return (props.data.width / 100) * (props.data.height / 100);
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
