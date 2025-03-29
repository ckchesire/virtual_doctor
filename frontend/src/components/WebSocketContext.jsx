import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ consultationId, children }) => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (!consultationId) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/consultations/${consultationId}/`);
        setWs(socket);

        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.onclose = () => console.log("WebSocket Disconnected");

        return () => {
            socket.close();
        };
    }, [consultationId]);

    const sendMessage = (content, sender = "doctor") => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ sender, content }));
        }
    };

    return (
        <WebSocketContext.Provider value={{ messages, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
