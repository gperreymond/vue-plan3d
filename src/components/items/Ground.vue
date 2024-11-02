<template></template>

<script setup lang="ts">
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Texture,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import GroundsService from "../../services/GroundsService";
// import { Grass, Gravel, SwimmingPool } from "../textures/index.ts";

const props = defineProps({
  parentGUI: {
    type: GUI,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const _id = props.data.id;
const name = props.data.name;
const width = props.data.width;
const height = props.data.height;
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const color = props.data.color;

const params = {
  name,
  width,
  height,
  x,
  y,
  z,
  color,
  // calculated
  totalSurface: "0",
};

const calculateTotalSurface = () => {
  return (params.width / 100) * (params.height / 100);
};

let box: Mesh;
const generateItem = (): Mesh => {
  let texture: Texture | undefined;
  // switch (_id) {
  //   case 1:
  //     texture = Grass(params.width, params.height);
  //     break;
  //   case 2:
  //     texture = Gravel(params.width, params.height);
  //     break;
  //   case 3:
  //     texture = SwimmingPool(params.width, params.height);
  //     break;
  //   default:
  // }
  const item = new Mesh(
    new PlaneGeometry(params.width, params.height),
    new MeshStandardMaterial({
      color: texture ? null : params.color,
      side: DoubleSide,
      map: texture ? texture : null,
    }),
  );
  item.rotation.x = Math.PI / 2;
  item.position.setX(params.x);
  item.position.setY(params.z);
  item.position.setZ(params.y);
  item.receiveShadow = true;
  item.castShadow = false;
  return item;
};
box = generateItem();

let group: Group = new Group();
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    group.remove(box);
    box = generateItem();
  }
  group.add(box);
  params.totalSurface = calculateTotalSurface().toFixed(2);
};
updateGroup();

const onChangeHandler = async () => {
  await GroundsService.update(_id, params);
  await updateGroup(true);
};

const gui = new GUI({
  autoPlace: false,
  title: params.name,
  parent: props.parentGUI,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui.add(params, "name").name("name").onChange(onChangeHandler);
  gui.add(params, "width").name("width").onChange(onChangeHandler);
  gui.add(params, "height").name("height").onChange(onChangeHandler);
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui
    .addColor(params, "color")
    .name("background color")
    .onChange(onChangeHandler);
  const surfaceLabel = gui
    .add(params, "totalSurface")
    .name("Total surface (m²)")
    .listen();
  surfaceLabel.domElement.style.pointerEvents = "none";
  surfaceLabel.domElement.style.color = "#a2db3c";
};

defineExpose({
  group,
});

onMounted(async () => {
  console.log("Wall", "onMounted", name, _id);
  setupGUI();
});
</script>
