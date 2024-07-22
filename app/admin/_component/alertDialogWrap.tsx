import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, XIcon } from "lucide-react";
import React from "react";
export default function AlertDialogWrap({
  btnTitle,
  title,
  description,
  okTitle,
  onClick,
  disabled,
  loading,
  deleteBtn,
}) {
  const [open, setOpen] = React.useState(false);

  //

  React.useEffect(() => {
    if (loading) {
      //
    } else {
      setOpen(false);
    }
  }, [loading]);
  return (
    <AlertDialog open={open}>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        size="sm"
        variant={deleteBtn === true ? "outline" : "default"}
      >
        {deleteBtn ? <XIcon className="size-4" /> : <p>{btnTitle}</p>}
      </Button>
      {/* <AlertDialogTrigger disabled={disabled}>{btnTitle}</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            취소
          </Button>
          <Button
            variant={deleteBtn === true ? "destructive" : "default"}
            onClick={() => {
              onClick();
              //   setOpen(false);
            }}
          >
            {loading ? <Loader2 className=" animate-spin" /> : <p>{okTitle}</p>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
