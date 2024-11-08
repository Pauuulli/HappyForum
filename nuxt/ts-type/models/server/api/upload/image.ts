interface Success {
  status: "fulfilled";
  imageName: string;
}
interface Fail {
  status: "rejected";
}
type ImageUploadResult = Success | Fail;

export type { ImageUploadResult };
