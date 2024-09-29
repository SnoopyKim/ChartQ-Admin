import { signOutAction } from "@/app/actions";
import Button from ".";

export default async function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant={"text"}
        size={"sm"}
        className="text-red-500"
      >
        로그아웃
      </Button>
    </form>
  );
}
