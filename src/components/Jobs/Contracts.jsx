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
    accessorKey: "freelancername",
    header: "Freelancer Name",
  },
  {
    accessorKey: "clientname",
    header: "Client Name",
  },
  {
    accessorKey: "jobtitle",
    header: "Job Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "jobamount",
    header: "Job Amount",
  },
  {
    accessorKey: "startingdate",
    header: "Starting Date",
  },
  {
    accessorKey: "endingdate",
    header: "Ending Date",
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
        <h1 className="text-2xl font-bold mb-4 text-[#FF8C8C]">Contracts</h1>
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
      freelancername: "Dhyanvas",
      clientname: "John Doe",
      jobtitle: "React Developer",
      description: "React Developer for a project",
      jobamount: "$500",
      startingdate: "2022-01-01",
      endingdate: "2022-01-31",
    },
    {
      no: "2",
      freelancername: "John Doe",
      clientname: "Jane Doe",
      jobtitle: "Node.js Developer",
      description: "Node.js Developer for a project",
      jobamount: "$600",
      startingdate: "2022-02-01",
      endingdate: "2022-02-28",
    },
    // Add more data as needed
  ]);
}

// Main Page component
const Contracts = () => {
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

export default Contracts;
