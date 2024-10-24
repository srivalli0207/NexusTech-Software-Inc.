import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type StatusProps = Set<String>;

export const StatusContext = createContext<StatusProps | null>(null);

type StatusProviderProp = {
    children: React.ReactNode
}

export function StatusProvider({ children }: StatusProviderProp) {
    const [online, setOnline] = useState<StatusProps>(new Set());
    const statusSocket = useRef<WebSocket>();

    const onSocketOpen = (_: Event)=> {
        statusSocket.current!.onmessage = onSocketMessage;
    }

    const onSocketMessage = (ev: MessageEvent) => {
        setOnline(new Set(JSON.parse(ev.data).message))
    }

    const onAuthChanged = (e: any) => {
        if (e.detail.user === undefined) {
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
        document.addEventListener('nexify.auth.changed', onAuthChanged)
  
        return () => {
           document.removeEventListener('nexify.auth.changed', onAuthChanged);
           if (statusSocket.current?.readyState === WebSocket.OPEN) {
              statusSocket.current.close();
              statusSocket.current = undefined;
           }
        }
     }, [])

    return (
        <StatusContext.Provider value={online}>
            {children}
        </StatusContext.Provider>
    );
}

export const useStatus = () => {
    return useContext(StatusContext)!;
}
