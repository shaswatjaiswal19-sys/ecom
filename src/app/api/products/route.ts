import { NextResponse } from "next/server";
import { getProductsFromStore, createProductInFirestore, updateProductInFirestore, deleteProductInFirestore } from "@/lib/firestore";

// GET /api/products - Returns list of products with optional category/search filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await getProductsFromStore();

    if (category && category !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase().replace(/[^a-z0-9]/g, "-") === category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create a new product (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ success: false, error: "Product name and price are required" }, { status: 400 });
    }

    const created = await createProductInFirestore(body);
    return NextResponse.json({ success: true, message: "Product created successfully", product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create product" }, { status: 500 });
  }
}

// PUT /api/products - Update an existing product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    await updateProductInFirestore(id, updates);
    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products - Delete product by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID parameter is required" }, { status: 400 });
    }

    await deleteProductInFirestore(id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
