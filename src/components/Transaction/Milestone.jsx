"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/Input"; // Adjusted import path

// Define the columns for the table
const columns = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "jobtitle",
    header: "Job Title",
  },
  {
    accessorKey: "modulecount",
    header: "Module Count",
  },
  {
    accessorKey: "modulename",
    header: "Module Name",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
  {
    accessorKey: "status",
    header: "Status",
  }
];

// DataTable component to render the table
const DataTable = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-10 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Milestone</h1>
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
};

// Fetch data asynchronously
async function getData() {
  return Promise.resolve([
    {
      no: "1",
      jobtitle: "Job Title",
      modulecount: "Module Count",
      modulename: "Module Name",
      progress: "Progress",
      status: "Status"
    },
    {
      no: "2",
      jobtitle: "Job Title",
      modulecount: "Module Count",
      modulename: "Module Name",
      progress: "Progress",
      status: "Status"
    },
    // Add more data as needed
  ]);
}

// Main Page component
const Milestone = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Milestone;
