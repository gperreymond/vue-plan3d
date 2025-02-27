<template></template>

<script setup lang="ts">
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3DEventMap,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { onMounted } from "vue";

import HorizontalFencesService from "../../services/HorizontalFencesService";

const props = defineProps({
  parentGUI: {
    type: GUI,
    required: true,
  },
  sceneWidth: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const _id = props.data.id;
const name = props.data.name;
const numberOfPosts = props.data.numberOfPosts;
const numberOfRails = props.data.numberOfRails;
const postWidth = props.data.postWidth;
const postHeight = props.data.postHeight;
const postThickness = props.data.postThickness;
const postColor = props.data.postColor;
const railWidth = props.data.railWidth;
const railHeight = props.data.railHeight;
const railThickness = props.data.railThickness;
const railColor = props.data.railColor;
const x = props.data.x;
const y = props.data.y;
const z = props.data.z;
const flip = props.data.flip;

const params = {
  numberOfPosts,
  numberOfRails,
  postWidth,
  postHeight,
  postThickness,
  postColor,
  railWidth,
  railHeight,
  railThickness,
  railColor,
  x,
  y,
  z,
  flip,
  // calculated
  postsSpacing: "0",
  postsLength: "0",
  railsLength: "0",
};

const posts: Mesh<any, any, Object3DEventMap>[] = [];
const rails: Mesh<any, any, Object3DEventMap>[] = [];

const calculatePostsSpacing = () => {
  return (params.railWidth - params.postWidth) / (params.numberOfPosts - 1);
};

const generatePost = (): Mesh => {
  const geometry = new BoxGeometry(
    params.postWidth,
    params.postHeight,
    params.postThickness,
  );
  const material = new MeshStandardMaterial({ color: params.postColor });
  const item = new Mesh(geometry, material);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};

const generateRail = (): Mesh => {
  const geometry = new BoxGeometry(
    params.railWidth,
    params.railHeight,
    params.railThickness,
  );
  const material = new MeshStandardMaterial({ color: params.railColor });
  const item = new Mesh(geometry, material);
  item.receiveShadow = true;
  item.castShadow = true;
  return item;
};

let group: Group = new Group();
group.name = `horizontal-fence:${_id}`;
const updateGroup = (update: boolean = false) => {
  if (update === true) {
    rails.map((item) => {
      group.remove(item);
    });
    posts.map((item) => {
      group.remove(item);
    });
  }
  // Calculate the spacing between posts
  const spacing = calculatePostsSpacing();
  for (let i = 0; i < params.numberOfPosts; i++) {
    const post = generatePost();
    post.position.set(
      i * spacing - (params.railWidth - params.postWidth) / 2,
      params.postHeight / 2,
      params.postThickness / 2,
    );
    group.add(post);
    posts.push(post);
  }
  for (let j = 0; j < params.numberOfRails; j++) {
    const rail = generateRail();
    const railSpacing = params.postHeight / (params.numberOfRails + 1);
    rail.position.set(0, railSpacing * (j + 1), 0);
    group.add(rail);
    rails.push(rail);
  }
  params.postsSpacing = (spacing / 100).toFixed(2);
  params.postsLength = (
    (params.numberOfPosts * params.postHeight) /
    100
  ).toFixed(2);
  params.railsLength = (
    (params.numberOfRails * params.railWidth) /
    100
  ).toFixed(2);
  let translateX = 0;
  let translateY = 0;
  translateX = (-props.sceneWidth + params.railWidth) / 2;
  translateY = -props.sceneWidth / 2;
  group.position.setX(translateX + params.x);
  group.position.setY(params.z);
  group.position.setZ(translateY + params.y);
};
updateGroup();

const onChangeHandler = async () => {
  await HorizontalFencesService.update(_id, params);
  await updateGroup(true);
};

// GUI configuration
const gui = new GUI({
  autoPlace: false,
  title: name,
  parent: props.parentGUI,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui
    .add(params, "numberOfPosts")
    .name("numberOfPosts")
    .onChange(onChangeHandler);
  gui
    .add(params, "numberOfRails")
    .name("numberOfRails")
    .onChange(onChangeHandler);
  gui.add(params, "postWidth").name("postWidth").onChange(onChangeHandler);
  gui.add(params, "postHeight").name("postHeight").onChange(onChangeHandler);
  gui
    .add(params, "postThickness")
    .name("postThickness")
    .onChange(onChangeHandler);
  gui.add(params, "railWidth").name("railWidth").onChange(onChangeHandler);
  gui.add(params, "railHeight").name("railHeight").onChange(onChangeHandler);
  gui
    .add(params, "railThickness")
    .name("railThickness")
    .onChange(onChangeHandler);
  gui.add(params, "x").name("x").onChange(onChangeHandler);
  gui.add(params, "y").name("y").onChange(onChangeHandler);
  gui.add(params, "z").name("z").onChange(onChangeHandler);
  gui
    .addColor(params, "postColor")
    .name("post color")
    .onChange(onChangeHandler);
  gui
    .addColor(params, "railColor")
    .name("rail color")
    .onChange(onChangeHandler);
  const postsSpacingLabel = gui
    .add(params, "postsSpacing")
    .name("posts spacing (m)")
    .listen();
  postsSpacingLabel.domElement.style.pointerEvents = "none";
  postsSpacingLabel.domElement.style.color = "#a2db3c";
  const postsLengthLabel = gui
    .add(params, "postsLength")
    .name("posts length (m)")
    .listen();
  postsLengthLabel.domElement.style.pointerEvents = "none";
  postsLengthLabel.domElement.style.color = "#a2db3c";
  const railsLengthLabel = gui
    .add(params, "railsLength")
    .name("rails length (m)")
    .listen();
  railsLengthLabel.domElement.style.pointerEvents = "none";
  railsLengthLabel.domElement.style.color = "#a2db3c";
};

defineExpose({
  group,
});

onMounted(() => {
  console.log("HorizontalFence", "onMounted", name, _id);
  setupGUI();
});
</script>

<style scoped>
/* Add styles here if needed */
</style>
