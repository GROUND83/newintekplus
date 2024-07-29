import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ContentWrap({ data }: { data: any }) {
  return (
    <div className="col-span-1 ">
      <div className="flex flex-col items-start w-full p-3 bg-white border rounded-lg">
        <p className="bg-primary text-white px-2 py-1 text-xs">{data.type}</p>

        <div className="flex flex-col items-start w-full mt-3 gap-3">
          {data.lessonContendescription && (
            <p className="w-full truncate whitespace-pre-wrap">
              {data.lessonContendescription}
            </p>
          )}
          {data.link && (
            <p className="w-full truncate whitespace-pre-wrap">{data.link}</p>
          )}
          {data.lessonContentdownloadURL && (
            <Button asChild size="sm">
              <a
                href={data.lessonContentdownloadURL}
                download={data.lessonContenFileName}
                target="_blank"
              >
                {data.lessonContenFileName}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
