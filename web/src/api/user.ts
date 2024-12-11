import { Post } from "./post";
import { RequestManager } from "./request";

export type UserProfileResponse = {
    username: string;
    displayName: string | null;
    profilePicture: string | null;
    bio: string | null;
    verified: boolean;
    banner: string | null;
    pronouns: string | null;
    followerCount: number;
    followingCount: number;
    userActions: UserProfileActions | null
};

export type UserProfileActions = {
    following: boolean;
    followingYou: boolean;
    blocking: boolean;
    blockingYou: boolean;
}

export type SetProfileRequest = {
    displayName: string | null,
    pronouns: string | null,
    bio: string | null,
    profilePicture: string | null,
    banner: string | null
};

export type SetProfileData = Partial<Omit<SetProfileRequest, "profilePicture" | "banner"> & {
    profilePicture: File | string | null,
    banner: File | string | null
}>

export type FollowResponse = {
    following: boolean
};

export class UserManager extends RequestManager<"user"> {
    private static instance: UserManager | null = null;

    private constructor() {
        super("user");
    }

    public static getInstance(): UserManager {
        if (UserManager.instance === null) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public async getUser(username: string): Promise<UserProfileResponse> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("profile")
            .fetchJSON();
    }
    
    public async updateUser(profile: SetProfileData): Promise<SetProfileRequest> {
        const formData = new FormData();
        if (profile.displayName) formData.append("displayName", profile.displayName);
        if (profile.pronouns) formData.append("pronouns", profile.pronouns);
        if (profile.bio) formData.append("bio", profile.bio);
        if (profile.profilePicture) formData.append("profilePicture", profile.profilePicture);
        if (profile.banner) formData.append("banner", profile.banner);

        return await this.createRequestBuilder()
            .setMethod("POST")
            .setAction("profile")
            .setFormData(formData)
            .fetchJSON();
    }
    
    public async getUserPosts(username: string): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("posts")
            .fetchJSON();
    }

    public async getUserResource(username: string, resource: string): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction(resource)
            .fetchJSON();
    }
    
    public async getFollowers(username: string): Promise<UserProfileResponse[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("followers")
            .fetchJSON();
    }
    
    public async getFollowing(username: string): Promise<UserProfileResponse[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("following")
            .fetchJSON();
    }

    public async getFriends(username: string): Promise<UserProfileResponse[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("friends")
            .fetchJSON();
    }
    
    public async followUser(username: string): Promise<FollowResponse> {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setResource(username)
            .setAction("follow")
            .fetchJSON();
    }
    
    public async getLikes(username: string): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("likes")
            .fetchJSON();
    }

    public async getDislikes(username: string): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setResource(username)
            .setAction("dislikes")
            .fetchJSON();
    }
    
    public async searchUsers(query: string): Promise<UserProfileResponse[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setQuery("query", query)
            .fetchJSON();
    }
    
    public async getBookmarks(): Promise<Post[]> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setAction("bookmarks")
            .fetchJSON();
    }
}
