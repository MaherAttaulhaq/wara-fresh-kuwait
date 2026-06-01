"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface CartItem {
  _id: string
  name: string
  price: number
  qty: number
  image?: string
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { _id: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_ITEMS"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (_id: string) => void
  updateQty: (_id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i._id === action.payload._id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id ? { ...i, qty: i.qty + action.payload.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) }
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload._id ? { ...i, qty: action.payload.qty } : i
        ),
      }
    case "CLEAR_CART":
      return { ...state, items: [] }
    case "SET_ITEMS":
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    const stored = localStorage.getItem("wara-cart")
    if (stored) {
      try {
        dispatch({ type: "SET_ITEMS", payload: JSON.parse(stored) })
      } catch {
        localStorage.removeItem("wara-cart")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wara-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item })
  const removeItem = (_id: string) => dispatch({ type: "REMOVE_ITEM", payload: _id })
  const updateQty = (_id: string, qty: number) => dispatch({ type: "UPDATE_QTY", payload: { _id, qty } })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
