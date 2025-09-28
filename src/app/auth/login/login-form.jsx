// File: app/(auth)/login/login-form.tsx
"use client";
import ClickSpark from "@/components/ClickSpark";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

export function SimpleRegistrationForm() {
  return (
    <Card
      className="w-full max-w-sm w-  sm:max-w-md md:max-w-5xl lg:max-w-5xl xl:max-w-5xl py-10 px-6 sm:px-12 md:px-16 lg:px-24 rounded-3xl bg-white shadow-xl transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
      color="transparent"
      shadow={false}
    >
      <Typography variant="h2" color="lime" className="text-center font-bold mb-4 text-lime-900">
        تسجيل الدخول
      </Typography>
      <Typography color="gray" className="mt-2 font-normal text-center text-lime-900">
        مرحبا بك مجددا
      </Typography>
      <form dir="rtl" className="mt-10 mb-2 w-full">
        <div className="mb-1 flex flex-col gap-8">
          <Typography variant="h5" color="blue-gray" className="-mb-4 text-right text-lime-900">
            الاسم
          </Typography>
          <Input
            size="lg"
            placeholder="مصعب"
            className="!border-lime-600 focus:!border-lime-800 bg-white pr-10 border-2 text-lg"
            icon={<UserIcon className="h-6 w-6 text-lime-800 mt-4" />}
          />
          <Typography variant="h5" color="blue-gray" className="-mb-4 text-right text-lime-900">
            الإيميل
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className="!border-lime-600 focus:!border-lime-800 bg-white pr-10 border-2 text-lg"
            icon={<EnvelopeIcon className="h-6 w-6 mt-4 text-lime-800" />}
          />
          <Typography variant="h5" color="blue-gray" className="-mb-4 text-right text-lime-900">
            كلمة السر
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className="!border-lime-600 focus:!border-lime-800 bg-white pr-10 border-2 text-lg"
            icon={<LockClosedIcon className="h-6 w-6 text-lime-800 mt-4" />}
          />
        </div>
        <Button
          className="mt-8 bg-lime-950 text-white hover:bg-lime-50 hover:text-gray-950 transform transition-all duration-500 text-xl"
          size="lg"
          fullWidth
        >
          <ClickSpark>
            ادخل
          </ClickSpark>
        </Button>
      </form>
    </Card>
  );
}