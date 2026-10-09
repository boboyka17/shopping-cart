"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PreLoader from "@/components/common/PreLoader";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
      router.replace("/home");
  }, [router]);

  return <PreLoader />;
}