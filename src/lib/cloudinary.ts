export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type CloudinaryOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "thumb";
  quality?: "auto" | number;
  format?: "auto" | string;
};

export function getCloudinaryImageUrl(publicId: string, options: CloudinaryOptions = {}) {
  if (!cloudinaryCloudName || !publicId) {
    return "";
  }

  const transformations = [
    options.crop ? `c_${options.crop}` : "c_fill",
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    `q_${options.quality ?? "auto"}`,
    `f_${options.format ?? "auto"}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${transformations.join(
    ",",
  )}/${publicId}`;
}
