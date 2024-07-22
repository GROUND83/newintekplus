import { Button } from "@/components/ui/button";
import DataTable from "./_components/table/table";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-stretch flex-1  ">
      <div className="p-3 flex-1 flex flex-col  w-full">
        <div className="bg-white border flex-1 w-full p-6">
          <DataTable />
        </div>
      </div>
    </div>
  );
}
