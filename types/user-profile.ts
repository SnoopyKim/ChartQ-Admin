import UserType from "@/types/user-type";
type Profile = {
  Row: {
    avatar_url: string | null;
    created_at: string | null;
    email: string | null;
    id: string;
    phone: string | null;
    type: keyof typeof UserType;
    updated_at: string | null;
    username: string | null;
  };
  Insert: {
    avatar_url?: string | null;
    created_at?: string | null;
    email?: string | null;
    id: string;
    phone?: string | null;
    type?: string;
    updated_at?: string | null;
    username?: string | null;
  };
  Update: {
    avatar_url?: string | null;
    created_at?: string | null;
    email?: string | null;
    id?: string;
    phone?: string | null;
    type?: string;
    updated_at?: string | null;
    username?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      isOneToOne: true;
      referencedRelation: "users";
      referencedColumns: ["id"];
    },
  ];
};

export default Profile;
