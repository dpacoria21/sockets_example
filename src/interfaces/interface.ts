export interface Chat {
    id: string;
    name: string;
    createdAt: Date;
    Messages: Message[];
}

export interface Message {
    id: string;
    createdAt: Date;
    message: string;
    chatId: string;
}

export interface CreateMessageBody {
    message: string,
    chatName: string,
}