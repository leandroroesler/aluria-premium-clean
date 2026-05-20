"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {

  cart: CartItem[]

  addToCart: (product: CartItem) => void

  removeFromCart: (id: string) => void

  increaseQuantity: (id: string) => void

  decreaseQuantity: (id: string) => void

  clearCart: () => void

  totalItems: number

  subtotal: number

}

const CartContext = createContext(
  {} as CartContextType
)

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {

  const [cart, setCart] =
    useState<CartItem[]>([])

  const [hydrated, setHydrated] =
    useState(false)

  /*
  =====================================
  LOAD STORAGE
  =====================================
  */

  useEffect(() => {

    const storedCart =
      localStorage.getItem(
        "aluria-cart"
      )

    if (storedCart) {

      setCart(
        JSON.parse(storedCart)
      )

    }

    setHydrated(true)

  }, [])

  /*
  =====================================
  SAVE STORAGE
  =====================================
  */

  useEffect(() => {

    if (!hydrated) return

    localStorage.setItem(
      "aluria-cart",
      JSON.stringify(cart)
    )

  }, [cart, hydrated])

  /*
  =====================================
  ADD TO CART
  =====================================
  */

  function addToCart(
    product: CartItem
  ) {

    const existingProduct =
      cart.find(
        item =>
          item.id === product.id
      )

    if (existingProduct) {

      setCart(
        cart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      )

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ])

    }

  }

  /*
  =====================================
  REMOVE ITEM
  =====================================
  */

  function removeFromCart(
    id: string
  ) {

    setCart(
      cart.filter(
        item => item.id !== id
      )
    )

  }

  /*
  =====================================
  INCREASE
  =====================================
  */

  function increaseQuantity(
    id: string
  ) {

    setCart(
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    )

  }

  /*
  =====================================
  DECREASE
  =====================================
  */

  function decreaseQuantity(
    id: string
  ) {

    setCart(
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    )

  }

  /*
  =====================================
  CLEAR CART
  =====================================
  */

  function clearCart() {

    localStorage.removeItem(
      "aluria-cart"
    )

    setCart([])

  }

  /*
  =====================================
  TOTALS
  =====================================
  */

  const totalItems = cart.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  )

  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  )

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >

      {children}

    </CartContext.Provider>

  )

}

export function useCart() {

  return useContext(
    CartContext
  )

}