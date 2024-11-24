import { signOutAction } from "@/app/actions";
import { Button } from "@/components/shadcn/button";

export default async function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={"ghost"} size={"default"}>
        로그아웃
      </Button>
    </form>
  );
}
