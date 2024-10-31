import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from "three";

const filepath = "public/assets/textures/grass_001.jpg";
const generate = (surfaceWidth: number, surfaceHeight: number): Texture => {
  const texture = new TextureLoader().load(filepath);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(surfaceWidth / 100, surfaceHeight / 100);
  console.log("Texture repeat", surfaceWidth / 100, surfaceHeight / 100);
  return texture;
};

export default generate;
