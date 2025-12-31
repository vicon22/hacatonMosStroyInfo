import { HTTPError } from './errors';
import { HTTPMethod } from './types';

export class ApiClient {
    static root = '/api';
    private static _instance: ApiClient;

    private headers: HeadersInit = {};
    private static contentTypeHeaders = {
        'Content-Type': 'application/json'
    };
 
    private getBaseUrl(): string {
        return String(process.env.API_ROOT || process.env.NEXT_PUBLIC_API_ROOT);
    }
 
    private request(url: string, method: HTTPMethod, params?: Partial<RequestInit>) {
        const baseUrl = this.getBaseUrl();
        const fullUrl = `${baseUrl}${ApiClient.root}${url}`;
        
        return fetch(fullUrl, {
            credentials: 'include',
            method,
            ...params,
            headers: {
                ...this.headers,
                ...params?.headers,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new HTTPError(response.statusText, {
                        code: response.status
                    });
                }

                if (response.status === 204) {
                    return Promise.resolve({})
                }
               
                return response.json();
            })
            .catch(e => {
                console.error(`[ApiClient] Error for ${url}:`, e);
                throw e;
            })
    }

    public addHeaders(headers?: HeadersInit) {
        if (headers) {
            this.headers = headers;
        }

        return this;
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    get<R>(url: string): Promise<R> {
        return this.request(url, HTTPMethod.get);
    }

    post<P, R>(url: string, payload: P): Promise<R> {
        return this.request(url, HTTPMethod.post, {
            headers: ApiClient.contentTypeHeaders,
            body: JSON.stringify(payload)
        });
    }

    put<P, R>(url: string, payload: P): Promise<R> {
        return this.request(url, HTTPMethod.put, {
            headers: ApiClient.contentTypeHeaders,
            body: JSON.stringify(payload)
        });
    }

    delete<R>(url: string): Promise<R> {
        return this.request(url, HTTPMethod.delete);
    }
}
