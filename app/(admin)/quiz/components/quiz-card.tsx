import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/shadcn/card";
import Tag from "@/types/tag";
import { Badge } from "@/components/shadcn/badge";

interface QuizCardProps {
  title: string;
  image?: string;
  tags?: Tag[];
}

export function QuizCard({ title, image, tags }: QuizCardProps) {
  const placeholderImage = "/placeholder/image.svg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={image || placeholderImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <h3 className="text-base font-semibold line-clamp-1">{title}</h3>
      </CardContent>
      <CardFooter className="px-4 pb-2 pt-0 flex items-center">
        {tags ? (
          tags.map((tag) => (
            <Badge key={tag.id} variant={"outline"}>
              {tag.name}
            </Badge>
          ))
        ) : (
          <Badge variant={"outline"}>태그 없음</Badge>
        )}
      </CardFooter>
    </Card>
  );
}
