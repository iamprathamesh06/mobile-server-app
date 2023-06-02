import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  const addToCart = async (product, quantity) => {
    product = { ...product, quantity };
    try {
      const cartProducts = await AsyncStorage.getItem("cartProducts");
      if (cartProducts !== null) {
        const products = JSON.parse(cartProducts);
        products.push(product);
        await AsyncStorage.setItem("cartProducts", JSON.stringify(products));
        setCartProducts(products);
      } else {
        const products = [product];
        await AsyncStorage.setItem("cartProducts", JSON.stringify(products));
        setCartProducts(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFromCart = async (product) => {
    try {
      const cartProducts = await AsyncStorage.getItem("cartProducts");
      if (cartProducts !== null) {
        const products = JSON.parse(cartProducts);
        const newProducts = products.filter((p) => p._id !== product._id);
        await AsyncStorage.setItem("cartProducts", JSON.stringify(newProducts));
        setCartProducts(newProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getStoredProducts = async () => {
      let productsPresent = await AsyncStorage.getItem("cartProducts");
      if (productsPresent) {
        let storedProducts = JSON.parse(productsPresent);
        console.log(storedProducts);
        setCartProducts(storedProducts);
      }
    };
    getStoredProducts();
  }, []);
  const value = { cartProducts, setCartProducts, addToCart, deleteFromCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
