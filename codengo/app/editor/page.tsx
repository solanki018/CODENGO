// For App Router: app/editor/page.tsx
// For Pages Router: pages/editor.js
'use client'; // if using App Router

import { useEffect, useRef, useState } from 'react';

export default function CollaborativeEditor() {
    const [content, setContent] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const selfUpdate = useRef(false); // prevent echo changes from triggering loops

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);

            if (message.type === 'update') {
                selfUpdate.current = true;
                setContent(message.content);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setContent(newText);

        ws.current?.send(newText);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Collaborative Text Editor</h2>
            <textarea
                value={content}
                onChange={handleChange}
                rows={10}
                cols={60}
                style={{ fontSize: '1rem' }}
            />
        </div>
    );
}
