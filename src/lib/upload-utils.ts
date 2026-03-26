/**
 * Unified Upload Service
 * 
 * Supports:
 * - Cloudinary (Client-Side Signed/Unsigned)
 * - S3-Compatible Storage (AWS R2/S3/DO Spaces)
 * - Mock (Simulation with unsplash for local testing)
 * 
 * You can switch by changing NEXT_PUBLIC_UPLOAD_PROVIDER in .env
 */

export const uploadImage = async (file: File): Promise<string> => {
  const provider = process.env.NEXT_PUBLIC_UPLOAD_PROVIDER || "mock";

  console.log(`[Upload Service] Starting upload using provider: ${provider}`);

  // 1. CLOUDINARY UPLOAD LOGIC
  if (provider === "cloudinary") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  }

  // 2. S3 / R2 UPLOAD LOGIC (Via API Route for Security)
  if (provider === "s3") {
    // We first ask our API for a pre-signed URL to keep secrets hidden
    const res = await fetch("/api/upload/s3-presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!res.ok) throw new Error("Could not get pre-signed URL");
    const { url, publicUrl } = await res.json();

    // Direct binary upload to S3/R2
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    return publicUrl;
  }

  // 3. UPLOADTHING LOGIC
  if (provider === "uploadthing") {
    // Implementation for UploadThing (Typically uses its specific library)
    // For now, let's assume you'd call their REST or specialized hook
    throw new Error("UploadThing implementation requires additional SDK");
  }

  // 4. MOCK SIMULATION (For Dev/Testing)
  if (provider === "mock") {
    await new Promise(r => setTimeout(r, 1200));
    // Pick a high-quality random unsplash product image
    const randoms = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
    ];
    return randoms[Math.floor(Math.random() * randoms.length)];
  }

  throw new Error(`Unsupported upload provider: ${provider}`);
};
