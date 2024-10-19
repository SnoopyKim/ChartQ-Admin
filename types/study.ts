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
  Relationships: [];
};

export default Study;
