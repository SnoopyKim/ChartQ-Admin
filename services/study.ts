import Study from "@/types/study";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getStudyList(category: string): Promise<{
  data?: Study["Row"][];
  error?: any;
}> {
  const { data, error } = await supabase
    .from("study")
    .select("id, title, image, updated_at")
    .eq("category", category);
  if (error) {
    return { error };
  }

  return { data: data as Study["Row"][] };
}

export async function getStudy(
  id: string
): Promise<{ data?: Study["Row"]; error?: any }> {
  const { data, error } = await supabase.from("study").select().eq("id", id);

  if (error) {
    return { error };
  }

  return { data: data[0] as Study["Row"] };
}

export async function addStudy(postData: {
  title: string;
  category: string;
  image?: File;
}): Promise<{ data?: Study["Row"]; error?: any }> {
  const { image, ...newStudy } = postData;
  const { data: study, error: studyError } = await supabase
    .from("study")
    .insert(newStudy)
    .select()
    .single();
  if (studyError || !study) {
    return { error: studyError };
  }

  if (image) {
    const { data: imgUrl, error: imgError } = await addImageToStorage(
      "study",
      image,
      `${study.id}/image.png`
    );
    if (imgError || !imgUrl) {
      return { error: imgError };
    }

    await supabase.from("study").update({ image: imgUrl }).eq("id", study.id);

    study.image = imgUrl;
  }

  return { data: study as Study["Row"] };
}

export async function updateStudy(newStudy: {
  id: string;
  title?: string;
  category?: string;
  image?: File;
}): Promise<boolean> {
  const { id, image, ...rest } = newStudy;

  if (rest) {
    const { error } = await supabase.from("study").update(rest).eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  if (image) {
    const { data: imgUrl, error: imgError } = await addImageToStorage(
      "study",
      image,
      `${id}/image.png`
    );
    if (imgError || !imgUrl) {
      return false;
    }
    const { error } = await supabase
      .from("study")
      .update({ image: imgUrl })
      .eq("id", id);
    if (error) {
      return false;
    }
  }

  return true;
}

export async function updateStudyContent(
  id: string,
  content: string
): Promise<boolean> {
  const { error } = await supabase
    .from("study")
    .update({ content })
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
}

export async function deleteStudy(id: string): Promise<boolean> {
  const { error } = await createClient().from("study").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function addImageToStorage(
  bucket: string,
  file: File,
  path: string
): Promise<{ data?: string; error?: any }> {
  try {
    // Supabase 스토리지에 이미지 업로드
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true, // 같은 경로에 파일이 있으면 덮어쓰기
      });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("업로드된 파일 정보가 없습니다.");
    }

    // 업로드된 파일의 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { data: publicUrl };
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return { error };
  }
}
