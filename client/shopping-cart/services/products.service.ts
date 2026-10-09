import api from "@/libs/axios";
import { ComfirmOrder, Products } from "@/models/Products";

export async function getProducts(): Promise<Products[]> {
  try {
    const response = await api.get<Products[]>("/Products");
    return response.data;
  } catch (error) {
    console.error("getProducts error:", error);
    throw error;
  }
}

export async function confirmOrder(
  cartItems: ComfirmOrder[],
): Promise<Products[]> {
  try {
    console.log("confirmOrder called with cartItems:", cartItems);
    const response = await api.post<Products[]>("/Products/confirm", cartItems);
    return response.data;
  } catch (error) {
    console.error("getProducts error:", error);
    throw error;
  }
}
