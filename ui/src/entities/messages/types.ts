export type Message = {
  id?: string;
  userId: string;
  roomId: string;
  message: string;
  createdAt?: string;
};

export type CreateMessagePayload = {
  roomId: string;
  message: string;
};
