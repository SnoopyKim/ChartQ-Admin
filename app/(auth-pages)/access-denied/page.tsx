import { signOutAction } from "@/app/actions";
import { SubmitButton } from "@/components/ui/button/submit";

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col h-full gap-4 justify-center items-center">
      <h1 className="text-red-500">접근 금지</h1>
      <p>해당 페이지는 관리자를 위한 페이지입니다.</p>
      <SubmitButton formAction={signOutAction} pendingText="Signing Out...">
        로그아웃
      </SubmitButton>
    </div>
  );
}
