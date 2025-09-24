export interface SurveyQuestion {
  id: string;
  question_text: string;
  question_description?: string;
  question_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  options?: SurveyOption[];
  response_count?: number;
}

export interface SurveyOption {
  id: string;
  question_id: string;
  option_text: string;
  option_value: string;
  option_order: number;
  is_active: boolean;
  created_at: string;
  response_count?: number;
  response_percentage?: number;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  question_id: string;
  option_id: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    created_at: string;
  };
  question?: SurveyQuestion;
  option?: SurveyOption;
}

export interface QuestionForm {
  question_text: string;
  question_description?: string;
  question_order?: number;
  is_active?: boolean;
}

export interface OptionForm {
  option_text: string;
  option_value: string;
  option_order?: number;
  is_active?: boolean;
}

export interface SurveyAnalytics {
  total_users: number;
  total_responses: number;
  response_rate: number;
  questions_with_stats: QuestionWithStats[];
  recent_responses: SurveyResponse[];
  response_trend: ResponseTrend[];
}

export interface QuestionWithStats {
  question: SurveyQuestion;
  total_responses: number;
  options_stats: OptionStats[];
}

export interface OptionStats {
  option: SurveyOption;
  response_count: number;
  percentage: number;
}

export interface ResponseTrend {
  date: string;
  count: number;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  include_user_info: boolean;
  date_from?: string;
  date_to?: string;
}

// View-based types for optimized queries
export interface SurveyOverviewStats {
  total_users: number;
  total_responses: number;
  response_rate: number;
  active_questions: number;
  active_options: number;
}

export interface SurveyQuestionSummary {
  question_id: string;
  question_text: string;
  question_order: number;
  is_active: boolean;
  question_created_at: string;
  total_responses: number;
  unique_respondents: number;
}

export interface SurveyOptionSummary {
  question_id: string;
  question_text: string;
  question_order: number;
  question_active: boolean;
  option_id: string;
  option_text: string;
  option_value: string;
  option_order: number;
  option_active: boolean;
  response_count: number;
  question_total_responses: number;
  percentage: number;
}

export interface SurveyRecentResponse {
  response_id: string;
  user_id: string;
  question_id: string;
  option_id: string;
  response_created_at: string;
  user_email: string;
  user_created_at: string;
  question_text: string;
  question_order: number;
  option_text: string;
  option_value: string;
}

export interface SurveyResponseStatsDaily {
  response_date: string;
  response_count: number;
}

export interface SurveyUserCompletionStatus {
  user_id: string;
  user_email: string;
  user_created_at: string;
  answered_questions: number;
  total_active_questions: number;
  is_completed: boolean;
  last_response_at: string | null;
}