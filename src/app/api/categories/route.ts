import { NextResponse } from "next/server";
import {
  getCategoriesFromStore,
  createCategoryInFirestore,
  updateCategoryInFirestore,
  deleteCategoryInFirestore,
  getBrandsFromStore,
  createBrandInFirestore,
  deleteBrandInFirestore,
} from "@/lib/firestore";
import { requireServerAdmin } from "@/lib/serverAuth";

// GET /api/categories - Returns categories and brands (Public read)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "brands") {
      const brands = await getBrandsFromStore();
      return NextResponse.json({ success: true, count: brands.length, brands });
    }

    const categories = await getCategoriesFromStore();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category or brand (Admin Only)
export async function POST(request: Request) {
  try {
    const authGuard = await requireServerAdmin();
    if (!authGuard.authorized) {
      return authGuard.response!;
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (type === "brand") {
      if (!data.name) {
        return NextResponse.json({ success: false, error: "Brand name is required" }, { status: 400 });
      }
      const created = await createBrandInFirestore(data);
      return NextResponse.json({ success: true, message: "Brand created successfully", brand: created }, { status: 201 });
    }

    if (!data.name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }
    const created = await createCategoryInFirestore(data);
    return NextResponse.json({ success: true, message: "Category created successfully", category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories - Update an existing category (Admin Only)
export async function PUT(request: Request) {
  try {
    const authGuard = await requireServerAdmin();
    if (!authGuard.authorized) {
      return authGuard.response!;
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await updateCategoryInFirestore(id, updates);
    return NextResponse.json({ success: true, message: "Category updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories - Delete a category or brand by ID (Admin Only)
export async function DELETE(request: Request) {
  try {
    const authGuard = await requireServerAdmin();
    if (!authGuard.authorized) {
      return authGuard.response!;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    if (type === "brand") {
      await deleteBrandInFirestore(id);
      return NextResponse.json({ success: true, message: "Brand deleted successfully" });
    }

    await deleteCategoryInFirestore(id);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
