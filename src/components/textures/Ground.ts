import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from "three";

const files = {
  GRASS_1: "public/assets/textures/grass_001.jpg",
  GRASS_2: "public/assets/textures/pixels/grass_2.png",
  GRASS_3: "public/assets/textures/pixels/grass_3.png",
  GRAVEL_1: "public/assets/textures/gravel_001.jpg",
  GRAVEL_2: "public/assets/textures/gravel_002.jpg",
  GRAVEL_3: "public/assets/textures/gravel_003.jpg",
  STONE_1: "public/assets/textures/stone_001.jpg",
  COBBLESTONE_1: "public/assets/textures/pixels/cobblestone_1.png",
  COBBLESTONE_2: "public/assets/textures/pixels/cobblestone_2.png",
  COBBLESTONE_3: "public/assets/textures/pixels/cobblestone_3.png",
  WATER_1: "public/assets/textures/water.jpg",
  WOOD_1: "public/assets/textures/wood_terrace_001.jpg",
};

const generate = (
  index: string,
  surfaceWidth: number,
  surfaceHeight: number,
): Texture => {
  const texture = new TextureLoader().load(files[index]);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(surfaceWidth / 100, surfaceHeight / 100);
  return texture;
};

const getTextures = () => {
  return Object.keys(files);
};

export default {
  generate,
  getTextures,
};
