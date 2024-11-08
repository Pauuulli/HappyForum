import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import type { ImageUploadResult } from "~/ts-type/models/server/api/upload/image";

export default authEventHandler(async (evt) => {
  const formData = await readFormData(evt);
  const entries = Array.from(formData.entries());

  const folderPath = path.join(process.cwd(), "server/upload/images");

  const writeOps = entries
    .filter(
      (entry) => entry[1] instanceof File && entry[1].type.startsWith("image"),
    )
    .map(async ([key, value]) => {
      const image = value as File;
      const imageId = generateId();
      const format = image.type.split("/")[1];
      const imageName = `${imageId}.${format}`;
      const imagePath = path.join(folderPath, imageName);
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(imagePath, buffer);
      return imageName;
    });

  const writeResult = await Promise.allSettled(writeOps);

  const result = writeResult.map((wr) => {
    if (wr.status == "fulfilled")
      return { status: wr.status, imageName: wr.value };
    return { status: wr.status };
  });

  return result as ImageUploadResult[];
});

function generateId() {
  const timestamp = Date.now().toString(); // Current timestamp
  const randomPart = crypto.randomBytes(16).toString("hex"); // 16 random bytes
  const imageId = `${timestamp}-${randomPart}`; // Combine them
  return imageId;
}
