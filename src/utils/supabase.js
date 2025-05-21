import { createClient } from "@supabase/supabase-js";

const url = "https://wahekljntojltagdxuib.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaGVrbGpudG9qbHRhZ2R4dWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDYyODksImV4cCI6MjA2MzMyMjI4OX0.MoY7Cc4mSyadyN1Vg4WWDth_aU7PMHibQlmnE8bfoCc";

const supabase = createClient(url, key);

export const uploadMedia = async (file) => {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    const timeStamp = Date.now();
    const newName = `${timeStamp}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
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
    } = supabase.storage.from("images").getPublicUrl(newName);

    if (urlError) {
      throw urlError;
    }

    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
