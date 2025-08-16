import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import Study from "@/types/study";
import { StudyViewCount } from "./study-view-count";

interface StudyCardProps {
  study: Study["Row"];
}

export function StudyCard({ study }: StudyCardProps) {
  const placeholderImage = "/placeholder/image.svg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={study.image || placeholderImage}
            alt={study.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {study.is_premium && (
            <div className="absolute top-2 right-2">
              <PremiumBadge />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold line-clamp-1">
            {study.title}
          </h3>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-2 pt-0 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(study.updated_at).toLocaleDateString()}
        </span>
        <StudyViewCount studyId={study.id} compact />
      </CardFooter>
    </Card>
  );
}

const PremiumBadge = () => {
  return (
    <div className="px-2 py-1.5 rounded-md bg-gradient-to-r from-black to-[#2BB368] text-white text-[10px] font-bold">
      Premium
    </div>
  );
};
