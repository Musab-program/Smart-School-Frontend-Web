import Link from 'next/link'
import React from 'react'

const notFoundPage = () => {
  return (
    <section className='flex flex-col justify-center items-center pt-24 fix-hight'>
        <h1 className='text-7xl text-gray-800 font-bold'>
            404
        </h1>
        <p className='text-3xl text-gray-600 mt-2 mb-5'>
            الصفحة غير موجودة
        </p>
        <Link  href="/" className='text-xl underline text-blue-700' >الذهاب الى الصفحة الرئيسية</Link>
    </section>
  )
}

export default notFoundPage
