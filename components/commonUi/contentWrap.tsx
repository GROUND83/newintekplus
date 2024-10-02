import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ContentWrap({ data }: { data: any }) {
  return (
    <div className="col-span-1 ">
      <div className="flex flex-col items-start w-full p-3 bg-white border rounded-lg">
        <p className="bg-primary/20 text-primary px-2 py-1 text-xs border border-primary">
          {data.type}
        </p>

        <div className="flex flex-col items-start w-full mt-3 gap-3">
          {data.lessonContendescription && (
            <p className="w-full truncate whitespace-pre-wrap">
              {data.lessonContendescription}
            </p>
          )}
          {data.link && (
            <a
              href={data.link}
              target="_blank"
              className="w-full truncate whitespace-pre-wrap underline text-primary"
            >
              {data.link}
            </a>
          )}
          {data.lessonContentdownloadURL && (
            <Button asChild size="sm" variant="defaultoutline">
              <a
                href={data.lessonContentdownloadURL}
                download={data.lessonContenFileName}
                target="_blank"
                className="flex flex-row items-center gap-2 w-full truncate "
              >
                <DownloadIcon className=" size-3" />
                <p className="w-full truncate ">{data.lessonContenFileName}</p>
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
