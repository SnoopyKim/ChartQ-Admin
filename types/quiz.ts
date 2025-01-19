import Tag from "./tag";

export type Quiz = QuizOX | QuizMC;

export type QuizOX = {
  answer: boolean;
  content: string;
  id: number;
  image?: string;
  explanation?: string;
  tags?: Tag[];
  updated_at: string;
};

export type QuizMC = {
  answer: number;
  choices: string[];
  content: string;
  id: number;
  image?: string;
  explanation?: string;
  tags?: Tag[];
  updated_at: string;
};
