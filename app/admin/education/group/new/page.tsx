"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ko } from "date-fns/locale";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
const languagesArray = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
  dob: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      { required_error: "Date is required." }
    )
    .refine((date) => {
      return !!date.to;
    }, "End Date is required."),
});
export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        from: undefined,
        to: undefined,
      },
    },
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="p-3 flex-1 flex flex-col  w-full">
        <div className="bg-white border flex-1 w-full p-6 flex flex-col items-start gap-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>1. 그룹 설정</CardTitle>
                  <CardDescription>
                    그룹명과 교육기간, 리더, 참여자를 입력하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-3 w-full">
                  <div className="w-full grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field: { value, onChange } }) => (
                        <FormItem className="flex flex-col col-span-1">
                          <FormLabel>그룹명</FormLabel>
                          <Input value={value} onChange={onChange} />
                          {/* <FormDescription>
                          This is the language that will be used in the
                          dashboard.
                        </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-1">
                          <FormLabel>교육기간</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    <span>
                                      {dayjs(field.value.from).format(
                                        "YYYY-MM-DD"
                                      )}{" "}
                                      ~{" "}
                                      {dayjs(field.value.to).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </span>
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                locale={ko}
                                mode="range"
                                numberOfMonths={2}
                                defaultMonth={field.value.from}
                                selected={{
                                  from: field.value.from!,
                                  to: field.value.to,
                                }}
                                onSelect={field.onChange}
                                disabled={
                                  (date) => date < new Date()
                                  //   ||
                                  // date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          {/* <FormDescription>
                          Your date of birth is used to calculate your age.
                        </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>리더</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? languagesArray.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : "코스프로파일을 선택하세요."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command className="w-full">
                              <CommandInput
                                placeholder="코스프로파일을 검색하세요."
                                className="w-full"
                              />
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {languagesArray.map((language, index) => (
                                    <CommandItem
                                      value={language.label}
                                      key={index}
                                      onSelect={() => {
                                        form.setValue(
                                          "language",
                                          language.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <FormDescription>
                          This is the language that will be used in the
                          dashboard.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>참여자</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? languagesArray.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : "코스프로파일을 선택하세요."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command className="w-full">
                              <CommandInput
                                placeholder="코스프로파일을 검색하세요."
                                className="w-full"
                              />
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {languagesArray.map((language, index) => (
                                    <CommandItem
                                      value={language.label}
                                      key={index}
                                      onSelect={() => {
                                        form.setValue(
                                          "language",
                                          language.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <FormDescription>
                          This is the language that will be used in the
                          dashboard.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>2. 코스프로파일</CardTitle>
                  <CardDescription>
                    그룹에 배정할 코스프로파일을 선택하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? languagesArray.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : "코스프로파일을 선택하세요."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command className="w-full">
                              <CommandInput
                                placeholder="코스프로파일을 검색하세요."
                                className="w-full"
                              />
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {languagesArray.map((language, index) => (
                                    <CommandItem
                                      value={language.label}
                                      key={index}
                                      onSelect={() => {
                                        form.setValue(
                                          "language",
                                          language.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <FormDescription>
                          This is the language that will be used in the
                          dashboard.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit">생성</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
