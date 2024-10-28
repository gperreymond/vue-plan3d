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
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const flip = props.data.flip;
const color = props.data.color;

const params = {
  width,
  height,
  thickness,
  x,
  y,
  z,
  flip,
  color,
};

let box: Mesh;
const generateItem = (): Mesh => {
  const geometry = new BoxGeometry(
    params.width,
    params.height,
    params.thickness,
  );
  const material = new MeshStandardMaterial({ color: params.color });
  const item = new Mesh(geometry, material);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};
box = generateItem();

let group: Group = new Group();
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    group.remove(box);
    box = generateItem();
  }
  box.rotation.set(0, params.flip === true ? Math.PI / 2 : 0, 0);
  group.add(box);
  if (params.flip === false) {
    group.position.set(
      params.width / 2 + params.x,
      params.height / 2 + params.z,
      params.thickness / 2 + params.y,
    );
  } else {
    group.position.set(
      params.thickness / 2 + params.x,
      params.height / 2 + params.z,
      params.width / 2 + params.y,
    );
  }
};
updateGroup();

const onChangeHandler = async () => {
  await WallService.update(_id, params);
  await updateGroup(true);
};

const calculateTotalSurface = () => {
  return (width / 100) * (height / 100);
};

const gui = new GUI({
  autoPlace: false,
  title: `Walls - ${name}`,
});
const setupGUI = () => {
  gui.add(params, "width").name("width").onChange(onChangeHandler);
  gui.add(params, "height").name("height").onChange(onChangeHandler);
  gui.add(params, "thickness").name("thickness").onChange(onChangeHandler);
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui.add(params, "flip").name("flip").onChange(onChangeHandler);
  gui
    .addColor(params, "color")
    .name("background color")
    .onChange(onChangeHandler);
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
