import Tag from "./tag";

type Study = {
  Row: {
    id: string;
    title: string;
    subtitle?: string;
    order?: number;
    tags?: Partial<Tag>[];
    image?: string;
    content?: string;
    updated_at: string;
    is_premium?: boolean;
    view_count?: number;
  };
  Insert: {
    title: string;
    subtitle?: string;
    tags?: Partial<Tag>[];
    image?: string;
    is_premium?: boolean;
  };
  Update: {
    id: string;
    title?: string;
    subtitle?: string;
    order?: number;
    tags?: Partial<Tag>[];
    image?: string;
    is_premium?: boolean;
  };
  Relationships: [];
};

export default Study;
