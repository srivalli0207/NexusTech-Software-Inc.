import { RequestManager } from "./request";
import { UserResponse } from "./user";

export type Conversation = {
    id: number;
    name: string | null;
    group: boolean;
    lastMessage: ConversationMessage | null,
    members: UserResponse[]
}

export type ConversationMessage = {
    id: number;
    user: UserResponse;
    text: string;
    sent: string; 
}

export class MessageManager extends RequestManager<"message"> {
    private static instance: MessageManager | null = null;

    private constructor() {
        super("message");
    }

    public static getInstance(): MessageManager {
        if (MessageManager.instance === null) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }

    public async getConversations(username?: string): Promise<Conversation[]> {
        const request = this.createRequestBuilder();
        request.setMethod("GET");
        if (username) request.setQuery("username", username);
        return await request.fetchJSON();
    }

    public async createConversation(usernames: string[], group: boolean): Promise<Conversation> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setJSONData({"usernames": usernames, "group": group})
            .fetchJSON();
    }
    
    public async getMessages(conversationId: number): Promise<ConversationMessage[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(conversationId)
            .fetchJSON();
    }
    
    public async sendMessage(conversationId: number, data: {text?: string}): Promise<ConversationMessage> {
        const formData = new FormData();
        if (data.text) formData.append("text", data.text);
    
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(conversationId)
            .setFormData(formData)
            .fetchJSON();
    }
}


