"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const getColumns = (navigate) => [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "viewprofile",
    header: "",
    cell: ({ row }) => (
      <Button
        onClick={() => navigate(`/StackHolder/users/viewprofile`, {
          state: { username: row.original.username },
        })}
        variant="primary"
      >
        View Profile
      </Button>
    ),
  },
];

export function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Users</h1>
        <div className="flex w-1/4 mb-4">
          <Input placeholder="Search..." />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://192.168.0.156:3030/user_api/getAllUser");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedData = await response.json();
        const dataWithIndex = fetchedData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));

        setData(dataWithIndex);
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const columns = getColumns(navigate);

  if (loading) {
    return (
      <div className="h-dvh flex justify-center items-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={paginatedData} />

      {/* Pagination Component */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(pageIndex + 1)}
                  className={`${
                    pageIndex + 1 === currentPage
                      ? "bg-indigo-700 text-white"
                      : ""
                  }`}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Users;
