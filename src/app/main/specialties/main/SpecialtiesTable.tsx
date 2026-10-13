"use client";

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileDown, Pencil, Trash2 } from "lucide-react"
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"
import { Specialty } from "@/types/specialty"
import { deleteSpecialty } from "@/lib/api"

export type SpecialtyWithCount = Specialty & { teacherCount: number };

interface SpecialtiesTableProps {
  data: SpecialtyWithCount[];
  onSpecialtyDeleted?: () => void;
}

export function SpecialtiesTable({ data, onSpecialtyDeleted }: SpecialtiesTableProps) {
  const [notification, setNotification] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);

  const handleDeleteSpecialty = async (specialtyId: number, specialtyName: string) => {
    setIsDeleting(specialtyId);
    setNotification(null);

    try {
      await deleteSpecialty(specialtyId);
      setNotification({
        type: "success",
        message: `تم حذف التخصص ${specialtyName} بنجاح! ✅`
      });
      
      if (onSpecialtyDeleted) {
        await onSpecialtyDeleted();
      }
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setNotification({
        type: "error",
        message: `فشل في حذف التخصص: ${errorMessage}`
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } finally {
      setIsDeleting(null);
    }
  };

  const columnIdToArabicLabel = React.useMemo(() => ({
    name: "اسم التخصص",
    qualification: "المؤهل",
    teacherCount: "عدد المعلمين",
    select: "تحديد",
    edit_action: "تعديل",
    delete_action: "حذف",
  } as Record<string, string>), []);

  const columns: ColumnDef<SpecialtyWithCount>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="تحديد الكل"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="تحديد صف"
          className="mr-5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            اسم التخصص
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-lg">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "qualification",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            المؤهل
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("qualification")}</div>,
    },
    {
      accessorKey: "teacherCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            عدد المعلمين
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.getValue("teacherCount") as number;
        return (
          <div className="flex justify-center">
            <span className={`py-1 px-3 rounded-full text-xs font-bold text-center ${count > 0 ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-700'}`}>
              {count} معلم
            </span>
          </div>
        )
      },
    },
    {
      id: "edit_action",
      header: "تعديل",
      cell: ({ row }) => {
        const specialty = row.original;
        return (
          <Link href={`/main/specialties/add?id=${specialty.id}`}>
            <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-50" title="تعديل">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
        )
      },
    },
    {
      id: "delete_action",
      header: "حذف",
      cell: ({ row }) => {
        const specialty = row.original;
        const [isDialogOpen, setIsDialogOpen] = React.useState(false);

        return (
          <>
            <Button 
              size="icon"
              variant="ghost" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => setIsDialogOpen(true)}
              disabled={isDeleting === specialty.id}
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md bg-white border-red-100" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-red-600">تأكيد حذف التخصص</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    هل أنت متأكد من رغبتك في حذف تخصص "{specialty.name}"؟
                    <br />
                    <span className="text-red-500 font-bold mt-2 block">
                      انتبه: لا يمكن التراجع عن هذا الإجراء!
                    </span>
                    {specialty.teacherCount > 0 && (
                      <span className="block mt-2 bg-red-50 text-red-700 p-2 rounded-md">
                        ⚠️ تحذير: هذا التخصص مرتبط بـ {specialty.teacherCount} معلمين! لا يمكنك حذفه حتى تقوم بتعديل تخصصاتهم.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start gap-2 mt-4 flex flex-row-reverse">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleDeleteSpecialty(specialty.id, specialty.name);
                    }}
                    disabled={specialty.teacherCount > 0}
                  >
                    تأكيد الحذف
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )
      },
    }
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => {
      const rowData: Record<string, any> = {};
      table.getAllColumns().forEach(col => {
        if (col.id !== 'select' && col.id !== 'actions' && col.id !== 'edit_action' && col.id !== 'delete_action') {
          const header = columnIdToArabicLabel[col.id as string] || col.id;
          rowData[header] = row.getValue(col.id);
        }
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "التخصصات");
    XLSX.writeFile(wb, "التخصصات.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumns = table.getAllColumns()
      .filter(col => col.id !== 'select' && col.id !== 'actions' && col.id !== 'edit_action' && col.id !== 'delete_action')
      .map(col => columnIdToArabicLabel[col.id as string] || col.id);

    const tableRows = table.getFilteredRowModel().rows.map(row => {
      return table.getAllColumns()
        .filter(col => col.id !== 'select' && col.id !== 'actions' && col.id !== 'edit_action' && col.id !== 'delete_action')
        .map(col => row.getValue(col.id));
    });

    // Font configuration for Arabic text inside PDF requires custom jsPDF setup.
    // Assuming jsPDF-autotable handles basic table layout:
    (doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      styles: { halign: 'right' },
      theme: 'grid'
    });

    doc.save("التخصصات.pdf");
  };

  return (
    <div className="w-full" dir="rtl">
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-in slide-in-from-top-2`}>
          {notification.message}
        </div>
      )}

      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="ابحث عن التخصص..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              تصفية الأعمدة <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-right items-end justify-end"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnIdToArabicLabel[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-2 border-lime-600 text-lime-600 hover:bg-lime-50">
              <FileDown className="mr-2 h-4 w-4" />
              تصدير
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToExcel}>تصدير كـ Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>تصدير كـ PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right font-bold text-gray-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
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
                  className="h-24 text-center text-gray-500"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          تم تحديد {table.getFilteredSelectedRowModel().rows.length} من أصل{" "}
          {table.getFilteredRowModel().rows.length} صف(وف).
        </div>
        <div className="space-x-2 space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
}
