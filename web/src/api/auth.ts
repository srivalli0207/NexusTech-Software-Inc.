import { RequestManager } from "./request";

export class AuthManager extends RequestManager<"auth"> {
    private static instance: AuthManager | null = null;

    private constructor() {
        super("auth");
    }

    public static getInstance(): AuthManager {
        if (AuthManager.instance === null) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    protected override async postRequest(request: Request, _: Response, json?: any) {
        if (!request.url.endsWith("csrf")) {
            const event = new CustomEvent('nexus.auth.changed', {detail: json});
            document.dispatchEvent(event);
        }
    }

    public async getCSRFToken(): Promise<any> {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setAction("csrf")
            .fetchJSON();
    }

    public async getSession() {
        return await this.createRequestBuilder()
            .setMethod("GET")
            .setAction("session")
            .fetchJSON();
    }

    public async login(data: {username: string, password: string}) {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setAction("login")
            .setJSONData(data)
            .fetchJSON();
    }

    public async logout() {
        return await this.createRequestBuilder()
                .setMethod("POST")
                .setAction("logout")
                .fetchJSON();
    }

    public async signup(data: {username: string, email: string, password: string}) {
        return await this.createRequestBuilder()
            .setMethod("POST")
            .setAction("signup")
            .setJSONData(data)
            .fetchJSON();
        // return {message: res.message, user: res.user}
    }
}
