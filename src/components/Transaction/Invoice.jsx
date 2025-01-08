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
    accessorKey: "clientcompanynname",
    header: "Client Company Name",
  },
  {
    accessorKey: "clientname",
    header: "Client Name",
  },
  {
    accessorKey: "freelancername",
    header: "Freelancer Name",
  },
  {
    accessorKey: "freelanceridproof",
    header: "Freelancer ID Proof",
  },
  {
    accessorKey: "milestonetitle",
    header: "Milestone Title",
  },
  {
    accessorKey: "milestonepaymentamount",
    header: "Milestone Payment Amount",
  },
  {
    accessorKey: "portalcommission",
    header: "Portal Commission",
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
        <h1 className="text-2xl font-bold mb-4 text-[#FF8C8C]">Invoice</h1>
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
      clientcompanynname: "ABC Company",
      clientname: "John Doe",
      freelancername: "Dhyanvas",
      freelanceridproof: "ID Proof",
      milestonetitle: "Milestone Title",
      milestonepaymentamount: "$200",
      portalcommission: "$20"
    },
    {
      no: "2",
      clientcompanynname: "XYZ Company",
      clientname: "Jane Doe",
      freelancername: "John Doe",
      freelanceridproof: "ID Proof",
      milestonetitle: "Milestone Title",
      milestonepaymentamount: "$300",
      portalcommission: "$30"
    },
    // Add more data as needed
  ]);
}

// Main Page component
const Invoice = () => {
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

export default Invoice;
