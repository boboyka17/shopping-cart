export interface Products {
  productsId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

export interface CartItem {
  product: Products;
  cartQuantity: number;
}

export interface ComfirmOrder {
  productsId: number;
  quantity: number;
}
