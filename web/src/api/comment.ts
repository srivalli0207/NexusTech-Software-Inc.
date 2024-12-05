import { PostLike } from "./post";
import { RequestManager } from "./request";


export type Comment = {
    id: number,
    creation_date: string,
    last_updated: string,
    content: string,
    liked: boolean | null,
    likeCount: number,
    dislikeCount: number,
    replyCount: number,
    user: {
        username: string,
        avatar: string,
        banner: string,
        display_name: string,
        bio: string,
    }
}

export class CommentManager extends RequestManager<"comment"> {
    private static instance: CommentManager | null = null;

    private constructor() {
        super("comment");
    }

    public static getInstance(): CommentManager {
        if (CommentManager.instance === null) {
            CommentManager.instance = new CommentManager();
        }
        return CommentManager.instance;
    }

    public async getComments(postId: number): Promise<Comment[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setQuery("post", postId.toString())
            .fetchJSON();
    }

    public async postComment(postId: number, content: string): Promise<Comment> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setQuery("post", postId.toString())
            .setJSONData({ "content": content })
            .setRedirect(true)
            .fetchJSON();
    }

    public async deleteComment(commentID: number): Promise<void> {
        return await this.createRequestBuilder()
            .setMethod("DELETE")
            .setQuery("comment_id", commentID.toString())
            .setRedirect(true)
            .fetchJSON();
    }

    public async likeComment(commentId: number, like: boolean): Promise<PostLike> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(commentId)
            .setAction("like")
            .setQuery("like", like ? "true" : "false")
            .setRedirect(true)
            .fetchJSON();
    }

    public async postCommentReply(parentCommentID: number, content: string): Promise<Comment> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setAction("post_reply")
            .setJSONData({ "content": content })
            .setQuery("parent_comment_id", parentCommentID.toString())
            .setRedirect(true)
            .fetchJSON()
    }

    public async getCommentReplies(parentCommentID: number): Promise<Comment[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setAction("get_replies")
            .setQuery("parent_comment_id", parentCommentID.toString())
            .fetchJSON()
    }
}

