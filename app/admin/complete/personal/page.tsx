"use client";
import TableWrap from "@/components/commonUi/tableWrap";
import { columns } from "./_components/table/colums";
import { getMoreData, getPersonalData } from "./_components/table/actions";
// import TableWrapMonthly from "./_components/table/tableWrapMonthly";
import TableWrapPersonal from "./_components/table/tableWrapPersonal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CircleCheck, CircleMinus, CirclePlus, Loader2 } from "lucide-react";
import React from "react";
import { getSelectInitData } from "../../group/[groupId]/_components/actions";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { array, z } from "zod";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormLabelWrap from "@/components/formLabel";
import { toast } from "sonner";
const FormSchema = z.object({
  participants: z.array(
    z.object({
      _id: z.string(),
      username: z.string(),
      jobPosition: z.string(),
      email: z.string(),
    })
  ),
  dob: z.object({
    to: z.date().optional(),
    from: z.date().optional(),
  }),
});
export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [paricipantArray, setParticipant] = React.useState<any>([]);
  const [result, setResult] = React.useState<any>([]);
  const getSelectData = async () => {
    //
    let readers = await getSelectInitData();
    if (readers.data) {
      let participants = JSON.parse(readers.data.participants);

      setParticipant(participants);
    }
  };
  //
  React.useEffect(() => {
    getSelectData();
  }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      participants: [],
      dob: {},
    },
  });
  const {
    fields: participantsFields,
    append: participantsAppend,
    remove: participantsRemove,
    replace: participantsReplace,
  } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    console.log("data", data);
    try {
      if (data.participants.length > 0) {
        // let res = await getPersonalData(JSON.stringify(data));
        // if (res.data) {
        //   let newRows = JSON.parse(res.data);
        //   console.log("res", newRows);
        //   setResult(newRows);
        //   setOpen(true);
        //   //
        // }
      } else {
        toast.error("교육생을 선택하세요.");
      }
    } catch (e) {
      toast.error(e);
      //
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <TableWrapPersonal
          columns={columns}
          getMoreData={getMoreData}
          subMenu={true}
          placeHolder="이름 또는 이메일을 검색하세요."
          searchShow={true}
          height="h-[calc(100vh-220px)]"
        />
      </div>
    </div>
  );
}
