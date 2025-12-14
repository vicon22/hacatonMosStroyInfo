import { useSelfUserData } from '@/entities/user/hooks';
import cn from 'classnames';
import { Button, Card, Text, TextInput } from '@gravity-ui/uikit';
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import st from './chat.module.css';
import {useTranslation} from 'react-i18next';
import { Message } from '@/entities/messages/types';
import { useAllMessages } from '@/entities/messages/hooks';

type ChatProps = {
    roomId: string | number;
};
export const Chat = memo<ChatProps>(function Chat(props) {
    const { t } = useTranslation();
    const user = useSelfUserData();
    const listRef = useRef<HTMLDivElement>(null);
    const messageHistory = useAllMessages();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const socket = useRef<Socket>(null);

    const attachMessage = useCallback((message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        requestAnimationFrame(() => {
            listRef.current?.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: 'smooth',
            });
        });
    }, []);

    const handleSubmit = useCallback(() => {
        if (message.trim()) {
            const payload = {
                userId: String(user.data?.id),
                roomId: String(props.roomId),
                message,
            };

            attachMessage(payload);
            socket.current?.emit('send-message', payload);

            setMessage('');
        }
    }, [user.data?.id, props.roomId, message])

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value.trim());
    }, []);

    useEffect(() => {
        socket.current = io({
            path: '/chat/',
            transports: ['websocket']
        });

        socket.current?.emit('join_room', props.roomId);

        socket.current.on('receive-message', (msg) => {
            attachMessage(msg);
        });

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    return (
        <Card view='raised' theme='info' className={st.layout}>
            <div className={st.messages} ref={listRef}>
                {[
                    ...messageHistory.data || [],
                    ...messages
                ].map((msg, index) => {
                    const isOwn = msg.userId === String(user.data?.id);

                    return (
                        <Card
                            view='filled'
                            key={index}
                            theme={isOwn ? 'info' : 'warning'}
                            className={cn(st.message, {
                                [st.own]: isOwn,
                            })}
                        >
                            <Text variant='body-2'>
                                {msg.message}
                            </Text>
                        </Card>
                    );
                })}
            </div>

            <div className={st.controls}>
                <TextInput
                    size='l'
                    value={message}
                    disabled={messageHistory.isLoading}
                    onChange={handleInput}
                />
                <Button
                    size='l'
                    disabled={messageHistory.isLoading}
                    onClick={handleSubmit}
                >
                    {t('chat.actions.submit')}
                </Button>
            </div>
        </Card>
    );
});
