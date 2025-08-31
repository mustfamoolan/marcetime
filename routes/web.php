<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// توجيه الصفحة الرئيسية إلى تسجيل الدخول أو لوحة التحكم
Route::get('/', function () {
    return auth()->check() ? redirect('/dashboard') : redirect('/login');
});

// routes تسجيل الدخول
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// routes المحمية
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // routes المنتجات
    Route::resource('products', \App\Http\Controllers\ProductController::class);

    // routes المبيعات ونقطة البيع
    Route::get('/sales', [\App\Http\Controllers\SaleController::class, 'index'])->name('sales.index');
    Route::post('/sales', [\App\Http\Controllers\SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/report', [\App\Http\Controllers\SaleController::class, 'report'])->name('sales.report');

    // routes الديون
    Route::get('/debts', [\App\Http\Controllers\DebtController::class, 'index'])->name('debts.index');
    Route::get('/debts/{debt}', [\App\Http\Controllers\DebtController::class, 'show'])->name('debts.show');
    Route::post('/debts/{debt}/payment', [\App\Http\Controllers\DebtController::class, 'payment'])->name('debts.payment');
    Route::delete('/debts/{debt}', [\App\Http\Controllers\DebtController::class, 'destroy'])->name('debts.destroy');

    // routes التقارير
    Route::get('/reports', [\App\Http\Controllers\ReportsController::class, 'index'])->name('reports.index');
    Route::get('/reports/sales', [\App\Http\Controllers\ReportsController::class, 'salesReport'])->name('reports.sales');
    Route::get('/reports/profit', [\App\Http\Controllers\ReportsController::class, 'profitReport'])->name('reports.profit');
    Route::get('/reports/debts', [\App\Http\Controllers\ReportsController::class, 'debtReport'])->name('reports.debts');
    Route::get('/reports/products', [\App\Http\Controllers\ReportsController::class, 'productReport'])->name('reports.products');
    Route::get('/reports/sellers', [\App\Http\Controllers\ReportsController::class, 'sellerReport'])->name('reports.sellers');
    Route::get('/reports/overview', [\App\Http\Controllers\ReportsController::class, 'overview'])->name('reports.overview');

    // routes الأرصدة
    Route::get('/balance', [\App\Http\Controllers\BalanceController::class, 'index'])->name('balance.index');
    Route::get('/balance/withdrawals', [\App\Http\Controllers\BalanceController::class, 'withdrawals'])->name('balance.withdrawals');
    Route::post('/balance/withdraw', [\App\Http\Controllers\BalanceController::class, 'withdraw'])->name('balance.withdraw');

    Route::get('/pos', [\App\Http\Controllers\SaleController::class, 'index'])->name('pos.index');

    Route::get('/settings', function () {
        return inertia('Settings/Index');
    })->name('settings.index');
});

// PWA Routes
Route::get('/manifest.json', function() {
    return response()->file(public_path('manifest.json'), [
        'Content-Type' => 'application/json'
    ]);
});

Route::get('/sw.js', function() {
    return response()->file(public_path('sw.js'), [
        'Content-Type' => 'application/javascript'
    ]);
});

Route::get('/browserconfig.xml', function() {
    return response()->file(public_path('browserconfig.xml'), [
        'Content-Type' => 'application/xml'
    ]);
});
