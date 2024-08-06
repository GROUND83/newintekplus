import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function DownLoadButton({
  downLoadUrl,
  fileName,
}: {
  downLoadUrl: string;
  fileName: string;
}) {
  return (
    <Button asChild size="xs" variant="defaultoutline" type="button">
      <a
        href={downLoadUrl}
        download={fileName}
        target="_blank"
        className="flex flex-row items-center gap-2"
      >
        <DownloadIcon className="size-3" />
        {fileName}
      </a>
    </Button>
  );
}
