import { HTTPError } from './errors';
import { HTTPMethod } from './types';

export class ApiClient {
    static root = 'http://localhost/api';
    private static _instance: ApiClient;

    private headers: HeadersInit = {};
    private static contentTypeHeaders = {
        'Content-Type': 'application/json'
    };
 
    private request(url: string, method: HTTPMethod, params?: Partial<RequestInit>) {
        return fetch(`${ApiClient.root}${url}`, {
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

               
                const res = response.json()

                 if (url.includes('user')) {
                    console.log(res)
                }

                return res;
            })
            .catch(e => console.log(url, e))
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

        if (url.includes('user')) {
            console.log(this.headers);
        }

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
