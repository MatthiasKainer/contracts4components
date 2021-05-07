import { Definition } from ".."
import { toContract } from "../store"
import * as http from "http"
import * as https from "https"

type RequestOptions = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS",
    expectedStatus: number
}

export const request = <T>(url: string,
    {method, expectedStatus}: RequestOptions = {method: "GET", expectedStatus: 200},
    data?: T) => {
    const u = new URL(url)
    const req = (u.protocol === "https" ? https.request : http.request)
    return new Promise<string>((resolve, reject) => {
        const current = req(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            if (res.statusCode !== expectedStatus) {
                return reject(`[ERROR][${url}][${res.statusCode}][${method}] Call failed`)
            }
            res.setEncoding('utf8');
            let response = ""
            res.on('data', (chunk) => {
                response += chunk
            });
            res.on('end', () => {
                resolve(response)
            });
        })
        current.on('error', (e: Error) => {
            console.error(`[ERROR][${url}][500][${method}] ${e.message}`);
            reject(e)
        });

        if (data) current.write(JSON.stringify(data));
        current.end();

    })
}