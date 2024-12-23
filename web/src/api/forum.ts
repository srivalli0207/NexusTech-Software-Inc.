import { Post } from "./post";
import { RequestManager } from "./request";
import { UserProfileResponse } from "./user";

export type Forum = {
    name: string,
    description: string,
    icon: string | null,
    banner: string | null,
    creator: UserProfileResponse,
    followerCount: number,
    userActions: ForumActions | null,
}

export type ForumActions = {
    following: boolean
}

export type ForumFollow = {
    following: boolean
}

export type CreateForumRequest = {
    name: string;
    description: string;
    icon: File | null;
    banner: File | null;
};

export type EditForumData = {
    description: string;
    icon: File | string | null;
    banner: File | string | null;
};

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

    public async getForums(filter?: string): Promise<Forum[]> {
        const builder = this.createRequestBuilder().setMethod("GET");
        if (filter) builder.setQuery("filter", filter);
        return await builder.fetchJSON();
    }

    public async createForum(formState: CreateForumRequest): Promise<Forum> {
        const formData = new FormData();
        formData.append("name", formState.name);
        formData.append("description", formState.description);
        if (formState.icon) formData.append("icon", formState.icon);
        if (formState.banner) formData.append("banner", formState.banner);

        return await this.createRequestBuilder()
            .setMethod("POST")
            .setAction("create")
            .setFormData(formData)
            .fetchJSON();
    }

    public async editForum(forum: string, formData: EditForumData): Promise<Forum> {
        const form = new FormData();
        form.append("description", formData.description);
        if (formData.icon) form.append("icon", formData.icon);
        if (formData.banner) form.append("banner", formData.banner);

        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(forum)
            .setAction("edit")
            .setFormData(form)
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

    public async followForum(forumName: string): Promise<ForumFollow> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(forumName)
            .setAction("follow")
            .fetchJSON();
    }
}

