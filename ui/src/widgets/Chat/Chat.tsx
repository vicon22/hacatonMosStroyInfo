import { useSelfUserData } from "@/entities/user/hooks";
import cn from "classnames";
import { Button, Card, Text, TextInput } from "@gravity-ui/uikit";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import st from "./chat.module.css";
import { useTranslation } from "react-i18next";
import { Message } from "@/entities/messages/types";
import { useMessagesByRoomId, useCreateMessage } from "@/entities/messages/hooks";
import useKeyPress from "@/shared/hooks/useKeyPress";

type ChatProps = {
  roomId: string | number;
};
export const Chat = memo<ChatProps>(function Chat(props) {
  const { t } = useTranslation();
  const user = useSelfUserData();
  const listRef = useRef<HTMLDivElement>(null);
  const roomId = String(props.roomId);
  const messageHistory = useMessagesByRoomId(roomId);
  const createMessageMutation = useCreateMessage();
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const socket = useRef<Socket | null>(null);

  const attachMessage = useCallback((message: Message) => {
    setNewMessages((prevMessages) => [...prevMessages, message]);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (message.trim() && !createMessageMutation.isPending) {
      const payload = {
        roomId: roomId,
        message: message.trim(),
      };

      try {
        const createdMessage = await createMessageMutation.mutateAsync(payload);
        attachMessage(createdMessage);
        socket.current?.emit("send-message", createdMessage);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }, [roomId, message, createMessageMutation, attachMessage]);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  useKeyPress({ Enter: handleSubmit });

  useEffect(() => {
    if (messageHistory.data && messageHistory.data.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messageHistory.data]);

  useEffect(() => {
    socket.current = io({
      path: "/chat/",
      transports: ["websocket"],
    });

    socket.current?.emit("join_room", roomId);

    socket.current.on("receive-message", (msg: Message) => {
      const currentUserId = String(user.data?.email);
      if (msg.userId === currentUserId) {
        return;
      }

      setNewMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [roomId, user.data?.email]);

  useEffect(() => {
    if (messageHistory.data && messageHistory.data.length > 0) {
      setNewMessages((prev) => {
        const historyIds = new Set(
          messageHistory.data?.map((m) => m.id).filter(Boolean) || []
        );
        return prev.filter((m) => !m.id || !historyIds.has(m.id));
      });
    }
  }, [messageHistory.data]);

  const allMessages = useMemo(() => {
    const history = messageHistory.data || [];
    const newMsgs = newMessages || [];
    const all = [...history, ...newMsgs];

    const seen = new Set<string>();
    const uniqueMessages = all.filter((msg) => {
      if (!msg.id) return true;
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });

    const welcomeMessage: Message = {
      id: "welcome-message",
      userId: "system",
      roomId: roomId,
      message: t("chat.welcome"),
      createdAt: new Date().toISOString(),
    };

    return [welcomeMessage, ...uniqueMessages];
  }, [messageHistory.data, newMessages, roomId, t]);
  const isLoading = messageHistory.isLoading || createMessageMutation.isPending;

  return (
    <Card view="filled" theme="info" className={st.layout}>
      <div className={st.messages} ref={listRef}>
        {allMessages.map((msg, index) => {
          const isOwn = msg.userId === String(user.data?.email);
          const isSystem = msg.userId === "system";

          return (
            <Card
              view="filled"
              key={msg.id || index}
              theme={isSystem ? "normal" : isOwn ? "info" : "warning"}
              className={cn(st.message, {
                [st.own]: isOwn,
                [st.system]: isSystem,
              })}
            >
              <Text variant="body-2">{msg.message}</Text>
            </Card>
          );
        })}
      </div>

      <div className={st.controls}>
        <TextInput
          size="xl"
          value={message}
          disabled={isLoading}
          onChange={handleInput}
        />
        <Button
          view="action"
          size="xl"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {t("chat.actions.submit")}
        </Button>
      </div>
    </Card>
  );
});
