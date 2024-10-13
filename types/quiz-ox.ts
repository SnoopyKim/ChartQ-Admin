type QuizOX = {
  Row: {
    answer: boolean | null;
    content: string;
    id: number;
    image: string | null;
    updated_at: string;
  };
  Insert: {
    answer?: boolean | null;
    content?: string;
    id?: number;
    image?: string | null;
    updated_at?: string;
  };
  Update: {
    answer?: boolean | null;
    content?: string;
    id?: number;
    image?: string | null;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "quiz_ox_image_fkey";
      columns: ["image"];
      isOneToOne: false;
      referencedRelation: "buckets";
      referencedColumns: ["id"];
    },
  ];
};
