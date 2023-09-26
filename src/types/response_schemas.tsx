import User from "./auth/User";

export type ChatMessage = {
    id: string;
    chat_id: string;
    to_id: string;
    from_id: string;
    attachment_url: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface Chat {
    id: string;
    members: string;
    member1: User;
    member2: User;
    messages: ChatMessage[];
}