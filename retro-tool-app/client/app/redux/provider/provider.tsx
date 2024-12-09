"use client"

import { Provider } from "react-redux"
import { store, persistor } from "../store/store"
import { ReactNode } from "react"
import { PersistGate } from "redux-persist/integration/react"

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            {children}
            </PersistGate>
          
        </Provider>
    )
}