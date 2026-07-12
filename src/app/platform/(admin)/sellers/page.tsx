import { getSellers } from "@/lib/actions/platform.actions";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleSellerStatus, deleteSeller } from "@/lib/actions/platform.actions";

export default async function SellersPage(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const status = searchParams?.status || "ALL";

  const sellers = await getSellers(query, status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Sellers</h1>
          <p className="text-sm text-zinc-500">Manage platform users and their stores.</p>
        </div>
        <Link href="/platform/sellers/new" className="inline-flex h-9 px-4 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 text-sm font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Add Seller
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b p-4">
          <form className="relative flex-1 sm:max-w-xs" action="/platform/sellers">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search sellers or stores..."
              className="pl-9"
            />
            {status !== "ALL" && <input type="hidden" name="status" value={status} />}
          </form>
          
          <div className="flex gap-2">
            <Link href={`/platform/sellers?q=${query}`} className={`inline-flex h-8 px-3 items-center justify-center rounded-md text-xs font-medium border ${status === "ALL" ? "bg-zinc-100 border-transparent text-zinc-900" : "bg-transparent border-input text-zinc-900 hover:bg-zinc-100"}`}>
              All
            </Link>
            <Link href={`/platform/sellers?q=${query}&status=ACTIVE`} className={`inline-flex h-8 px-3 items-center justify-center rounded-md text-xs font-medium border ${status === "ACTIVE" ? "bg-zinc-100 border-transparent text-zinc-900" : "bg-transparent border-input text-zinc-900 hover:bg-zinc-100"}`}>
              Active
            </Link>
            <Link href={`/platform/sellers?q=${query}&status=SUSPENDED`} className={`inline-flex h-8 px-3 items-center justify-center rounded-md text-xs font-medium border ${status === "SUSPENDED" ? "bg-zinc-100 border-transparent text-zinc-900" : "bg-transparent border-input text-zinc-900 hover:bg-zinc-100"}`}>
              Suspended
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                  No sellers found.
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div className="font-medium text-zinc-900">{seller.name || "Unknown"}</div>
                    <div className="text-sm text-zinc-500">{seller.email}</div>
                  </TableCell>
                  <TableCell>
                    {seller.store ? (
                      <div>
                        <div className="font-medium text-zinc-900">{seller.store.name}</div>
                        <div className="text-sm text-zinc-500 text-muted-foreground">/{seller.store.slug}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-400">No store setup</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {format(new Date(seller.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={seller.status === "ACTIVE" ? "default" : "destructive"}>
                      {seller.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/platform/sellers/${seller.id}/edit`} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          Edit Details
                        </Link>
                        <DropdownMenuSeparator />
                        <form action={async () => {
                          "use server";
                          await toggleSellerStatus(seller.id);
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem>
                              {seller.status === "ACTIVE" ? (
                                <><ShieldAlert className="mr-2 h-4 w-4 text-orange-600" /> Suspend Access</>
                              ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Reactivate Access</>
                              )}
                            </DropdownMenuItem>
                          </button>
                        </form>
                        <DropdownMenuSeparator />
                        <form action={async () => {
                          "use server";
                          await deleteSeller(seller.id);
                        }}>
                          <button type="submit" className="w-full text-left text-red-600">
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              Delete Seller
                            </DropdownMenuItem>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
