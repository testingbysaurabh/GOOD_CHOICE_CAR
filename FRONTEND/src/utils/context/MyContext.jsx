import React, { createContext, useContext, useState } from 'react'


export const GlobalContext = createContext()


export const MyContext = ({ children }) => {
    const [ui, setUi] = useState(0)
    const [mail, setMail] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    return (
        <GlobalContext.Provider value={
            {
                ui, setUi,
                mail, setMail,
                isLoading, setIsLoading

            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}


export function useGlobalContext() {
    return useContext(GlobalContext)
}

