type Study = {
  Row: {
    id: string;
    title: string;
    category?: string;
    image?: string;
    content?: string;
    updated_at: string;
  };
  Insert: {
    title: string;
    category: string;
    image?: string;
  };
  Update: {
    id: string;
    title?: string;
    category?: string;
    image?: string;
  };
  Relationships: [];
};

export default Study;
