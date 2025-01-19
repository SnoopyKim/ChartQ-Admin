import Tag from "@/types/tag";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { addImageToStorage } from "./study";
import { QuizOX, QuizMC } from "@/types/quiz";

const supabase = createClient();

export async function getQuizOXList(): Promise<{
  data?: QuizOX[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("quiz_ox")
    .select(
      `*,
      quiz_ox_tags!left (tag (id, name))
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    return { error };
  }

  const result = data.map((quiz) => ({
    ...quiz,
    tags: quiz.quiz_ox_tags
      ? (quiz.quiz_ox_tags.map((st: any) => st.tag) as Tag[])
      : [],
  }));

  return { data: result as QuizOX[] };
}

export async function getQuizOX(
  id: string
): Promise<{ data?: QuizOX; error?: Partial<PostgrestError> }> {
  const { data, error } = await supabase
    .from("quiz_ox")
    .select(`*, quiz_ox_tags!left (tag (id, name))`)
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
    tags: data[0].quiz_ox_tags
      ? (data[0].quiz_ox_tags.map((st: any) => st.tag) as Tag[])
      : [],
  };

  return { data: result as QuizOX };
}

export async function addQuizOX(postData: {
  content: string;
  answer: boolean;
  tags: Partial<Tag>[];
  image?: File;
  explanation?: string;
}): Promise<{ data?: QuizOX; error?: PostgrestError }> {
  const { image, tags, ...newQuizOX } = postData;
  const { data: quizOX, error: quizOXError } = await supabase
    .from("quiz_ox")
    .insert(newQuizOX)
    .select()
    .single();
  if (quizOXError || !quizOX) {
    return { error: quizOXError || undefined };
  }

  if (tags) {
    await supabase.from("quiz_ox_tags").insert(
      tags.map((tag) => ({
        quiz_id: quizOX.id,
        tag_id: tag.id,
      }))
    );
  }

  if (image) {
    const { data: imgUrl, error: imgError } = await addImageToStorage(
      "quiz",
      image,
      `${quizOX.id}/image.png`
    );
    if (imgError || !imgUrl) {
      return { error: imgError };
    }

    await supabase
      .from("quiz_ox")
      .update({ image: imgUrl })
      .eq("id", quizOX.id);

    quizOX.image = imgUrl;
  }

  return { data: quizOX as QuizOX };
}

export async function updateQuizOX(newQuizOX: {
  id: string;
  content?: string;
  answer?: boolean;
  tags?: Partial<Tag>[];
  image?: string;
}): Promise<boolean> {
  const { id, tags, ...rest } = newQuizOX;

  if (tags) {
    console.log(tags, rest);
    const res1 = await supabase.from("quiz_ox_tags").delete().eq("quiz_id", id);
    const res2 = await supabase.from("quiz_ox_tags").insert(
      tags.map((tag) => ({
        quiz_id: id,
        tag_id: tag.id,
      }))
    );
    console.log(res1, res2);
  }
  if (rest) {
    const { error } = await supabase.from("quiz_ox").update(rest).eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}

export async function deleteQuizOX(id: string): Promise<boolean> {
  const { error } = await createClient().from("quiz_ox").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

/** 객관식 퀴즈 **/

export async function getQuizMCList(): Promise<{
  data?: QuizMC[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("quiz_mc")
    .select(
      `*,
      quiz_mc_tags!left (tag (id, name))
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    return { error };
  }

  const result = data.map((quiz) => ({
    ...quiz,
    tags: quiz.quiz_mc_tags
      ? (quiz.quiz_mc_tags.map((st: any) => st.tag) as Tag[])
      : [],
  }));

  return { data: result as QuizMC[] };
}

export async function getQuizMC(
  id: string
): Promise<{ data?: QuizMC; error?: Partial<PostgrestError> }> {
  const { data, error } = await supabase
    .from("quiz_mc")
    .select(`*, quiz_mc_tags!left (tag (id, name))`)
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
    tags: data[0].quiz_mc_tags
      ? (data[0].quiz_mc_tags.map((st: any) => st.tag) as Tag[])
      : [],
  };

  return { data: result as QuizMC };
}

export async function addQuizMC(postData: {
  content: string;
  choices: string[];
  answer: number;
  tags: Partial<Tag>[];
  image?: File;
  explanation?: string;
}): Promise<{ data?: QuizMC; error?: PostgrestError }> {
  const { image, tags, ...newQuizMC } = postData;
  const { data: quizMC, error: quizMCError } = await supabase
    .from("quiz_mc")
    .insert(newQuizMC)
    .select()
    .single();
  if (quizMCError || !quizMC) {
    return { error: quizMCError || undefined };
  }

  if (tags) {
    await supabase.from("quiz_ox_tags").insert(
      tags.map((tag) => ({
        quiz_id: quizMC.id,
        tag_id: tag.id,
      }))
    );
  }

  if (image) {
    const { data: imgUrl, error: imgError } = await addImageToStorage(
      "quiz",
      image,
      `${quizMC.id}/image.png`
    );
    if (imgError || !imgUrl) {
      return { error: imgError };
    }

    await supabase
      .from("quiz_ox")
      .update({ image: imgUrl })
      .eq("id", quizMC.id);

    quizMC.image = imgUrl;
  }

  return { data: quizMC as QuizMC };
}

export async function updateQuizMC(newQuizMC: {
  id: string;
  content?: string;
  choices?: string[];
  answer?: number;
  tags?: Partial<Tag>[];
  image?: string;
}): Promise<boolean> {
  const { id, tags, ...rest } = newQuizMC;

  if (tags) {
    console.log(tags, rest);
    await supabase.from("quiz_mc_tags").delete().eq("quiz_id", id);
    await supabase.from("quiz_mc_tags").insert(
      tags.map((tag) => ({
        quiz_id: id,
        tag_id: tag.id,
      }))
    );
  }
  if (rest) {
    const { error } = await supabase.from("quiz_mc").update(rest).eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}

export async function deleteQuizMC(id: string): Promise<boolean> {
  const { error } = await createClient().from("quiz_mc").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}
