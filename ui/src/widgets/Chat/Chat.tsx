import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socketInitializer();
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    async function socketInitializer() {
        socket = io({
            path: '/chat/',
            transports: ['websocket']
        });

        socket.emit('join_room', 123);

        socket.on('receive-message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg.message]);
        });
    }

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send-message', { roomId: 123, message });
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}