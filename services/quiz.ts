import Tag from "@/types/tag";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { addImageToStorage } from "./study";
import { QuizOX, QuizChoice } from "@/types/quiz";

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

export async function getQuizChoiceList(): Promise<{
  data?: QuizChoice[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("quiz_choice")
    .select(
      `*,
      quiz_choice_tags!left (tag (id, name))
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    return { error };
  }

  const result = data.map((quiz) => ({
    ...quiz,
    tags: quiz.quiz_choice_tags
      ? (quiz.quiz_choice_tags.map((st: any) => st.tag) as Tag[])
      : [],
  }));

  return { data: result as QuizChoice[] };
}

export async function getQuizChoice(
  id: string
): Promise<{ data?: QuizChoice; error?: Partial<PostgrestError> }> {
  const { data, error } = await supabase
    .from("quiz_choice")
    .select(`*, quiz_choice_tags!left (tag (id, name))`)
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
    tags: data[0].quiz_choice_tags
      ? (data[0].quiz_choice_tags.map((st: any) => st.tag) as Tag[])
      : [],
  };

  return { data: result as QuizChoice };
}

export async function addQuizChoice(postData: {
  content: string;
  choices: string[];
  answer: number;
  tags: Partial<Tag>[];
  image?: File;
}): Promise<{ data?: QuizChoice; error?: PostgrestError }> {
  const { image, tags, ...newQuizChoice } = postData;
  const { data: quizChoice, error: quizChoiceError } = await supabase
    .from("quiz_choice")
    .insert(newQuizChoice)
    .select()
    .single();
  if (quizChoiceError || !quizChoice) {
    return { error: quizChoiceError || undefined };
  }

  if (tags) {
    await supabase.from("quiz_ox_tags").insert(
      tags.map((tag) => ({
        quiz_id: quizChoice.id,
        tag_id: tag.id,
      }))
    );
  }

  if (image) {
    const { data: imgUrl, error: imgError } = await addImageToStorage(
      "quiz",
      image,
      `${quizChoice.id}/image.png`
    );
    if (imgError || !imgUrl) {
      return { error: imgError };
    }

    await supabase
      .from("quiz_ox")
      .update({ image: imgUrl })
      .eq("id", quizChoice.id);

    quizChoice.image = imgUrl;
  }

  return { data: quizChoice as QuizChoice };
}

export async function updateQuizChoice(newQuizChoice: {
  id: string;
  content?: string;
  choices?: string[];
  answer?: number;
  tags?: Partial<Tag>[];
  image?: string;
}): Promise<boolean> {
  const { id, tags, ...rest } = newQuizChoice;

  if (tags) {
    console.log(tags, rest);
    await supabase.from("quiz_choice_tags").delete().eq("quiz_id", id);
    await supabase.from("quiz_choice_tags").insert(
      tags.map((tag) => ({
        quiz_id: id,
        tag_id: tag.id,
      }))
    );
  }
  if (rest) {
    const { error } = await supabase
      .from("quiz_choice")
      .update(rest)
      .eq("id", id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}

export async function deleteQuizChoice(id: string): Promise<boolean> {
  const { error } = await createClient()
    .from("quiz_choice")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}
