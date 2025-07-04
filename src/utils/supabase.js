import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

let supabase;

if (!globalThis.__supabase) {
  globalThis.__supabase = createClient(url, key);
}

supabase = globalThis.__supabase;

export const uploadMedia = async (file) => {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    const timeStamp = Date.now();
    const newName = `${timeStamp}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("cbc-images")
      .upload(newName, file, {
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("cbc-images").getPublicUrl(newName);

    if (urlError) {
      throw urlError;
    }

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

export const deleteMedia = async (fileName) => {
  try {
    if (!fileName) {
      throw new Error("File name is required to delete");
    }

    if (fileName.includes("supabase.co/storage/v1/object/public/cbc-images/")) {
      const { error: deleteError } = await supabase.storage
        .from("cbc-images")
        .remove([fileName]);

      if (deleteError) {
        throw deleteError;
      }
    }

    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
};
