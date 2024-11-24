import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/shadcn/card";

interface StudyCardProps {
  title: string;
  image?: string;
  updatedAt: string;
}

export function StudyCard({ title, image, updatedAt }: StudyCardProps) {
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
      <CardFooter className="px-4 pb-2 pt-0 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(updatedAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}
