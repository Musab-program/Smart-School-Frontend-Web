import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر المادة" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>المواد</SelectLabel>
                    <SelectItem value="">قرآن كريم</SelectItem>
                    <SelectItem value="banana">تربية إسلامية</SelectItem>
                    <SelectItem value="blueberry">لغة عربية</SelectItem>
                    <SelectItem value="grapes">لغة إنجليزية</SelectItem>
                    <SelectItem value="pineapple">اجتماعيات</SelectItem>
                    <SelectItem value="pineapple">علوم</SelectItem>
                    <SelectItem value="pineapple">فيزياء</SelectItem>
                    <SelectItem value="pineapple">كيمياء</SelectItem>
                    <SelectItem value="pineapple">آحياء</SelectItem>
                    <SelectItem value="pineapple">رياضيات</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
