import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";


import React from 'react'

const Cards = () => {
    return (

        <Card className="w-full max-w-sm shadow-lg">

            {/* CardHeader: رأس البطاقة. نستخدمه هنا لترتيب العنوان والأيقونة */}
            {/* className="p-4 flex flex-row items-center justify-between": لتنظيم العناصر في صف واحد */}
            <CardHeader
                floated={false}
                shadow={false}
                className="p-4 flex flex-row items-center justify-between"
            >

                {/* العنوان: نستخدم Typography بدلاً من CardTitle */}
                {/* className="text-sm font-medium": حجم صغير ومتوسط السماكة */}
                <Typography variant="small" className="text-sm font-medium text-gray-700">
                    hi
                </Typography>

                {/* الأيقونة: بحجم صغير ولون هادئ (نستخدم فئات Tailwind) */}
                <Icon className="w-4 h-4 text-gray-500" />
            </CardHeader>

            {/* CardBody: محتوى البطاقة. يحتوي على القيمة والوصف */}
            <CardBody className="p-4 pt-0">

                {/* القيمة: نستخدم Typography بحجم كبير وسميك */}
                {/* className="text-2xl font-bold": حجم كبير وسميك */}
                <Typography className="text-2xl font-bold text-blue-gray-900 mb-1">
                    jjfjf
                </Typography>

                {/* الوصف: نستخدم Typography بحجم أصغر ولون هادئ */}
                {/* className="text-xs text-gray-500": أصغر حجم ولون هادئ */}
                <Typography variant="small" className="text-xs text-gray-500">
                    jjfjf
                </Typography>
            </CardBody>
        </Card>
    )
}

export default Cards
