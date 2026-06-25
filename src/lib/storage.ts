import { getSupabaseClient } from "./supabase";

const BUCKET = "plantation-files";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image and returns a displayable URL.
 * - Cloud (Supabase configured): stores under `{userId}/...` in the public
 *   `plantation-files` bucket and returns the public URL.
 * - Demo: returns an inline data URL (persisted with the local store).
 */
export async function uploadImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be under 5 MB.");
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return fileToDataUrl(file);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const folder = user?.id ?? "shared";
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
