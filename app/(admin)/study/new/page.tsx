"use client";

import StudyForm from "../study-form";
import { addStudy } from "@/services/study";

export default function NewStudyPage() {
  const addNewStudy = async (study: any) => {
    await addStudy(study);
    alert("추가 완료!");
    window.history.back();
  };

  return (
    <div>
      <h1 className="mb-4">차트자료 추가</h1>

      <StudyForm onSubmit={addNewStudy} />
    </div>
  );
}
