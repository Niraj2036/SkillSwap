import { useMutation } from "@tanstack/react-query";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

const uploadToCloudinary = async (file: File): Promise<string> =>{
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  console.log("Cloudinary response:", res);

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

/** Re‑usable mutation hook */
export function useCloudinaryUpload() {
  return useMutation({
    mutationFn: uploadToCloudinary,
  });
}
