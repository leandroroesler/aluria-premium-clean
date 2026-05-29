"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

interface CheckoutData {

  firstName: string

  lastName: string

  email: string

  phone: string

  cpf: string

  cep: string

  address: string

  number: string

  complement: string

  district: string

  city: string

  state: string

  instructions: string

  shipping: number

  shippingState: string

}

interface CheckoutContextType {

  checkoutData: CheckoutData

  updateCheckoutData: (
    data: Partial<CheckoutData>
  ) => void

  clearCheckoutData: () => void

}

const initialCheckoutData: CheckoutData = {

  firstName: "",

  lastName: "",

  email: "",

  phone: "",

  cpf: "",

  cep: "",

  address: "",

  number: "",

  complement: "",

  district: "",

  city: "",

  state: "",

  instructions: "",

  shipping: 0,

  shippingState: "",

}

const CheckoutContext = createContext(
  {} as CheckoutContextType
)

export function CheckoutProvider({
  children,
}: {
  children: ReactNode
}) {

  const [
    checkoutData,
    setCheckoutData,
  ] = useState<CheckoutData>(
    initialCheckoutData
  )

  const [hydrated, setHydrated] =
    useState(false)

  /*
  =====================================
  LOAD STORAGE
  =====================================
  */

  useEffect(() => {

    const storedData =
      localStorage.getItem(
        "aluria-checkout"
      )

    if (storedData) {

    setCheckoutData({

    ...initialCheckoutData,

    ...JSON.parse(storedData),

  })

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
      "aluria-checkout",
      JSON.stringify(checkoutData)
    )

  }, [checkoutData, hydrated])

  /*
  =====================================
  UPDATE
  =====================================
  */

  function updateCheckoutData(
    data: Partial<CheckoutData>
  ) {

    setCheckoutData(prev => ({
      ...prev,
      ...data,
    }))

  }

  /*
  =====================================
  CLEAR
  =====================================
  */

  function clearCheckoutData() {

    setCheckoutData(
      initialCheckoutData
    )

    window.localStorage.setItem(
      "aluria-checkout",
      JSON.stringify(
        initialCheckoutData
      )
    )

  }

  return (

    <CheckoutContext.Provider
      value={{
        checkoutData,
        updateCheckoutData,
        clearCheckoutData,
      }}
    >

      {children}

    </CheckoutContext.Provider>

  )

}

export function useCheckout() {

  return useContext(
    CheckoutContext
  )

}