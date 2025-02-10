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
import { useLocation } from "react-router-dom";

export const columns = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "freelancerName",
    header: "Freelancer Name",
  },
  {
    accessorKey: "freelancerEmail",
    header: "Freelancer Email",
  },
  {
    accessorKey: "bid",
    header: "Bid",
  },
  {
    accessorKey: "finishingTime",
    header: "Finishing Time",
    cell: ({ getValue }) => {
      const timestamp = getValue();
      return new Date(timestamp).toLocaleDateString(); // Format date
    },
  },
  {
    accessorKey: "review",
    header: "Rating",
  },
];

export function DataTable({ columns, data, title }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Proposals for Job: {title}</h1>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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

function ProposalsDetails() {
  const location = useLocation();
  const { proposals, title } = location.state || {};

  // Validate if proposals and title exist
  if (!proposals || !title) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">
          ⚠️ No data available. Please navigate from the All Jobs page.
        </div>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Add index to each proposal for the "No." column
  const indexedProposals = proposals.map((proposal, index) => ({
    ...proposal,
    no: index + 1,
  }));

  // Pagination logic
  const totalPages = Math.ceil(indexedProposals.length / rowsPerPage);
  const paginatedProposals = indexedProposals.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      {/* Render the DataTable */}
      <DataTable columns={columns} data={paginatedProposals} title={title} />

      {/* Pagination Component */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageIndex + 1)}
                  isActive={currentPage === pageIndex + 1}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
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

export default ProposalsDetails;