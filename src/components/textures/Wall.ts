import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from "three";

const files = {
  STONE_1: "public/assets/textures/RealisticTexturePack/wall.png",
  STONE_2: "public/assets/textures/RealisticTexturePack/wall2.png",
  WOOD_4: "public/assets/textures/wood_004.png",
  WOOD_5: "public/assets/textures/wood_005.jpg",
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
