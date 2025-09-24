import { createClient } from "@/utils/supabase/client";
import {
  SurveyQuestion,
  SurveyOption,
  SurveyResponse,
  QuestionForm,
  OptionForm,
  SurveyAnalytics,
  QuestionWithStats,
  ResponseTrend,
  ExportOptions,
  SurveyOverviewStats,
  SurveyQuestionSummary,
  SurveyOptionSummary,
  SurveyRecentResponse,
  SurveyResponseStatsDaily,
} from "@/types/survey";
import { PostgrestError } from "@supabase/supabase-js";

const supabase = createClient();

// Questions CRUD
export async function getQuestions(includeOptions = true): Promise<{
  data?: SurveyQuestion[];
  error?: PostgrestError;
}> {
  if (includeOptions) {
    const { data, error } = await supabase
      .from("survey_questions")
      .select("*, survey_options(*)")
      .order("question_order", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error);
      return { error };
    }

    const formattedData = data?.map((question: any) => ({
      ...question,
      options: question.survey_options || [],
    }));

    return { data: formattedData as SurveyQuestion[] };
  } else {
    const { data, error } = await supabase
      .from("survey_questions")
      .select("*")
      .order("question_order", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error);
      return { error };
    }

    return { data: data as SurveyQuestion[] };
  }
}

export async function getQuestion(id: string): Promise<{
  data?: SurveyQuestion;
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_questions")
    .select("*, survey_options(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching question:", error);
    return { error };
  }

  const formattedData = {
    ...data,
    options: (data as any).survey_options || [],
  };

  return { data: formattedData as SurveyQuestion };
}

export async function createQuestion(
  questionData: QuestionForm,
  options?: OptionForm[]
): Promise<{
  data?: SurveyQuestion;
  error?: PostgrestError;
}> {
  // Get the next order number if not provided
  let question_order = questionData.question_order;
  if (question_order === undefined) {
    const { data: maxOrderData } = await supabase
      .from("survey_questions")
      .select("question_order")
      .order("question_order", { ascending: false })
      .limit(1);

    question_order =
      maxOrderData && maxOrderData.length > 0
        ? maxOrderData[0].question_order + 1
        : 1;
  }

  const { data: question, error: questionError } = await supabase
    .from("survey_questions")
    .insert({
      question_text: questionData.question_text,
      question_order,
      is_active: questionData.is_active ?? true,
    })
    .select()
    .single();

  if (questionError || !question) {
    console.error("Error creating question:", questionError);
    return { error: questionError || undefined };
  }

  // Add options if provided
  if (options && options.length > 0) {
    const optionsToInsert = options.map((option, index) => ({
      question_id: question.id,
      option_text: option.option_text,
      option_value: option.option_value,
      option_order: option.option_order ?? index + 1,
      is_active: option.is_active ?? true,
    }));

    const { error: optionsError } = await supabase
      .from("survey_options")
      .insert(optionsToInsert);

    if (optionsError) {
      console.error("Error creating options:", optionsError);
      // Rollback question creation
      await supabase.from("survey_questions").delete().eq("id", question.id);
      return { error: optionsError };
    }
  }

  return getQuestion(question.id);
}

export async function updateQuestion(
  id: string,
  questionData: Partial<QuestionForm>
): Promise<{
  data?: SurveyQuestion;
  error?: PostgrestError;
}> {
  const { error } = await supabase
    .from("survey_questions")
    .update({
      ...questionData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating question:", error);
    return { error };
  }

  return getQuestion(id);
}

export async function deleteQuestion(id: string): Promise<{
  success: boolean;
  error?: PostgrestError;
}> {
  const { error } = await supabase
    .from("survey_questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting question:", error);
    return { success: false, error };
  }

  return { success: true };
}

