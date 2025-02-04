"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const url = import.meta.env.VITE_API_URL;

export function DataTable({ data, onUpdate, onDelete }) {
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (row) => {
    setEditingRow(row.no);
    setEditData(row);
  };

  const handleInputChange = (e, field) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");

      const response = await fetch(`${url}/update/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      onUpdate(editData);
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  const handleDelete = async (rowId) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");

      const response = await fetch(`${url}/delete/${rowId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      onDelete(rowId);
    } catch (error) {
      console.error("Error deleting data:", error.message);
    }
  };

  const columns = [
    { accessorKey: "no", header: "No." },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditClick(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="mx-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Employee</h1>
        <div className="flex w-1/4 mb-4">
          <Input
            placeholder="Search..."
            // value={searchQuery}
            // onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.accessorKey}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row) => (
                <TableRow key={row.no}>
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      {editingRow === row.no &&
                      col.accessorKey !== "actions" ? (
                        <Input
                          value={editData[col.accessorKey] || ""}
                          onChange={(e) =>
                            handleInputChange(e, col.accessorKey)
                          }
                        />
                      ) : col.accessorKey === "actions" ? (
                        flexRender(col.cell, { row })
                      ) : (
                        row[col.accessorKey]
                      )}
                    </TableCell>
                  ))}
                  {editingRow === row.no && (
                    <TableCell>
                      <Button onClick={handleSave}>Save</Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingRow(null)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4"
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

function Employee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust as needed

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await fetch(`${url}/Users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const fetchedData = await response.json();
        setData(fetchedData.map((item, index) => ({ ...item, no: index + 1 })));
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUpdate = (updatedRow) => {
    setData((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
  };

  const handleDelete = (rowId) => {
    setData((prev) => prev.filter((row) => row.id !== rowId));
  };

  // Get the data for the current page
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return loading ? (
    <div className="h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-600"></div>
    </div>
  ) : error ? (
    <div className="h-screen flex justify-center items-center">
      <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">
        ⚠️ Error: {error}
      </div>
    </div>
  ) : (
    <div className="container mx-auto py-10">
      <DataTable data={paginatedData} onUpdate={handleUpdate} onDelete={handleDelete} />

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
                  className={pageIndex + 1 === currentPage ? "bg-indigo-700 text-white" : ""}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
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


export default Employee;
