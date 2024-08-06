"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
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
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ProfileComponent from "@/components/commonUi/profileComponent";
export default function Page() {
  const session = useSession();
  console.log("session", session);
  return <ProfileComponent />;
}
