import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(url, key);

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

    console.log(publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
