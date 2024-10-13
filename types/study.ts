type Study = {
  Row: {
    content: object;
    id: string;
    image: string | null;
    title: string;
    updated_at: string;
  };
  Insert: {
    content: object;
    id?: string;
    image?: string | null;
    title?: string;
    updated_at?: string;
  };
  Update: {
    content?: object;
    id?: string;
    image?: string | null;
    title?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "study_image_fkey";
      columns: ["image"];
      isOneToOne: false;
      referencedRelation: "buckets";
      referencedColumns: ["id"];
    },
  ];
};

export default Study;
