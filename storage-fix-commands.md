# حل مشكلة Storage Link في Laravel على السيرفر

## المشكلة:
عند رفع Laravel على السيرفر، الصور ترفع بنجاح لكن لا تظهر في الموقع.

## السبب:
الرابط الرمزي (Symbolic Link) بين `public/storage` و `storage/app/public` غير موجود أو معطل.

---

## الحل الكامل:

### 1. حذف مجلد storage الخاطئ (إذا كان موجود كمجلد عادي):
```bash
rm -rf public/storage
```

### 2. محاولة إنشاء الرابط بـ Artisan (قد لا يعمل على بعض السيرفرات):
```bash
php artisan storage:link
```

### 3. إذا ظهر خطأ exec()، استخدم الطريقة اليدوية:
```bash
ln -sf ../storage/app/public public/storage
```

### 4. التحقق من إنشاء الرابط الرمزي:
```bash
ls -la public/storage
```
**النتيجة المطلوبة:**
```
lrwxrwxrwx ... public/storage -> ../storage/app/public
```

### 5. إنشاء مجلدات التخزين المطلوبة:
```bash
mkdir -p storage/app/public/products
mkdir -p storage/app/public/images
mkdir -p storage/app/public/uploads
```

### 6. ضبط الصلاحيات:
```bash
chmod -R 755 storage/
chmod 755 public/storage
```

### 7. مسح cache التكوين:
```bash
php artisan config:clear
php artisan cache:clear
```

### 8. التحقق من APP_URL في .env:
```bash
nano .env
```
تأكد من:
```
APP_URL=https://yoursite.com
```

---

## اختبار النتيجة:

### تحقق من المجلدات:
```bash
ls -la storage/app/public/
ls -la public/
```

### اختبر رابط الصور في المتصفح:
```
https://yoursite.com/storage/products/image.jpg
```

---

## ملاحظات مهمة:

1. **في حالة cPanel:** أحياناً يكون مجلد الموقع `public_html` بدلاً من `public`
2. **بعض السيرفرات:** تمنع دالة `exec()` لذلك استخدم الطريقة اليدوية
3. **صلاحيات المجلدات:** ضرورية لضمان عمل الرفع والعرض
4. **APP_URL:** يجب أن يكون صحيح لضمان تكوين الروابط بشكل سليم

---

## الأوامر السريعة (نسخ-لصق):

```bash
# حذف المجلد الخاطئ
rm -rf public/storage

# إنشاء الرابط الرمزي يدوياً
ln -sf ../storage/app/public public/storage

# إنشاء مجلدات التخزين
mkdir -p storage/app/public/{products,images,uploads}

# ضبط الصلاحيات
chmod -R 755 storage/
chmod 755 public/storage

# مسح Cache
php artisan config:clear
php artisan cache:clear

# التحقق من النتيجة
ls -la public/storage
```

---

## في الكود Laravel:

### لعرض الصور:
```php
// في Controller
$imageUrl = asset('storage/products/' . $product->image);

// في Blade
<img src="{{ asset('storage/products/' . $product->image) }}" alt="Product">

// باستخدام Storage facade
<img src="{{ Storage::url('products/' . $product->image) }}" alt="Product">
```

### لحفظ الصور:
```php
// في Controller
$imagePath = $request->file('image')->store('products', 'public');
// سيحفظ في: storage/app/public/products/
```

---

**تاريخ الإنشاء:** August 31, 2025  
**الحالة:** تم الاختبار والتأكيد ✅
