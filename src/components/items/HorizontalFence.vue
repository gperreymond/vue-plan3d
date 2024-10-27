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

let postGeometry, postMaterial, railGeometry, railMaterial;
const group = new Group();

const posts = [];
const rails = [];

// Fence parameters
const totalWidth = props.data.width; // Total width of the fence
const numberOfPosts = props.data.numberOfPosts; // Total number of posts
const postHeight = props.data.postHeight || 1.5; // Height of the posts
const postThickness = props.data.postThickness || 0.1; // Thickness of the posts
const railHeight = props.data.railHeight || 0.05; // Height of the horizontal rails
const railThickness = props.data.railThickness || 0.1; // Thickness of the rails
const numberOfRails = props.data.numberOfRails || 2; // Number of rail rows

// Calculate the spacing between posts
const spacing = totalWidth / (numberOfPosts - 1);

// Create the posts
postGeometry = new BoxGeometry(postThickness, postHeight, postThickness);
postMaterial = new MeshStandardMaterial({
  color: props.data.postColor || 0x8b4513,
});

for (let i = 0; i < numberOfPosts; i++) {
  const post = new Mesh(postGeometry, postMaterial);
  post.position.set(i * spacing - totalWidth / 2, postHeight / 2, 0);
  post.castShadow = true;
  post.receiveShadow = true;
  group.add(post);
  posts.push(post);
}

// Create the horizontal rails
railGeometry = new BoxGeometry(totalWidth, railHeight, railThickness);
railMaterial = new MeshStandardMaterial({
  color: props.data.railColor || 0x8b4513,
});

// Calculate rail vertical spacing to evenly distribute the rails along the post height
for (let j = 0; j < numberOfRails; j++) {
  const rail = new Mesh(railGeometry, railMaterial);
  const railSpacing = postHeight / (numberOfRails + 1); // Evenly space the rails vertically
  rail.position.set(0, railSpacing * (j + 1), 0);
  rail.castShadow = true;
  rail.receiveShadow = true;
  group.add(rail);
  rails.push(rail);
}

// Function to calculate the spacing between posts
const calculatePostSpacing = () => {
  return spacing;
};

// GUI configuration
const gui = new GUI({
  autoPlace: false,
  title: props.data.title || "Fence (horizontal)",
});
const setupGUI = () => {
  const spacingLabel = gui
    .add({ postSpacing: calculatePostSpacing() }, "postSpacing")
    .name("Post Spacing (m)")
    .listen();
  spacingLabel.domElement.style.pointerEvents = "none";
  spacingLabel.domElement.style.color = "red";

  gui.add(props.data, "numberOfRails").name("Number of Rails");
};

defineExpose({
  group,
  gui,
});

onMounted(() => {
  console.log("HorizontalFence", "onMounted", props.data.title);
  setupGUI();
});
</script>

<style scoped>
/* Add styles here if needed */
</style>
