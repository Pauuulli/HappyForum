import { unlink } from "fs/promises";
import path from "path";

export default authEventHandler(async (evt) => {
  const imageName = getRouterParam(evt, "name")!;

  const imagePath = path.join(
    process.cwd(),
    "/server/upload/images",
    imageName,
  );

  try {
    await unlink(imagePath);
  } catch (e: any) {
    if (
      typeof e?.message == "string" &&
      e.message.includes("no such file or directory")
    ) {
      setResponseStatus(evt, 404);
    } else throw e;
  }
});
