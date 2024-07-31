import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export function FormSubmitButton({
  title,
  form,
  loading,
  disabled,
}: {
  title: string;
  form: any;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={!form.formState.isDirty || loading || disabled}
    >
      {loading ? <Loader2 className="size-4" /> : <p>{title}</p>}
    </Button>
  );
}
