import { getCSRFTokenFromCookie } from "../utils/cookie";

export type RequestManagerType = "auth" | "user" | "post" | "message" | "forum" | "comment";
export type RequestManagerResource<T extends RequestManagerType> =
    T extends "user" ? string :
    T extends "post" ? number :
    T extends "message" ? number :
    T extends "forum" ? string :
    T extends "comment" ? number :
    never;
export type RequestBuilderMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type RequestBuilderPreRequest = (request: Request) => Promise<any>;
export type RequestBuilderPostRequest = (request: Request, response: Response, json?: any) => Promise<any>;

const DOMAIN = Object.freeze({
    DEVELOPMENT: 'http://localhost:5173',
    PRODUCTION: 'http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com'
});
 
const BASE_URL = (import.meta.env.MODE == 'production') ? DOMAIN.PRODUCTION : DOMAIN.DEVELOPMENT;
const API_URL = `${BASE_URL}/api/test/`;

export abstract class RequestManager<T extends RequestManagerType> {
    private manager: T;

    public constructor(manager: T) {
        this.manager = manager;
    }

    protected createRequestBuilder(): RequestBuilder<T> {
        return new RequestBuilder(this.manager, this.preRequest, this.postRequest);
    }

    protected async preRequest(_: Request) {}
    protected async postRequest(_: Request, __: Response) {}
}

class RequestBuilder<T extends RequestManagerType> {
    private manager: T;
    private resource?: RequestManagerResource<T>
    private action?: string;
    private method: RequestBuilderMethod;
    private csrf: boolean;
    private redirect: boolean;
    private jsonData?: { [key: string]: any };
    private formData?: FormData;
    private searchParams: { [key: string]: string };
    private preRequest?: RequestBuilderPreRequest;
    private postRequest?: RequestBuilderPostRequest;

    public constructor(manager: T, preRequest?: RequestBuilderPreRequest, postRequest?: RequestBuilderPostRequest) {
        this.manager = manager;
        this.method = "GET";
        this.csrf = false;
        this.redirect = false;
        this.searchParams = {};
        this.preRequest = preRequest;
        this.postRequest = postRequest;
    }

    public setMethod(method: RequestBuilderMethod): RequestBuilder<T> {
        this.method = method;
        return this;
    }

    public setResource(resource: RequestManagerResource<T>): RequestBuilder<T> {
        this.resource = resource;
        return this;
    }

    public setAction(action: string): RequestBuilder<T> {
        this.action = action;
        return this;
    }

    public setCSRF(csrf: boolean = true): RequestBuilder<T> {
        this.csrf = csrf;
        return this;
    }

    public setRedirect(redirect: boolean = true): RequestBuilder<T> {
        this.redirect = redirect;
        return this;
    }

    public setJSONData(data: { [key: string]: string | number | boolean | string[] }): RequestBuilder<T> {
        this.jsonData = data;
        this.formData = undefined;
        return this;
    }
    
    public setFormData(data: FormData): RequestBuilder<T> {
        this.formData = data;
        this.jsonData = undefined;
        return this;
    }

    public setQuery(key: string, value: string): RequestBuilder<T> {
        this.searchParams[key] = value;
        return this;
    }

    public build(): Request {
        const url = new URL(this.manager, API_URL);
        if (this.resource) url.pathname += `/${this.resource}/`;
        if (this.resource && this.action) url.pathname += `${this.action}`;
        else if (this.action) url.pathname += `/${this.action}`;
        if (!this.resource && !this.action && !url.pathname.endsWith("/")) url.pathname += "/";
        for (const [key, value] of Object.entries(this.searchParams)) {
            url.searchParams.append(key, value);
        }
        if (this.redirect) url.searchParams.append("next", window.location.pathname);

        const headers = new Headers({"Accept": "application/json"});
        if (this.jsonData) headers.append("Content-Type", "application/json");
        if (this.csrf) headers.append("X-CSRFToken", getCSRFTokenFromCookie());

        const init: RequestInit = {headers: headers};
        init.method = this.method;
        if (this.jsonData) init.body = JSON.stringify(this.jsonData);
        else if (this.formData) init.body = this.formData;
        
        const request = new Request(url, init);
        return request;
    }

    public async fetchJSON(): Promise<any> {
        const request = this.build();
        if (this.preRequest) await this.preRequest(request);
        const response = await fetch(request);
        
        if (response.redirected)
            window.location.href = response.url

        const json = await response.json();
        if (this.postRequest) await this.postRequest(request, response, json);
        if (response.status !== 200) {
            throw new NexusAPIError(json.error);
        }
        
        return json;
    }
}

export class NexusAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NexusAPIError"
    }
}