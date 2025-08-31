<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * عرض قائمة المنتجات
     */
    public function index()
    {
        $products = Product::latest()->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->image ? Storage::url($product->image) : null,
                'purchase_price' => $product->purchase_price,
                'marketing_cost' => $product->marketing_cost,
                'selling_price' => $product->selling_price,
                'quantity' => $product->quantity,
                'description' => $product->description,
                'total_cost' => $product->total_cost,
                'unit_profit' => $product->unit_profit,
                'total_potential_profit' => $product->total_potential_profit,
                'is_in_stock' => $product->isInStock(),
                'created_at' => $product->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * عرض نموذج إضافة منتج جديد
     */
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * حفظ منتج جديد
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'marketing_cost' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'purchase_price' => $request->purchase_price,
            'selling_price' => $request->selling_price,
            'quantity' => $request->quantity,
            'marketing_cost' => $request->marketing_cost ?? 1000.00, // افتراضي 1000 دينار
            'description' => $request->description,
        ];

        // رفع الصورة إذا كانت موجودة
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'تم إضافة المنتج بنجاح!');
    }

    /**
     * عرض تفاصيل منتج محدد
     */
    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->image ? Storage::url($product->image) : null,
                'purchase_price' => $product->purchase_price,
                'marketing_cost' => $product->marketing_cost,
                'selling_price' => $product->selling_price,
                'quantity' => $product->quantity,
                'description' => $product->description,
                'total_cost' => $product->total_cost,
                'unit_profit' => $product->unit_profit,
                'total_potential_profit' => $product->total_potential_profit,
                'is_in_stock' => $product->isInStock(),
                'created_at' => $product->created_at->format('Y-m-d H:i'),
            ]
        ]);
    }

    /**
     * عرض نموذج تعديل المنتج
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->image ? Storage::url($product->image) : null,
                'purchase_price' => $product->purchase_price,
                'marketing_cost' => $product->marketing_cost,
                'selling_price' => $product->selling_price,
                'quantity' => $product->quantity,
                'description' => $product->description,
            ]
        ]);
    }

    /**
     * تحديث المنتج
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'marketing_cost' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'purchase_price' => $request->purchase_price,
            'selling_price' => $request->selling_price,
            'quantity' => $request->quantity,
            'marketing_cost' => $request->marketing_cost ?? 1000.00,
            'description' => $request->description,
        ];

        // رفع صورة جديدة إذا كانت موجودة
        if ($request->hasFile('image')) {
            // حذف الصورة القديمة
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'تم تحديث المنتج بنجاح!');
    }

    /**
     * حذف المنتج
     */
    public function destroy(Product $product)
    {
        // حذف الصورة إذا كانت موجودة
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'تم حذف المنتج بنجاح!');
    }
}
