import { signOutAction } from "@/app/actions";
import Button from ".";

export default async function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={"outline"}>
        로그아웃
      </Button>
    </form>
  );
}
