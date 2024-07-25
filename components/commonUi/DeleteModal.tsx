"use client";
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
import React from "react";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteModal({
  title,
  desc,
  btnText,
  onClick,
  disabled,
  deleteOpen,
  setDeleteOpen,
  deleteLoading,
}) {
  //

  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className=" "
          disabled={disabled}
          variant="destructiveoutline"
        >
          <p>{btnText}</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          {btnText && (
            <Button onClick={onClick} variant="destructiveoutline">
              {deleteLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <p>{btnText}</p>
              )}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