export async function reorderQuestions(
  questions: { id: string; question_order: number }[]
): Promise<{
  success: boolean;
  error?: PostgrestError;
}> {
  const updates = questions.map((q) =>
    supabase
      .from("survey_questions")
      .update({
        question_order: q.question_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", q.id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    const firstError = results.find((r) => r.error)?.error;
    console.error("Error reordering questions:", firstError);
    return { success: false, error: firstError || undefined };
  }

  return { success: true };
}

// Options CRUD
export async function createOption(
  questionId: string,
  optionData: OptionForm
): Promise<{
  data?: SurveyOption;
  error?: PostgrestError;
}> {
  // Get the next order number if not provided
  let option_order = optionData.option_order;
  if (option_order === undefined) {
    const { data: maxOrderData } = await supabase
      .from("survey_options")
      .select("option_order")
      .eq("question_id", questionId)
      .order("option_order", { ascending: false })
      .limit(1);

    option_order =
      maxOrderData && maxOrderData.length > 0
        ? maxOrderData[0].option_order + 1
        : 1;
  }

  const { data, error } = await supabase
    .from("survey_options")
    .insert({
      question_id: questionId,
      option_text: optionData.option_text,
      option_value: optionData.option_value,
      option_order,
      is_active: optionData.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating option:", error);
    return { error };
  }

  return { data: data as SurveyOption };
}

export async function updateOption(
  id: string,
  optionData: Partial<OptionForm>
): Promise<{
  data?: SurveyOption;
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_options")
    .update(optionData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating option:", error);
    return { error };
  }

  return { data: data as SurveyOption };
}

export async function deleteOption(id: string): Promise<{
  success: boolean;
  error?: PostgrestError;
}> {
  const { error } = await supabase.from("survey_options").delete().eq("id", id);

  if (error) {
    console.error("Error deleting option:", error);
    return { success: false, error };
  }

  return { success: true };
}

export async function reorderOptions(
  options: { id: string; option_order: number }[]
): Promise<{
  success: boolean;
  error?: PostgrestError;
}> {
  const updates = options.map((o) =>
    supabase
      .from("survey_options")
      .update({ option_order: o.option_order })
      .eq("id", o.id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    const firstError = results.find((r) => r.error)?.error;
    console.error("Error reordering options:", firstError);
    return { success: false, error: firstError || undefined };
  }

  return { success: true };
}

// Responses and Analytics
export async function getResponses(filters?: {
  user_id?: string;
  question_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}): Promise<{
  data?: SurveyResponse[];
  error?: PostgrestError;
}> {
  let query = supabase
    .from("survey_responses")
    .select(
      `
      *,
      users:user_id (id, email, created_at),
      survey_questions:question_id (*),
      survey_options:option_id (*)
    `
    )
    .order("created_at", { ascending: false });

  if (filters?.user_id) {
    query = query.eq("user_id", filters.user_id);
  }
  if (filters?.question_id) {
    query = query.eq("question_id", filters.question_id);
  }
  if (filters?.date_from) {
    query = query.gte("created_at", filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte("created_at", filters.date_to);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching responses:", error);
    return { error };
  }

  const formattedData = data?.map((response) => ({
    ...response,
    user: response.users,
    question: response.survey_questions,
    option: response.survey_options,
  }));

  return { data: formattedData as SurveyResponse[] };
}

// View-based helper functions for optimized queries
export async function getSurveyOverviewStats(): Promise<{
  data?: SurveyOverviewStats;
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_overview_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching survey overview stats:", error);
    return { error };
  }

  return { data: data as SurveyOverviewStats };
}

export async function getSurveyOptionSummaries(): Promise<{
  data?: SurveyOptionSummary[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_option_response_summary")
    .select("*")
    .eq("question_active", true)
    .eq("option_active", true)
    .order("question_order")
    .order("option_order");

  if (error) {
    console.error("Error fetching survey option summaries:", error);
    return { error };
  }

  return { data: data as SurveyOptionSummary[] };
}

export async function getSurveyRecentResponses(limit = 10): Promise<{
  data?: SurveyRecentResponse[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_recent_responses")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("Error fetching recent responses:", error);
    return { error };
  }

  return { data: data as SurveyRecentResponse[] };
}

export async function getSurveyResponseTrend(days = 7): Promise<{
  data?: SurveyResponseStatsDaily[];
  error?: PostgrestError;
}> {
  const { data, error } = await supabase
    .from("survey_response_stats_daily")
    .select("*")
    .order("response_date", { ascending: false })
    .limit(days);

  if (error) {
    console.error("Error fetching response trend:", error);
    return { error };
  }

  return { data: data as SurveyResponseStatsDaily[] };
}

export async function getSurveyAnalytics(): Promise<{
  data?: SurveyAnalytics;
  error?: PostgrestError;
}> {
  try {
    // Use Promise.all for parallel execution of optimized view queries
    const [overviewResult, optionSummariesResult, recentResponsesResult, trendResult] = 
      await Promise.all([
        getSurveyOverviewStats(),
        getSurveyOptionSummaries(),
        getSurveyRecentResponses(10),
        getSurveyResponseTrend(7),
      ]);

    // Check for errors
    if (overviewResult.error) throw overviewResult.error;
    if (optionSummariesResult.error) throw optionSummariesResult.error;
    if (recentResponsesResult.error) throw recentResponsesResult.error;
    if (trendResult.error) throw trendResult.error;

    const overview = overviewResult.data!;
    const optionSummaries = optionSummariesResult.data || [];
    const recentResponses = recentResponsesResult.data || [];
    const trendData = trendResult.data || [];

    // Group option summaries by question to reconstruct the expected format
    const questionMap = new Map<string, QuestionWithStats>();
    
    optionSummaries.forEach((optionSummary) => {
      const questionId = optionSummary.question_id;
      
      if (!questionMap.has(questionId)) {
        questionMap.set(questionId, {
          question: {
            id: questionId,
            question_text: optionSummary.question_text,
            question_order: optionSummary.question_order,
            is_active: optionSummary.question_active,
            created_at: "",
            updated_at: "",
          },
          total_responses: optionSummary.question_total_responses,
          options_stats: [],
        });
      }

      const questionStats = questionMap.get(questionId)!;
      questionStats.options_stats.push({
        option: {
          id: optionSummary.option_id,
          question_id: optionSummary.question_id,
          option_text: optionSummary.option_text,
          option_value: optionSummary.option_value,
          option_order: optionSummary.option_order,
          is_active: optionSummary.option_active,
          created_at: "",
        },
        response_count: optionSummary.response_count,
        percentage: optionSummary.percentage,
      });
    });

    const questionsWithStats = Array.from(questionMap.values())
      .sort((a, b) => a.question.question_order - b.question.question_order);

    // Convert recent responses to expected format
    const formattedRecentResponses: SurveyResponse[] = recentResponses.map((response) => ({
      id: response.response_id,
      user_id: response.user_id,
      question_id: response.question_id,
      option_id: response.option_id,
      created_at: response.response_created_at,
      user: {
        id: response.user_id,
        email: response.user_email,
        created_at: response.user_created_at,
      },
      question: {
        id: response.question_id,
        question_text: response.question_text,
        question_order: response.question_order,
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      option: {
        id: response.option_id,
        question_id: response.question_id,
        option_text: response.option_text,
        option_value: response.option_value,
        option_order: 0,
        is_active: true,
        created_at: "",
      },
    }));

    // Create response trend in expected format (fill missing days with 0)
    const responseTrend: ResponseTrend[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayData = trendData.find(d => d.response_date === dateStr);
      responseTrend.push({
        date: dateStr,
        count: dayData?.response_count || 0,
      });
    }

    return {
      data: {
        total_users: overview.total_users,
        total_responses: overview.total_responses,
        response_rate: overview.response_rate,
        questions_with_stats: questionsWithStats,
        recent_responses: formattedRecentResponses,
        response_trend: responseTrend,
      },
    };
  } catch (error) {
    console.error("Error fetching survey analytics:", error);
    return { error: error as PostgrestError };
  }
}

export async function exportResponses(options: ExportOptions): Promise<{
  data?: string;
  error?: Error;
}> {
  try {
    // Get responses with filters
    const { data: responses, error } = await getResponses({
      date_from: options.date_from,
      date_to: options.date_to,
    });

    if (error) throw error;

    if (!responses || responses.length === 0) {
      throw new Error("No responses to export");
    }

    // Format data for CSV
    const headers = options.include_user_info
      ? [
          "Response ID",
          "User ID",
          "User Email",
          "Question",
          "Answer",
          "Response Date",
        ]
      : ["Response ID", "Question", "Answer", "Response Date"];

    const rows = responses.map((r) => {
      const baseRow = [
        r.id,
        r.question?.question_text || "",
        r.option?.option_text || "",
        new Date(r.created_at).toLocaleString(),
      ];

      if (options.include_user_info) {
        return [
          r.id,
          r.user_id,
          r.user?.email || "",
          r.question?.question_text || "",
          r.option?.option_text || "",
          new Date(r.created_at).toLocaleString(),
        ];
      }

      return baseRow;
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // For Excel format, we'd need to use a library like xlsx
    // For now, we'll return CSV for both formats
    return { data: csvContent };
  } catch (error) {
    console.error("Error exporting responses:", error);
    return { error: error as Error };
  }
}
