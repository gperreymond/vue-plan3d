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
};

const posts: Mesh<any, any, Object3DEventMap>[] = [];
const rails: Mesh<any, any, Object3DEventMap>[] = [];

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
  const spacing = params.railWidth / (params.numberOfPosts - 1);
  for (let i = 0; i < params.numberOfPosts; i++) {
    const post = generatePost();
    post.position.set(
      i * spacing - params.railWidth / 2,
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
};
updateGroup();

const onChangeHandler = async () => {
  await HorizontalFencesService.update(_id, params);
  await updateGroup(true);
};

// for (let i = 0; i < numberOfPosts; i++) {
//   const post = new Mesh(postGeometry, postMaterial);
//   post.position.set(i * spacing - totalWidth / 2, postHeight / 2, 0);
//   post.castShadow = true;
//   post.receiveShadow = true;
//   group.add(post);
//   posts.push(post);
// }

// Create the horizontal rails
// railGeometry = new BoxGeometry(totalWidth, railHeight, railThickness);
// railMaterial = new MeshStandardMaterial({
//   color: props.data.railColor || 0x8b4513,
// });

// Calculate rail vertical spacing to evenly distribute the rails along the post height
// for (let j = 0; j < numberOfRails; j++) {
//   const rail = new Mesh(railGeometry, railMaterial);
//   const railSpacing = postHeight / (numberOfRails + 1); // Evenly space the rails vertically
//   rail.position.set(0, railSpacing * (j + 1), 0);
//   rail.castShadow = true;
//   rail.receiveShadow = true;
//   group.add(rail);
//   rails.push(rail);
// }

// Function to calculate the spacing between posts
// const calculatePostSpacing = () => {
//   return spacing;
// };

// GUI configuration
const gui = new GUI({
  autoPlace: false,
  title: `HorizontalFences - ${name}`,
});
gui.show();
gui.close();
const setupGUI = () => {
  gui
    .add(params, "numberOfPosts")
    .name("numberOfPosts")
    .onChange(onChangeHandler);
  // const spacingLabel = gui
  //   .add({ postSpacing: calculatePostSpacing() }, "postSpacing")
  //   .name("Post Spacing (m)")
  //   .listen();
  // spacingLabel.domElement.style.pointerEvents = "none";
  // spacingLabel.domElement.style.color = "red";

  // gui.add(props.data, "numberOfRails").name("Number of Rails");
};

defineExpose({
  group,
  gui,
});

onMounted(() => {
  console.log("HorizontalFence", "onMounted", name, _id);
  setupGUI();
});
</script>

<style scoped>
/* Add styles here if needed */
</style>
