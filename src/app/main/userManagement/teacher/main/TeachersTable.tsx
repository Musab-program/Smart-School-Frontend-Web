"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Teacher } from "@/types/teacher"
import { Specialty } from "@/types/specialty"
import { deleteTeacher } from '@/lib/api';


// columns are now created inside the component to use the provided specialties map

interface TeacherTableProps {
  data: Teacher[]
  specialties: Specialty[]
  onTeacherDeleted?: () => void // دالة لإعادة تحديث البيانات بعد الحذف
}

export function TeacherTable({ data, specialties, onTeacherDeleted }: TeacherTableProps) {
  // إدارة حالة الإشعارات والحذف
  const [notification, setNotification] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);

  const specialtyIdToName = React.useMemo(() => {
    const map = new Map<number, string>();
    specialties.forEach((s) => {
      map.set(s.id, s.name);
    });
    return map;
  }, [specialties]);

  const QualificationIdToName = React.useMemo(() => {
    const map = new Map<number, string>();
    specialties.forEach((s) => {
      map.set(s.id, s.qualification);
    });
    return map;
  }, [specialties]);


  // دالة حذف المعلم
  const handleDeleteTeacher = async (teacherId: number, teacherName: string) => {
    setIsDeleting(teacherId);
    setNotification(null);

    try {
      await deleteTeacher(teacherId);
      setNotification({
        type: "success",
        message: `تم حذف المعلم ${teacherName} بنجاح! ✅`
      });
      
      // إعادة تحديث البيانات
      if (onTeacherDeleted) {
        await onTeacherDeleted();
      }
      
      // إخفاء الإشعار بعد 3 ثواني
      setTimeout(() => {
        setNotification(null);
        
      }, 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setNotification({
        type: "error",
        message: `فشل في حذف المعلم: ${errorMessage}`
      });
      
      // إخفاء الإشعار بعد 5 ثواني
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } finally {
      setIsDeleting(null);
    }
  };

  const columnIdToArabicLabel = React.useMemo(() => ({
    userName: "اسم المعلم",
    isActive: "الحالة",
    gender: "الجنس",
    dateOfBirth: "تاريخ الميلاد",
    address: "العنوان",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    specialtyId: "التخصص",
    qualification: "المؤهل",
    salary: "الراتب",
    select: "تحديد",
    edit_action: "تعديل",
    delete_action: "حذف",
  } as Record<string, string>), []);

  const columns: ColumnDef<Teacher>[] = [
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
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            اسم المعلم
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("userName")}</div>,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الحالة
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const cellValue = row.getValue("isActive") as boolean
        return (
          <div className="flex justify-center">
            <span className={`py-1 px-3 rounded-full text-xs font-medium text-center ${cellValue ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {cellValue ? "نشط" : "غير نشط"}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الجنس
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("gender") || "-"}</div>,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            تاريخ الميلاد
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const val = row.getValue("dateOfBirth") as string;
        return <div className="text-center text-sm text-gray-600">{val ? new Date(val).toLocaleDateString("ar-EG") : "-"}</div>;
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            العنوان
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            البريد الإلكتروني
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الهاتف
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "specialtyId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            التخصص
            <ArrowUpDown />
          </Button>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "ALL") return true;
        const id = row.getValue(columnId);
        return String(id) === String(filterValue);
      },
      cell: ({ row }) => {
        const id = row.getValue("specialtyId") as number
        const name = specialtyIdToName.get(id) || "غير محدد"
        return (
          <div className="flex justify-center">
            <span className="py-1 px-3 rounded-full text-xs font-medium text-center bg-gray-100">
              {name}
            </span>
          </div>
        )
      },
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
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "ALL") return true;
        const specId = row.getValue("specialtyId") as number;
        const qual = QualificationIdToName.get(specId) || "";
        return qual === filterValue;
      },
      cell: ({ row }) => {
        const id = row.getValue("specialtyId") as number
        const name = QualificationIdToName.get(id) || "غير محدد"
        return (
          <div className="flex justify-center">
            <span className="py-1 px-3 rounded-full text-xs font-medium text-center bg-blue-50 text-blue-700">
              {name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "salary",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الراتب
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("salary") as string)
        const formatted = new Intl.NumberFormat("ar-YE", {
          style: "decimal",
          minimumFractionDigits: 2,
        }).format(amount) + " ريال"
        return <div className=" font-medium">{formatted}</div>
      },
    },
    {
      header: "تعديل",
      id: "edit_action",
      enableHiding: false,
      cell: ({row}) => {
        const teacherId = row.original.id;
        return (
          <Link href={` ../teacher/add?id=${teacherId} `}>
            <Button size="icon" variant="ghost" className='text-blue-500 hover:bg-blue-50' >
              <Pencil size={18} /> 
            </Button>
          </Link>
        );
      }
    },
    {
      header: "حذف",
      id: "delete_action",
      enableHiding: false,
      cell: ({row}) => {
        const teacherId = row.original.id;
        
        const teacherName = row.original.userName;
        const isCurrentlyDeleting = isDeleting === teacherId;
        
        return (
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className='text-red-500 hover:bg-red-50'
                disabled={isCurrentlyDeleting}
              >
                <Trash2 size={18} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف المعلم <strong>{teacherName}</strong>؟
                  <br />
                  <span className="text-red-600 font-semibold">هذا الإجراء لا يمكن التراجع عنه.</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => teacherId && handleDeleteTeacher(teacherId, teacherName)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isCurrentlyDeleting}
                >
                  {isCurrentlyDeleting ? "جاري الحذف..." : "حذف"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      }
    }
  ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      dateOfBirth: false,
      address: false,
      gender: false,
    })
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

  return (
    <div className="w-full text-right ">
      {/* إشعارات النجاح والخطأ */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg drop-shadow-lg z-50 text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-1">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="البحث في الأسماء..."
            value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="w-full sm:w-60 text-right"
          />

          <div className="w-full sm:w-48">
            <Select
              value={(table.getColumn("specialtyId")?.getFilterValue() as string) ?? "ALL"}
              onValueChange={(val) =>
                table.getColumn("specialtyId")?.setFilterValue(val === "ALL" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="تصفية بالتخصص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كافة التخصصات</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={(table.getColumn("qualification")?.getFilterValue() as string) ?? "ALL"}
              onValueChange={(val) =>
                table.getColumn("qualification")?.setFilterValue(val === "ALL" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="تصفية بالمؤهل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كافة المؤهلات</SelectItem>
                {Array.from(new Set(specialties.map((s) => s.qualification).filter(Boolean))).map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              الأعمدة <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnIdToArabicLabel[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border shadow-lg ">
      <Table className="px-10">
  <TableHeader className="text-right">
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {/* ⬅️ التعديل هنا: استخدام .slice().reverse() لعكس ترتيب رؤوس الأعمدة */}
        {headerGroup.headers.slice().reverse().map((header) => {
          return (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          );
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
        >
          {/* ⬅️ التعديل هنا: استخدام .slice().reverse() لعكس ترتيب خلايا الصفوف */}
          {row.getVisibleCells().slice().reverse().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          لا يوجد نتائج مطابقة
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} من{" "}
          {table.getFilteredRowModel().rows.length} صفوف محددة.
        </div>
        <div className="space-x-2">
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
