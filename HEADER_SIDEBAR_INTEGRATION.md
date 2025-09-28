# Header و Sidebar Integration - دليل التكامل

## نظرة عامة
تم تعديل الـ Header ليكون متوافقاً تماماً مع الـ Sidebar، حيث يتكيف مع حالة فتح/إغلاق الـ Sidebar ويوفر تجربة مستخدم سلسة على جميع الأجهزة.

## المميزات الجديدة

### 1. التكيف مع حالة الـ Sidebar
- **عند إغلاق الـ Sidebar**: يظهر الـ Header على كامل الصفحة
- **عند فتح الـ Sidebar**: يتكيف الـ Header مع المساحة المتاحة
- **على الهواتف المحمولة**: يظهر الـ Header على كامل الصفحة دائماً

### 2. التحسينات المرئية
- **انتقالات سلسة**: جميع التغييرات تتم بانتقالات ناعمة (200ms)
- **تنسيق متجاوب**: يتكيف مع أحجام الشاشات المختلفة
- **تحسين المساحة**: استخدام أمثل للمساحة المتاحة

### 3. العناصر المتكيفة

#### أ) شعار التطبيق
```tsx
<span className={cn(
  "transition-all duration-200",
  // إخفاء النص عند تصغير الـ sidebar على الشاشات الكبيرة
  !isMobile && state === "collapsed" && "hidden",
  // إظهار النص عند فتح الـ sidebar أو على الهواتف
  (!isMobile && state === "expanded") || isMobile ? "inline-block" : "hidden sm:inline-block"
)}>
  Smart School
</span>
```

#### ب) حقل البحث
```tsx
<Input
  placeholder={cn(
    "Search...",
    // تغيير النص عند تصغير الـ sidebar
    !isMobile && state === "collapsed" && "Search"
  )}
  className={cn(
    "pl-8 transition-all duration-200",
    // تقليل عرض حقل البحث عند تصغير الـ sidebar
    !isMobile && state === "collapsed" && "max-w-xs"
  )}
/>
```

#### ج) أزرار الإشعارات والمستخدم
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  className={cn(
    "h-8 w-8 transition-all duration-200",
    // إخفاء زر الإشعارات على الشاشات الصغيرة عند تصغير الـ sidebar
    !isMobile && state === "collapsed" && "hidden sm:flex"
  )}
>
```

## التخطيط الجديد

### Layout Structure
```tsx
<SidebarProvider>
  <div className="flex min-h-screen w-full">
    <AppSidebar />
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 p-4">
        {children}
      </main>
      <FooterPage />
    </div>
  </div>
</SidebarProvider>
```

## الملفات المعدلة

### 1. `src/components/site-header.tsx`
- إضافة `useSidebar` hook للكشف عن حالة الـ sidebar
- تطبيق تنسيقات متجاوبة بناءً على حالة الـ sidebar
- تحسين الانتقالات والتفاعل

### 2. `src/app/layout.tsx`
- إعادة هيكلة التخطيط للتكامل الصحيح
- إزالة التكرار في الـ Footer
- تحسين البنية العامة

### 3. `src/components/header/header-responsive.css`
- ملف CSS مخصص للتحسينات المرئية
- تنسيقات متجاوبة إضافية
- تحسينات للأداء

## الاستخدام

### Hook المستخدم
```tsx
const { state, isMobile } = useSidebar()
```

### الحالات المدعومة
- `state === "expanded"`: الـ sidebar مفتوح
- `state === "collapsed"`: الـ sidebar مغلق
- `isMobile`: على الهواتف المحمولة

### Classes المطبقة
- `transition-all duration-200`: انتقالات ناعمة
- `w-full`: عرض كامل
- `hidden sm:flex`: إخفاء على الشاشات الصغيرة
- `max-w-xs`: عرض محدود

## الاختبار

### على الشاشات الكبيرة
1. افتح الـ sidebar - يجب أن يتكيف الـ header
2. أغلق الـ sidebar - يجب أن يظهر الـ header على كامل الصفحة
3. اختبر الانتقالات - يجب أن تكون ناعمة

### على الهواتف المحمولة
1. افتح التطبيق - يجب أن يظهر الـ header على كامل الصفحة
2. اختبر الـ sidebar - يجب أن يعمل بشكل صحيح
3. اختبر الاستجابة - يجب أن يتكيف مع جميع الأحجام

## التحسينات المستقبلية

1. **إضافة animations متقدمة**
2. **تحسين الأداء**
3. **إضافة المزيد من الخيارات القابلة للتخصيص**
4. **دعم themes مختلفة**

## الدعم

لأي استفسارات أو مشاكل، يرجى مراجعة:
- ملف `src/components/site-header.tsx`
- ملف `src/app/layout.tsx`
- ملف `src/components/header/header-responsive.css`

