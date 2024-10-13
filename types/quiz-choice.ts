type QuizChoice = {
  Row: {
    answer_idx: number;
    choices: string[];
    content: string;
    id: number;
    image: string | null;
    updated_at: string;
  };
  Insert: {
    answer_idx?: number;
    choices: string[];
    content?: string;
    id?: number;
    image?: string | null;
    updated_at?: string;
  };
  Update: {
    answer_idx?: number;
    choices?: string[];
    content?: string;
    id?: number;
    image?: string | null;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "quiz_choice_image_fkey";
      columns: ["image"];
      isOneToOne: false;
      referencedRelation: "buckets";
      referencedColumns: ["id"];
    },
  ];
};
