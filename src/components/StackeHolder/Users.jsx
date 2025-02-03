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
  { accessorKey: "no", header: "No." },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "viewprofile",
    header: "",
    cell: ({ row }) => (
      <Button
        onClick={() =>
          navigate(`/StackHolder/users/viewprofile`, {
            state: { username: row.original.username },
          })
        }
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

function Users() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [suggestions, setSuggestions] = useState([]); // Suggestions state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_URL;

  // Function to fetch filtered data when the search button is clicked
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");

      // API Call with search query
      const response = await fetch(`${url}/user_api/getAllUser?keyword=${searchTerm}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const fetchedData = await response.json();
      setData(fetchedData.map((item, index) => ({ ...item, no: index + 1 })));
      setFilteredData(fetchedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Update filtered results and suggestions as user types
  useEffect(() => {
    if (searchTerm) {
      // Filter data based on the search term across multiple fields
      const filtered = data.filter((user) =>
        Object.values(user).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredData(filtered);

      // Generate suggestions from all fields (username, email, status, role)
      const allFields = filtered.flatMap((user) =>
        Object.keys(user).map((key) => `${user[key]}`).filter(Boolean)
      );
      const uniqueSuggestions = [...new Set(allFields)].slice(0, 5); // Limit to 5 suggestions
      setSuggestions(uniqueSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if search term is empty
      setFilteredData(data); // Reset filtered data if search term is empty
    }
    setCurrentPage(1); // Reset to first page when search term changes
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
      {/* Search Input and Button */}
      <div className="flex justify-between items-center mb-4 mx-10 relative">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Users</h1>
        <div className="relative">
          <Input
            className="w-72"
            placeholder="Search by username, email, status, role..."
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
      {error && (
        <div className="h-screen flex justify-center items-center">
          <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">
            ⚠️ Error: {error}
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && <DataTable columns={columns} data={paginatedData} />}

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

export default Users;
