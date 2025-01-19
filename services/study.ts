import Study from "@/types/study";
import Tag from "@/types/tag";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

const supabase = createClient();

export async function getStudiesByTag(tagId: string): Promise<{
  data?: Study["Row"][];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("study_tags")
    .select(
      "study(id, title, subtitle, order, image, updated_at, study_tags(tag(*)))"
    ) // studies 테이블의 데이터를 가져옴
    .eq("tag_id", tagId)
    .order("study(order)", { ascending: true });

  if (error) {
    console.error(error);
    return { error };
  }

  // 응답 데이터 구조 정리
  const formattedData = data?.map((d: { study: any }) => ({
    id: d.study.id,
    title: d.study.title,
    image: d.study.image,
    tags: d.study.study_tags.map((st: any) => st.tag) as Tag[],
    updated_at: d.study.updated_at,
  }));

  return { data: formattedData as Study["Row"][] };
}

// tag가 없는 study 검색
export async function getStudiesWithNoTags(): Promise<{
  data?: Study["Row"][];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("study")
    .select(
      `id, title, subtitle, order, image, updated_at,
      study_tags!left (tag (id, name))
    `
    )
    .is("study_tags", null) // study_tags가 없는 경우만 가져옴
    .order("order", { ascending: true });

  if (error) {
    console.error(error);
    return { error };
  }

  // study_tags를 tags로 변환하고 null을 빈 배열로 변경
  const result = data.map((study) => ({
    ...study,
    tags: [],
  }));

  return { data: result as Study["Row"][] };
}

export async function getStudies(): Promise<{
  data?: Study["Row"][];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("study")
    .select(
      `id, title, subtitle, order, image, updated_at,
      study_tags!left (tag (id, name))
    `
    )
    .order("order", { ascending: true });

  if (error) {
    console.error(error);
    return { error };
  }

  // study_tags를 tags로 변환하고 null을 빈 배열로 변경
  const result = data.map((study) => ({
    ...study,
    tags: study.study_tags
      ? study.study_tags.map((st: any) => st.tag as Tag)
      : [],
  }));

  return { data: result as Study["Row"][] };
}

export async function getStudy(
  id: string
): Promise<{ data?: Study["Row"]; error?: Partial<PostgrestError> }> {
  const { data, error } = await supabase
    .from("study")
    .select(`*, study_tags!left (tag (id, name))`)
    .eq("id", id);

  if (error) {
    return { error };
  }
  if (!data || data.length === 0) {
    return {
      error: {
        code: "NOT_FOUND",
        message: "해당 자료는 존재하지 않습니다.",
      },
    };
  }

  const result = {
    ...data[0],
    tags: data[0].study_tags
      ? (data[0].study_tags.map((st: any) => st.tag) as Tag[])
      : [],
  };

  return { data: result as Study["Row"] };
}

export async function addStudy(postData: {
  title: string;
  subtitle?: string;
  tags: Partial<Tag>[];
  image?: File;
}): Promise<{ data?: Study["Row"]; error?: PostgrestError }> {
  const { image, tags, ...newStudy } = postData;
  const { data: study, error: studyError } = await supabase
    .from("study")
    .insert(newStudy)
    .select()
    .single();
  if (studyError || !study) {
    return { error: studyError || undefined };
  }

  if (tags) {
    await supabase.from("study_tags").insert(
      tags.map((tag) => ({
        study_id: study.id,
        tag_id: tag.id,
      }))
    );
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
  subtitle?: string;
  tags?: Partial<Tag>[];
  image?: string;
}): Promise<boolean> {
  const { id, tags, ...rest } = newStudy;

  if (tags) {
    await supabase.from("study_tags").delete().eq("study_id", id);
    await supabase.from("study_tags").insert(
      tags.map((tag) => ({
        study_id: id,
        tag_id: tag.id,
      }))
    );
  }
  if (rest) {
    const { error } = await supabase.from("study").update(rest).eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}

export async function updateStudyOrder(
  id: string,
  order: number
): Promise<boolean> {
  const { error } = await supabase.from("study").update({ order }).eq("id", id);
  if (error) {
    console.error(error);
    return false;
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
