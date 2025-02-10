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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";


const getColumns = (navigate, handleEdit, handleDelete) => [
  { accessorKey: "no", header: "No." },
  { accessorKey: "skillName", header: "Skill Name" },
  {
    accessorKey: "relatedJob",
    header: "Related Job",
    cell: ({ row }) => (
      <Button
        onClick={() =>
          navigate(`/skills/viewjob`, { state: { skillName: row.original.skillName } })
        }
        variant="primary"
      >
        View Job
      </Button>
    ),
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DataTable({
  columns,
  data,
  editingRowId,
  formData,
  handleChange,
  handleSave,
}) {
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
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.columnDef.accessorKey;
                    const isEditing = editingRowId === row.original.id;
                    return (
                      <TableCell key={cell.id}>
                        {isEditing && columnId !== "no" && columnId !== "actions" && columnId !== "relatedJob" ? (
                          <Input
                            type="text"
                            value={formData[columnId] || ""}
                            onChange={(e) => handleChange(e, columnId)}
                          />
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}

                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {editingRowId === row.original.id && (
                      <Button
                        onClick={handleSave}
                        size="sm"
                      >
                        Save
                      </Button>
                    )}
                  </TableCell>
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

function Skills() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [editingRowId, setEditingRowId] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [newSkill, setNewSkill] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const handleEdit = (rowData) => {
    // console.log("Editing Row:", rowData); // Debugging log
    setEditingRowId(rowData.id);
    setFormData({ ...rowData }); // Ensure data is stored properly
  };

  const handleChange = (e, field) => {

    setFormData({ ...formData, [field]: e.target.value });

  };

  const handleSave = async () => {
    if (!editingRowId) return;
    
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      console.error("JWT Token is missing!");
      return;
    }
  
    try {
      const response = await fetch(`${url}/Skills/updateskill/${editingRowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Response:", errorText);
        throw new Error("Failed to update job.");
      }
  
      const updatedJob = await response.json();
  
      setData((prevData) =>
        prevData.map((job) =>
          job.id === editingRowId ? { ...job, ...updatedJob } : job
        )
      );
  
      setEditingRowId(null);
      setFormData({});
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await fetch(`${url}/deleteSkill/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete job.");

      setData((prevData) => prevData.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert("Skill name cannot be empty.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");
  
      const response = await fetch(`${url}/Skills/addskill`, { // Replace with your actual API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skillName: newSkill }), // Send the new skill name in the request body
      });

      window.location.reload();
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add skill: ${errorText}`);
      }
  
      const addedSkill = await response.json(); // Assuming the API returns the added skill
      setData((prevData) => [...prevData, { ...addedSkill, no: prevData.length + 1 }]); // Append the new skill to the data
      setNewSkill(""); // Clear the input field
    } catch (error) {
      console.error("Error adding skill:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("jwtToken");
        const response = await fetch(`${url}/Skills/skills`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedData = await response.json();
        const indexedData = fetchedData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));

        setData(indexedData);
        setFilteredData(indexedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const columns = getColumns(navigate, handleEdit, handleDelete);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4 mx-10">
        <h1 className="text-2xl font-bold mb-4">Skills</h1>

        <div className="flex items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="Enter new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <Button onClick={handleAddSkill} className="px-4 py-2 bg-white text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white transition">
          Add Skill
        </Button>
      </div>

      </div>
      {!loading && !error && (
        <>
          <DataTable
            columns={columns}
            data={paginatedData}
            editingRowId={editingRowId}
            formData={formData}
            handleChange={handleChange}
            handleSave={handleSave}
          />

          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <PaginationItem key={pageIndex}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageIndex + 1)}
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
        </>
      )}
    </div>
  );
}

export default Skills;
