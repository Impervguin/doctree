import { Request } from 'express';

export function ParseCookies(req: Request): any {
    const allCookies = req.get('cookie');
    const cookies = {};
    if (allCookies) {
        allCookies.split(';').forEach(cookie => {
            const [key, value] = cookie.split('=');
            cookies[key] = value;
        });
    }
    return cookies;
}