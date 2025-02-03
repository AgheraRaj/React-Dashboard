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

const getColumns = (navigate) => [
  { accessorKey: "no", header: "No." },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "skills_required", header: "Skills Required" },
  { accessorKey: "providers_name", header: "Providers Name" },
  { accessorKey: "providers_email", header: "Providers Email" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "amount", header: "Amount" },
];

export function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-10">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

function AllJobs() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await fetch(`${url}/jobs/Jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const fetchedData = await response.json();
        const indexedData = fetchedData.map((item, index) => ({ ...item, no: index + 1 }));

        setData(indexedData);
        setFilteredData(indexedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered results and suggestions as user types
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((job) =>
        Object.values(job).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredData(filtered);

      // Generate suggestions based on any field as user types
      const allFields = filtered.flatMap((job) =>
        Object.keys(job).map((key) => `${job[key]}`).filter(Boolean)
      );
      const uniqueSuggestions = [...new Set(allFields)].slice(0, 5); // Limit to 5 suggestions
      setSuggestions(uniqueSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if search term is empty
    }
    setCurrentPage(1);
  }, [searchTerm, data]);

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]); // Hide suggestions
  };

  const columns = getColumns(navigate);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      {/* Search Input with Autocomplete */}
      <div className="flex justify-between items-center mb-4 mx-10 relative">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">All Jobs</h1>
        <div className="relative">
          <Input
            className="w-72"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white shadow-lg border rounded-md mt-1 w-full">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-600"></div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="h-screen flex justify-center items-center">
          <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">
            ⚠️ Error: {error}
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && <DataTable columns={columns} data={paginatedData} />}

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
                    pageIndex + 1 === currentPage ? "bg-indigo-700 text-white" : ""
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default AllJobs;
