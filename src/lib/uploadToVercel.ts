// lib/uploadToVercel.ts
"use client"; // make sure this runs on the client side

import { put } from "@vercel/blob";

export async function uploadToVercel(file: File): Promise<string> {
  try {
    const blob = await put(file.name, file, {
      access: "public",
    });
    console.log("✅ Uploaded to Vercel Blob:", blob.url);
    return blob.url;
  } catch (error) {
    console.error("❌ Vercel Blob upload failed:", error);
    throw error;
  }
}

