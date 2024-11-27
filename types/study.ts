import Tag from "./tag";

type Study = {
  Row: {
    id: string;
    title: string;
    tags?: Partial<Tag>[];
    image?: string;
    content?: string;
    updated_at: string;
  };
  Insert: {
    title: string;
    tags?: Partial<Tag>[];
    image?: string;
  };
  Update: {
    id: string;
    title?: string;
    tags?: Partial<Tag>[];
    image?: string;
  };
  Relationships: [];
};

export default Study;
