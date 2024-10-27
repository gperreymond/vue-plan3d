<template></template>

<script setup lang="ts">
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import WallService from "../../services/WallService";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const _id = props.data.id;
const name = props.data.name;
const width = props.data.width;
const height = props.data.height;
const thickness = props.data.thickness;
const color = props.data.color;

const params = {
  width,
  height,
  thickness,
  color,
};

let box: Mesh;
const generateItem = (data: any): Mesh => {
  const geometry = new BoxGeometry(data.width, data.height, data.thickness);
  const material = new MeshStandardMaterial({ color: data.color });
  const item = new Mesh(geometry, material);
  // item.rotation.set(0, props.data.rotation || 0, 0);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};

const group = new Group();
box = generateItem(params);
group.add(box);
group.position.set(0, height / 2, thickness / 2);

const calculateTotalSurface = () => {
  return (width / 100) * (height / 100);
};

const gui = new GUI({
  autoPlace: false,
  title: `Walls - ${name}`,
});
const setupGUI = () => {
  gui
    .add(params, "width")
    .name("Largeur")
    .onChange(async () => {
      await WallService.update(_id, params);
      group.remove(box);
      box = generateItem(params);
      group.add(box);
    });
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
  console.log("Wall", "onMounted", name, _id);
  setupGUI();
});
</script>
