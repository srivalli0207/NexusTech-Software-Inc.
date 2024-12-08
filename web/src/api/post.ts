import { RequestManager } from "./request";
import { UserResponse } from "./user";

export type PostActions = {
    liked: boolean | null; // liked = true, disliked = false, none = null
    bookmarked: boolean;
};

export type Post = {
    id: number;
    user: UserResponse;
    forum: string | null;
    text: string | null;
    date: string;
    media: { id: number; type: string; url: string }[];
    actions: PostActions | null;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
};

export type CreatePost = Partial<{
    text: string,
    forum: string
    images: FileList,
    video: FileList
}>

export type PostLike = {
    liked: boolean | null;
    likeCount: number;
    dislikeCount: number
};

export type PostBookmark = {
    bookmarked: boolean;
};

export class PostManager extends RequestManager<"post"> {
    private static instance: PostManager | null = null;

    private constructor() {
        super("post");
    }

    public static getInstance(): PostManager {
        if (PostManager.instance === null) {
            PostManager.instance = new PostManager();
        }
        return PostManager.instance;
    }

    public async getPosts(): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .fetchJSON();
    }

    public async createPost(data: CreatePost): Promise<Post> {
        const formData = new FormData();
        if (data.text) formData.set("text", data.text);
        if (data.forum) formData.set("forum", data.forum);
        if (data.images) {
            for (const file of data.images) {
                formData.append("images", file);
            }
        } else if (data.video) {
            formData.set("video", data.video.item(0)!);
        }
        
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setFormData(formData)
            .fetchJSON();
    }

    public async getPost(postId: number): Promise<Post> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(postId)
            .fetchJSON();
    }

    public async deletePost(postId: number): Promise<void> {
        return await this.createRequestBuilder()
            .setMethod("DELETE")
            .setResource(postId)
            .fetchJSON();
    }

    public async likePost(postId: number, like: boolean): Promise<PostLike> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(postId)
            .setAction("like")
            .setQuery("like", like ? "true" : "false")
            .fetchJSON();
    }

    public async bookmarkPost(postId: number): Promise<PostBookmark> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(postId)
            .setAction("bookmark")
            .fetchJSON();
    }
}












