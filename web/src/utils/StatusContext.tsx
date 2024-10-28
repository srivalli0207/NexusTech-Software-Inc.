import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUser } from "./auth-hooks";

export type StatusProps = Set<String>;

export const StatusContext = createContext<StatusProps | null>(null);

type StatusProviderProp = {
    children: React.ReactNode
}

export function StatusProvider({ children }: StatusProviderProp) {
    const [online, setOnline] = useState<StatusProps>(new Set());
    const statusSocket = useRef<WebSocket>();
    const user = useUser();

    const onSocketOpen = (_: Event)=> {
        statusSocket.current!.onmessage = onSocketMessage;
    }

    const onSocketMessage = (ev: MessageEvent) => {
        setOnline(new Set(JSON.parse(ev.data).message))
    }

    const onAuthChanged = () => {
        if (user === undefined) {
            if (statusSocket.current?.readyState === WebSocket.OPEN) {
               statusSocket.current.close();
               statusSocket.current = undefined;
            }
         } else {
            if (!statusSocket.current) {
               statusSocket.current = new WebSocket(`ws://${window.location.host}/ws/status/`);
               statusSocket.current.onopen = onSocketOpen;
            }
         }
    }

    useEffect(() => {
        onAuthChanged();
  
        return () => {
           if (statusSocket.current?.readyState === WebSocket.OPEN) {
              statusSocket.current.close();
              statusSocket.current = undefined;
           }
        }
     }, [user])

    return (
        <StatusContext.Provider value={online}>
            {children}
        </StatusContext.Provider>
    );
}

export const useStatus = () => {
    return useContext(StatusContext)!;
}
