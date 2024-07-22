import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-screen h-screen p-16">
      <p>UI</p>
      <p>default</p>
      <div className="flex flex-row items-center gap-2">
        <Button size={"xs"}> default 버튼</Button>
        <Button> default 버튼</Button>
        <Button variant={"secondary"}> secondary 버튼</Button>
        <Button variant={"destructive"}> destructive 버튼</Button>
        <Button variant={"destructiveoutline"}> secondary 버튼</Button>
        <Button variant={"destructive"}> destructive 버튼</Button>
        <Button variant={"outline"}> outline 버튼</Button>
        <Button variant={"ghost"}> ghost 버튼</Button>
        <Button variant={"link"}> link 버튼</Button>
      </div>
    </div>
  );
}
