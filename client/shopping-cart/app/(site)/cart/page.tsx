"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useCartStore } from "@/store/cartStore";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  PhotoIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  QrCodeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { confirmOrder } from "@/services/products.service";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  }).format(price);

type PaymentStatus = "idle" | "waiting" | "success";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  // เก็บยอดตอนกดชำระ เพื่อให้ยังแสดงได้หลังล้างตะกร้า
  const [paidAmount, setPaidAmount] = useState(0);
  const [qrValue, setQrValue] = useState("");
  const totalQuantity = items.reduce((sum, item) => sum + item.cartQuantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.productPrice * item.cartQuantity,
    0,
  );

  const openPayment = () => {
    setPaidAmount(totalPrice);
    setQrValue(
      `DUMMY-PAYMENT|AMOUNT:${totalPrice.toFixed(2)}|REF:${Date.now()}`,
    );
    setPaymentStatus("waiting");
  };

  const closePayment = () => {
    setPaymentStatus("idle");
    setQrValue("");
    setPaidAmount(0);
  };
  console.log(
    "items:",
    items.map((item) => ({
      productsId: item.product.productsId,
      quantity: item.cartQuantity,
    })),
  );
  // ปุ่ม dummy: จำลองว่าลูกค้าชำระเงินแล้ว
  const confirmDummyPayment = async () => {
    clearCart();
    await confirmOrder(
      items.map((item) => ({
        productsId: item.product.productsId,
        quantity: item.cartQuantity,
      })),
    ); // เรียก API เพื่อยืนยันคำสั่งซื้อ (dummy)
    setPaymentStatus("success");
  };

  // ข้อมูลใน QR (dummy) ของจริงควรได้จาก API เช่น PromptPay payload

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <header className="navbar sticky top-0 z-30 bg-base-100/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <ShoppingCartIcon className="h-7 w-7 text-primary" />
              ตะกร้าสินค้า
            </h1>
            <p className="text-sm text-base-content/60">
              มีสินค้า {totalQuantity} ชิ้น
            </p>
          </div>

          <Link href="/home" className="btn btn-outline btn-sm gap-2 sm:btn-md">
            <ArrowLeftIcon className="h-4 w-4" />
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        {items.length === 0 ? (
          /* Empty state */
          <section className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <ShoppingBagIcon className="h-16 w-16 text-base-content/30" />
              <p className="mt-2 text-lg font-semibold">
                ยังไม่มีสินค้าในตะกร้า
              </p>
              <p className="text-base-content/60">
                ไปเลือกสินค้าที่ต้องการก่อนครับ
              </p>
              <Link href="/home" className="btn btn-primary mt-4">
                ดูรายการสินค้า
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_340px]">
            {/* รายการสินค้า */}
            <section className="space-y-4">
              {items.map(({ product, cartQuantity }) => (
                <article
                  key={product.productsId}
                  className="card card-side flex-col bg-base-100 shadow-md sm:flex-row"
                >
                  <figure className="h-32 w-full shrink-0 bg-base-200 sm:w-32">
                    {product.productImage ? (
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-base-content/40">
                        <PhotoIcon className="h-8 w-8" />
                        <span className="text-xs">ไม่มีรูป</span>
                      </div>
                    )}
                  </figure>

                  <div className="card-body min-w-0 flex-1 gap-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="card-title line-clamp-2 text-base">
                          {product.productName}
                        </h2>
                        <p className="text-sm text-base-content/60">
                          {formatPrice(product.productPrice)} / ชิ้น
                        </p>
                      </div>

                      <p className="shrink-0 text-lg font-bold text-primary">
                        {formatPrice(product.productPrice * cartQuantity)}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      {/* ปรับจำนวน */}
                      <div className="join">
                        <button
                          type="button"
                          aria-label="ลดจำนวน"
                          disabled={cartQuantity <= 1}
                          onClick={() =>
                            updateQuantity(product.productsId, cartQuantity - 1)
                          }
                          className="btn btn-sm join-item"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="btn btn-sm join-item pointer-events-none min-w-12 bg-base-100">
                          {cartQuantity}
                        </span>
                        <button
                          type="button"
                          aria-label="เพิ่มจำนวน"
                          disabled={cartQuantity >= product.quantity}
                          onClick={() =>
                            updateQuantity(product.productsId, cartQuantity + 1)
                          }
                          className="btn btn-sm join-item"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.productsId)}
                        className="btn btn-ghost btn-sm gap-1 text-error"
                      >
                        <TrashIcon className="h-4 w-4" />
                        ลบสินค้า
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* สรุปคำสั่งซื้อ */}
            <aside className="card sticky top-24 bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title">สรุปคำสั่งซื้อ</h2>

                <div className="mt-2 space-y-3 text-base-content/70">
                  <div className="flex justify-between">
                    <span>จำนวนสินค้า</span>
                    <span>{totalQuantity} ชิ้น</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง</span>
                    <span className="badge badge-success badge-outline">
                      ฟรี
                    </span>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวม</span>
                  <span className="text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="card-actions mt-4 flex-col gap-2">
                  <button
                    type="button"
                    onClick={openPayment}
                    className="btn btn-primary w-full gap-2"
                  >
                    <QrCodeIcon className="h-5 w-5" />
                    ชำระเงิน
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn btn-outline btn-error w-full gap-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                    ล้างตะกร้า
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Modal ชำระเงินด้วย QR Code */}
      <dialog
        className={`modal ${paymentStatus !== "idle" ? "modal-open" : ""}`}
        onClose={closePayment}
      >
        <div className="modal-box max-w-sm text-center">
          {paymentStatus === "waiting" && (
            <>
              <button
                type="button"
                aria-label="ปิด"
                onClick={closePayment}
                className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold">สแกนเพื่อชำระเงิน</h3>
              <p className="mt-1 text-sm text-base-content/60">
                ใช้แอปธนาคารสแกน QR Code ด้านล่าง
              </p>

              <div className="mx-auto mt-5 w-fit rounded-xl border border-base-300 bg-white p-4">
                <QRCodeSVG value={qrValue} size={200} />
              </div>

              <div className="mt-5">
                <p className="text-sm text-base-content/60">ยอดที่ต้องชำระ</p>
                <p className="text-3xl font-extrabold text-primary">
                  {formatPrice(paidAmount)}
                </p>
              </div>

              <div className="modal-action mt-6 flex-col gap-2">
                {/* ปุ่ม dummy สำหรับทดสอบ */}
                <button
                  type="button"
                  onClick={confirmDummyPayment}
                  className="btn btn-success w-full gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  จำลองการชำระเงินสำเร็จ
                </button>
                <button
                  type="button"
                  onClick={closePayment}
                  className="btn btn-ghost w-full"
                >
                  ยกเลิก
                </button>
              </div>
            </>
          )}

          {paymentStatus === "success" && (
            <div className="flex flex-col items-center py-4">
              <CheckCircleIcon className="h-20 w-20 text-success" />
              <h3 className="mt-3 text-2xl font-bold">ชำระเงินสำเร็จ</h3>
              <p className="mt-1 text-base-content/60">
                ขอบคุณที่ใช้บริการครับ
              </p>
              <p className="mt-3 text-xl font-bold text-primary">
                {formatPrice(paidAmount)}
              </p>

              <Link
                href="/home"
                onClick={closePayment}
                className="btn btn-primary mt-6 w-full"
              >
                กลับไปเลือกสินค้า
              </Link>
            </div>
          )}
        </div>

        {/* คลิกพื้นหลังเพื่อปิด (เฉพาะตอนรอชำระ) */}
        {paymentStatus === "waiting" && (
          <div className="modal-backdrop" onClick={closePayment} />
        )}
      </dialog>
    </div>
  );
}
