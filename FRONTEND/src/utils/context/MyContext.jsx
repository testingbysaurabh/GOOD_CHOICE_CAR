import React, { createContext, useContext, useState } from 'react'


export const GlobalContext = createContext()


export const MyContext = ({ children }) => {
    const [extraSpace, setExtraSpace] = useState("")

    return (
        <GlobalContext.Provider value={
            {
                extraSpace, setExtraSpace

            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}


export function useGlobalContext() {
    return useContext(GlobalContext)
}

