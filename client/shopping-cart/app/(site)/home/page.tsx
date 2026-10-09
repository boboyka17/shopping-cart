"use client";
import { useEffect, useState } from "react";
import { Products } from "@/models/Products";
import { getProducts } from "@/services/products.service";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
export default function Home() {
  const [products, setProducts] = useState<Products[]>([]);

  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.cartQuantity, 0),
  );

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <header className="navbar sticky top-0 z-30 bg-base-100/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              รายการสินค้า
            </h1>
            <p className="text-sm text-base-content/60">
              เลือกสินค้าเพื่อเพิ่มลงในตะกร้า
            </p>
          </div>

          <Link href="/cart" className="btn btn-primary gap-2">
            <div className="indicator">
              {cartCount > 0 && (
                <span className="badge indicator-item badge-secondary badge-sm">
                  {cartCount}
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            ตะกร้า
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const soldOut = product.quantity <= 0;
            const lowStock = product.quantity > 0 && product.quantity <= 5;

            return (
              <article
                key={product.productsId}
                className="card bg-base-100 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <figure className="relative h-52 bg-base-200">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className={`h-full w-full object-contain p-4 transition duration-300 hover:scale-105 ${
                        soldOut ? "opacity-50 grayscale" : ""
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-base-content/40">
                      <span className="text-4xl">📦</span>
                      <span className="text-sm">ไม่มีรูปสินค้า</span>
                    </div>
                  )}

                  {soldOut && (
                    <span className="badge badge-error absolute left-3 top-3">
                      สินค้าหมด
                    </span>
                  )}
                  {lowStock && (
                    <span className="badge badge-warning absolute left-3 top-3">
                      เหลือน้อย
                    </span>
                  )}
                </figure>

                <div className="card-body gap-1 p-5">
                  <h2 className="card-title line-clamp-2 text-lg">
                    {product.productName}
                  </h2>

                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.productPrice)}
                  </p>

                  <p className="text-sm text-base-content/60">
                    คงเหลือ{" "}
                    <span className="font-semibold text-base-content">
                      {product.quantity}
                    </span>{" "}
                    ชิ้น
                  </p>

                  <div className="card-actions mt-3">
                    <button
                      type="button"
                      disabled={soldOut}
                      onClick={() => addToCart(product)}
                      className="btn btn-primary w-full"
                    >
                      {soldOut ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-base-content/50">
            <span className="text-5xl">🛒</span>
            <p>ยังไม่มีสินค้าในขณะนี้</p>
          </div>
        )}
      </main>
    </div>
  );
}
