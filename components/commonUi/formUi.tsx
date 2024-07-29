import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export function FormSubmitButton({
  title,
  form,
  loading,
}: {
  title: string;
  form: any;
  loading: boolean;
}) {
  return (
    <Button type="submit" disabled={!form.formState.isDirty || loading}>
      {loading ? <Loader2 className="size-4" /> : <p>{title}</p>}
    </Button>
  );
}
