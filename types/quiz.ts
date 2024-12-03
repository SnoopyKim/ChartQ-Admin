import Tag from "./tag";

export type Quiz = QuizOX | QuizChoice;

export type QuizOX = {
  answer: boolean;
  content: string;
  id: number;
  image?: string;
  tags?: Tag[];
  updated_at: string;
};

export type QuizChoice = {
  answer: number;
  choices: string[];
  content: string;
  id: number;
  image?: string;
  tags?: Tag[];
  updated_at: string;
};
