"use server";

import UserType from "@/types/user-type";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  if (data && data.user?.id) {
    const id = data.user.id;
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", id)
      .single();

    if (profile.type !== UserType.ADMIN) {
      return redirect("/access-denied");
    }
  }

  return redirect("/");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
