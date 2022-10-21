import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
  }, [cart])

  const addProduct = async (productId: number) => {
    try {
      const temporaryCart = [...cart]
      const productExists = temporaryCart.find(product => product.id === productId)
      const apiResponseStock = await api.get(`/stocks/${productId}`)

      const warehouseStock = apiResponseStock.data.stock.amount
      const currentAmount = productExists ? productExists.amount : 0

      if(currentAmount + 1 > warehouseStock){
        toast.error('Selected quantity out of stock');
        return
      }

      if(productExists){
        productExists.amount++
      } else{
        const productApiResponse = await api.get(`/products/${productId}`)
        const newProduct = {
          ...productApiResponse.data.product, 
          amount: 1
        }
        temporaryCart.push(newProduct)
      }

      setCart(temporaryCart);
      toast.success('Product added to cart');
    } catch {
      toast.error('Error updating quantity');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const temporaryCart = [...cart]
      const indexToDelete = temporaryCart.findIndex(product => product.id === productId)

      if(indexToDelete !== -1){
        temporaryCart.splice(indexToDelete, 1)
        setCart(temporaryCart)
      } else{
        throw new Error()
      }

    } catch {
      toast.error('Error deleting product');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0){
        return
      }
      
      const apiResponseStock = await api.get(`/stocks/${productId}`)
      const warehouseStock = apiResponseStock.data.stock.amount

      if(amount > warehouseStock){
        toast.error('Selected quantity out of stock');
        return
      }

      const temporaryCart = [...cart]
      const productExists = temporaryCart.find(product => product.id === productId)

      if(productExists){
        productExists.amount = amount
        setCart(temporaryCart)
        toast.success('Cart updated');
      } else{
        throw new Error()
      }

    } catch {
      toast.error('Error updating product quantity');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
