import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { GraduationCap, Award } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Specialty } from "@/types/specialty"

interface TeacherFiltersProps {
    specialties: Specialty[]
    onFiltersChange: (filters: { specialtyId: string | null, qualification: string | null }) => void
}

export function TeacherFilters({ specialties, onFiltersChange }: TeacherFiltersProps) {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [selectedQualification, setSelectedQualification] = useState<string | null>(null)
    const onFiltersChangeRef = useRef(onFiltersChange)
    
    // تحديث المرجع عند تغيير الدالة
    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange
    }, [onFiltersChange])

    // قائمة المؤهلات
    const qualifications = [
        { value: "all", label: "الكل" },
        { value: "بكالوريوس", label: "بكالوريوس" },
        { value: "ماجستير", label: "ماجستير" },
        { value: "دكتوراه", label: "دكتوراه" },
        { value: "دبلوم", label: "دبلوم" }
    ]

    // إرسال الفلترة عند تغيير أي من القيم
    useEffect(() => {
        onFiltersChangeRef.current({
            specialtyId: selectedSpecialty,
            qualification: selectedQualification
        })
    }, [selectedSpecialty, selectedQualification])

    // إعادة تعيين المؤهل عند تغيير التخصص
    const handleSpecialtyChange = (value: string) => {
        setSelectedSpecialty(value === "all" ? null : value)
        setSelectedQualification(null) // إعادة تعيين المؤهل
    }

    const handleQualificationChange = (value: string) => {
        setSelectedQualification(value === "all" ? null : value)
    }

    return (
        <div className="flex gap-4 items-center justify-center mb-6">
            {/* Select التخصص */}
            <div className="flex flex-col gap-2">
                <Select value={selectedSpecialty || ""} onValueChange={handleSpecialtyChange}>
                    <SelectTrigger className="w-[200px] bg-green-800 text-white border-green-700 hover:bg-green-900 focus:ring-green-500 [&>svg]:text-white [&>svg]:fill-white [&>svg]:stroke-white">
                        <div className="flex items-center gap-2 text-white">
                            <GraduationCap className="h-4 w-4 text-white" />
                            <SelectValue placeholder="التخصص" className="text-white" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-green-200">
                        <SelectGroup>
                            <SelectLabel className="text-green-800 font-semibold">التخصصات</SelectLabel>
                            <SelectItem value="all" className="text-green-700 hover:bg-green-50">الكل</SelectItem>
                            {specialties.map((specialty) => (
                                <SelectItem 
                                    key={specialty.id} 
                                    value={specialty.id.toString()}
                                    className="text-green-700 hover:bg-green-50"
                                >
                                    {specialty.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Select المؤهل - يظهر فقط عند اختيار تخصص */}
            {selectedSpecialty && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-left-2 duration-200">
                    <Select value={selectedQualification || ""} onValueChange={handleQualificationChange}>
                        <SelectTrigger className="w-[200px] bg-green-800 text-white border-green-700 hover:bg-green-900 focus:ring-green-500 [&>svg]:text-white [&>svg]:fill-white [&>svg]:stroke-white">
                            <div className="flex items-center gap-2 text-white">
                                <Award className="h-4 w-4 text-white" />
                                <SelectValue placeholder="المؤهل" className="text-white" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-green-200">
                            <SelectGroup>
                                <SelectLabel className="text-green-800 font-semibold">المؤهلات</SelectLabel>
                                {qualifications.map((qual) => (
                                    <SelectItem 
                                        key={qual.value} 
                                        value={qual.value}
                                        className="text-green-700 hover:bg-green-50"
                                    >
                                        {qual.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    )
}
