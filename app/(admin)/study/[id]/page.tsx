import { getStudy } from "@/services/study";
import StudyForm from "../study-form";
import EditorContainer from "@/components/ui/editor/container";

export default async function StudyEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step: string };
}) {
  const study = await getStudy(params.id);

  return (
    <div>
      <h1 className="mb-4">차트자료 편집</h1>
      {searchParams.step === "content" ? (
        <EditorContainer />
      ) : (
        <StudyForm study={study} />
      )}
    </div>
  );
}
