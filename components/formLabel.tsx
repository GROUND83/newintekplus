import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { FormLabel } from "./ui/form";
import { ExclamationCircleIcon as FillExclamtion } from "@heroicons/react/24/solid";
export default function FormLabelWrap({
  title,
  required,
}: {
  title: string;
  required: boolean;
}) {
  return (
    <FormLabel className="flex gap-1 flex-row items-center">
      {title}
      {required && <FillExclamtion className="size-5 text-primary" />}
    </FormLabel>
  );
}
