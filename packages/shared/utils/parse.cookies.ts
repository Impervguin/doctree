export function ParseCookies(req: { get: (header: string) => string | undefined }): any {
    const allCookies = req.get('cookie');
    const cookies = {};
    if (allCookies) {
        allCookies.split(';').forEach(cookie => {
            const [key, value] = cookie.split('=');
            cookies[key.trim()] = value.trim();
        });
    }
    return cookies;
}