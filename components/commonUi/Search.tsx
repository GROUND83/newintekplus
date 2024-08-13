import React from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";

import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";

export default function Search({ placeHolder }: { placeHolder: string }) {
  const searchParams = useSearchParams();
  const searchParamdata = searchParams.get("search") || "";
  const [search, setSearch] = React.useState(
    searchParamdata ? searchParamdata : ""
  );
  //
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  //
  const debouncedhandelSearchSumbit = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 1000);

  //
  React.useEffect(() => {
    debouncedhandelSearchSumbit();
  }, [search]);

  return (
    <div className="flex flex-row items-center justify-between space-x-2  h-[50px] bg-neutral-100 border-b px-3 border-t">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeHolder}
        className="text-xs"
      />
    </div>
  );
}
