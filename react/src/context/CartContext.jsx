import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'cariMakanCart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = (product) => {
    const normalizedProduct = {
      productId: product.productId || product.id,
      productName: product.productName || product.name,
      price: Number(product.price || 0),
      quantity: Number(product.quantity || 1),
      image: product.image || '',
      subtotal: Number(product.price || 0) * Number(product.quantity || 1)
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === normalizedProduct.productId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === normalizedProduct.productId
            ? {
                ...item,
                quantity: item.quantity + normalizedProduct.quantity,
                subtotal: (item.quantity + normalizedProduct.quantity) * item.price
              }
            : item
        );
      }

      return [...prevCart, normalizedProduct];
    });

    setToast('Produk berhasil ditambahkan ke keranjang.');
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = useMemo(
    () => ({
      cart,
      toast,
      setToast,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }),
    [cart, toast]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, background: '#2c3e50', color: 'white', padding: '0.8rem 1rem', borderRadius: 8, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
};
