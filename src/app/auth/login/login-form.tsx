// File: app/auth/login/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Users,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/main/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick credentials helper for admin testing
  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans" dir="rtl">
      {/* ─── Left Panel: Branding & Showcase (Visible on lg+) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-slate-900 to-lime-950 overflow-hidden border-l border-emerald-900/40">
        {/* Glow ambient spots */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-11 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-600 p-2.5 flex items-center justify-center shadow-lg shadow-lime-500/20">
            <GraduationCap className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              المدرسة الذكية
            </span>
            <span className="text-xs text-lime-400 font-medium">
              Smart School Management System
            </span>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>نظام الجيل القادم لإدارة المؤسسات التعليمية</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            تحكّم كامل في العمليات الأكاديمية والإدارية بكل ذكاء وسهولة
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            منظومة متكاملة لإدارة الطلاب، هيئة التدريس، الجداول الأسبوعية، الاختبارات، رصد الحضور التفاعلي، ولوحات البيانات الإحصائية في مكان واحد.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">حماية وتشفير متقدم</div>
              <div className="text-xs text-slate-400 mt-0.5">توثيق بالـ JWT وحماية جلسات المستخدمين</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <Users className="h-6 w-6 text-lime-400 mb-2" />
              <div className="text-sm font-bold text-white">إدارة متكاملة</div>
              <div className="text-xs text-slate-400 mt-0.5">شعب دراسية، خطط سنوية، ورصد درجات فوري</div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-4">
          <span>الإصدار 2.5 • بيئة الإنتاج المعتمدة</span>
          <span>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة</span>
        </div>
      </div>

      {/* ─── Right Panel: Interactive Form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-900/40">
        {/* Subtle background particles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-lime-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Mobile branding view */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-600 items-center justify-center shadow-lg shadow-lime-500/20 mb-3">
              <GraduationCap className="h-7 w-7 text-slate-950 font-bold" />
            </div>
            <h1 className="text-2xl font-bold text-white">المدرسة الذكية</h1>
            <p className="text-xs text-slate-400 mt-1">بوابة تسجيل الدخول المركزية</p>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 text-right">
            <h2 className="text-2xl font-bold text-white tracking-tight">تسجيل الدخول</h2>
            <p className="text-sm text-slate-400">
              أدخل بيانات حسابك للمتابعة إلى لوحة التحكم
            </p>
          </div>

          {/* Quick Demo Fill Pill (convenient for user & admin) */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <span className="text-muted-foreground shrink-0 font-medium">تجربة سريعة:</span>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@school.com", "Admin@1234")}
              className="px-2 py-1 rounded bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 font-semibold border border-lime-500/30 transition-colors"
            >
              مدير النظام (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("teacher.ahmed@school.com", "Teacher@1234")}
              className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 transition-colors"
            >
              معلم (Teacher)
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs leading-relaxed flex items-center gap-2 animate-in fade-in duration-200">
              <span className="size-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Elements */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@school.com"
                  className="w-full pr-10 pl-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/40 focus:border-lime-500 transition-all shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="password" className="font-semibold text-slate-300">
                  كلمة المرور
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-lime-400 hover:text-lime-300 transition-colors text-xs"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pr-10 pl-11 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/40 focus:border-lime-500 transition-all shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-l from-lime-500 via-lime-600 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>جاري تسجيل الدخول والتحقق...</span>
                </>
              ) : (
                <>
                  <span>الدخول إلى النظام</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-500">
              تواجه صعوبة في الدخول؟ تواصل مع{" "}
              <span className="text-slate-400 font-medium">الدعم الفني للمدرسة</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
