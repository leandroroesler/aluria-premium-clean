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

  addToCart: (
    product: CartItem
  ) => void

  removeFromCart: (
    id: string
  ) => void

  increaseQuantity: (
    id: string
  ) => void

  decreaseQuantity: (
    id: string
  ) => void

  clearCart: () => void

  totalItems: number

  subtotal: number

}

const CartContext =
  createContext(
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

    const loadCart = () => {

      try {

        const storedCart =
          localStorage.getItem(
            "aluria-cart"
          )

        if (storedCart) {

          const parsedCart =
            JSON.parse(storedCart)

          setCart(parsedCart)

        }

      } catch (error) {

        console.error(
          "Erro ao carregar carrinho:",
          error
        )

      } finally {

        setHydrated(true)

      }

    }

    loadCart()

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

    setCart(prev => {

      const existingProduct =
        prev.find(
          item =>
            item.id === product.id
        )

      if (existingProduct) {

        return prev.map(item =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item

        )

      }

      return [

        ...prev,

        {
          ...product,
          quantity: 1,
        },

      ]

    })

  }

  /*
  =====================================
  REMOVE ITEM
  =====================================
  */

  function removeFromCart(
    id: string
  ) {

    setCart(prev =>

      prev.filter(
        item =>
          item.id !== id
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

    setCart(prev =>

      prev.map(item =>

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

    setCart(prev => {

      const existingItem =
        prev.find(
          item =>
            item.id === id
        )

      if (!existingItem)
        return prev

      if (
        existingItem.quantity === 1
      ) {

        return prev.filter(
          item =>
            item.id !== id
        )

      }

      return prev.map(item =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }

          : item

      )

    })

  }

  /*
  =====================================
  CLEAR CART
  =====================================
  */

  function clearCart() {

    setCart([])

    localStorage.setItem(
      "aluria-cart",
      JSON.stringify([])
    )

  }

  /*
  =====================================
  TOTALS
  =====================================
  */

  const totalItems =
    cart.reduce(

      (acc, item) =>

        acc + item.quantity,

      0

    )

  const subtotal =
    cart.reduce(

      (acc, item) =>

        acc +
        item.price *
          item.quantity,

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