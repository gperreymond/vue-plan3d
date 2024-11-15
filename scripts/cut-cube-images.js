import sharp from "sharp"
import fse from 'fs-extra'

const faceSize = 300; // Taille de chaque face, à adapter selon votre image

const extract = async (texture) => {
    const input = `scripts/Essential_Isometric_3D_Block_Pack_Devilsworkshop_v2.0/Assets/Textures/${texture}.png`;
    const output = `public/assets/cubes/${texture}`
    await fse.ensureDir(output);
    await fse.emptyDir(output)
    const faces = [
        { name: 'px', left: 18 + 2 * faceSize, top: 18 + 1 * faceSize },
        { name: 'py', left: 18 + 1 * faceSize, top: 16 + 0 * faceSize },
        { name: 'pz', left: 18 + 1 * faceSize, top: 18 + 1 * faceSize },
        { name: 'nx', left: 18 + 0 * faceSize, top: 18 + 1 * faceSize },
        { name: 'ny', left: 18 + 1 * faceSize, top: 19 + 2 * faceSize },
        { name: 'nz', left: 52 + 2 * faceSize, top: 62 + 2 * faceSize },
    ];

    faces.forEach(face => {
    sharp(input)
        .resize(1024)
        .extract({ width: faceSize, height: faceSize, left: face.left, top: face.top })
        .toFile(`${output}/${face.name}.png`, (err) => {
        if (err) {
            console.error(`Erreur lors de la découpe de la face ${face.name}:`, err);
        } else {
            console.log(`Face ${face.name} enregistrée.`);
        }
        });
    });
}

const run = async () => {
    const files = await fse.readdir("scripts/Essential_Isometric_3D_Block_Pack_Devilsworkshop_v2.0/Assets/Textures/")
    do {
        const file = files.shift();
        const texture = file.split('.')[0]
        console.log("=====", texture)
        await extract(texture);

    } while (files.length > 0)
}

run();