import fs from "fs/promises";
import path from "path";

export default eventHandler(async (evt) => {
  const imageName = getRouterParam(evt, "name")!;

  const imagePath = path.join(process.cwd(), "server/upload/images", imageName);
  try {
    const image = await fs.readFile(imagePath);
    return image;
  } catch (e) {
    if (
      e != null &&
      typeof e == "object" &&
      "message" in e &&
      typeof e.message == "string" &&
      e.message.includes("no such file or directory")
    ) {
      setResponseStatus(evt, 404);
    } else throw e;
  }
});
