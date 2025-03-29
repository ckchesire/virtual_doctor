import { useState, useEffect, useRef } from "react";
import api from "../api";

const ChatBox = ({ consultationId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const pollInterval = useRef(null);

    // Initial message fetch
    useEffect(() => {
        fetchMessages();
        
        // Set up polling for messages every 3 seconds
        pollInterval.current = setInterval(fetchMessages, 3000);
        
        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
            }
        };
    }, [consultationId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/api/consultations/${consultationId}/messages/`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!message.trim()) return;
        
        try {
            setMessage("");
            
            // Send message via API - using the correct endpoint from your documentation
            await api.post(`/api/consultations/${consultationId}/messages/send/`, {
                sender: "doctor", // This should be determined from the user's role
                content: message
            });
            
            // Fetch messages again to get the updated list including the new message
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    // Helper function to determine if sender is doctor or patient
    const getSenderDisplayName = (sender) => {
        // This is a simplified version - in a real app, you'd compare the sender ID with the current user's ID
        return sender === "doctor" ? "You" : "Patient";
    };

    return (
        <div className="chatbox">
            <h3 className="text-lg font-semibold mb-2">Chat</h3>
            <div className="messages">
                {loading ? (
                    <p className="text-gray-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.message_id || msg.id} 
                            className={`message ${msg.sender === "doctor" ? "doctor" : "patient"}`}
                        >
                            <strong>{getSenderDisplayName(msg.sender)}:</strong> {msg.content}
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input mt-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;