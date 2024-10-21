import { Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

export type SnackbarProps = {
    message: string,
    open: boolean
}

export const SnackbarContext = createContext<React.Dispatch<React.SetStateAction<SnackbarProps>> | null>(null);

type SnackbarProviderProp = {
    children: React.ReactNode
}

export function SnackbarProvider({children}: SnackbarProviderProp) {
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", open: false });

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setSnackbar({...snackbar, open: false});
    };

    return (
        <SnackbarContext.Provider value={setSnackbar}>
            {children}
            <Snackbar
                open={snackbar.open}
                onClose={handleClose}
                autoHideDuration={4000}
                message={snackbar.message}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            />
        </SnackbarContext.Provider>
    )
}

export const useSnackbar = () => {
    return useContext(SnackbarContext)!;
}
