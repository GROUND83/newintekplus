import { Button } from "@/components/ui/button";
import DataTable from "./_components/table/table";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full ">
      <div className="  flex-1 w-full  relative ">
        <DataTable />
      </div>
    </div>
  );
}
