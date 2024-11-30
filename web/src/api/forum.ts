import { Post } from "./post";
import { RequestManager } from "./request";

export type Forum = {
    name: string,
    description: string,
    icon: string | null,
    banner: string | null
}

export class ForumManager extends RequestManager<"forum"> {
    private static instance: ForumManager | null = null;

    private constructor() {
        super("forum");
    }

    public static getInstance(): ForumManager {
        if (ForumManager.instance === null) {
            ForumManager.instance = new ForumManager();
        }
        return ForumManager.instance;
    }

    public async getForums(): Promise<Forum[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .fetchJSON();
    }
    
    public async getForum(forumName: string): Promise<Forum> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(forumName)
            .fetchJSON();
    }
    
    public async getForumPosts(forumName: string): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(forumName)
            .setAction("posts")
            .fetchJSON();
    }
}

