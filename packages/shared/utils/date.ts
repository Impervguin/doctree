
export function formatDate(format: string, date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return format.replace(/yyyy/g, year.toString())
        .replace(/MM/g, month.toString().padStart(2, '0'))
        .replace(/dd/g, day.toString().padStart(2, '0'))
        .replace(/HH/g, hours.toString().padStart(2, '0'))
        .replace(/mm/g, minutes.toString().padStart(2, '0'))
        .replace(/ss/g, seconds.toString().padStart(2, '0'));
}

export function parseDate(format: string, date: string): Date {
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6)) - 1;
    const day = parseInt(date.substring(6, 8));
    const hours = parseInt(date.substring(8, 10));
    const minutes = parseInt(date.substring(10, 12));
    const seconds = parseInt(date.substring(12, 14));

    return new Date(year, month, day, hours, minutes, seconds);
}

export function serializeDate(date: Date): string {
    return formatDate("yyyy-MM-ddTHH:mm:ss", date);
}

export function deserializeDate(date: string): Date {
    return parseDate("yyyy-MM-ddTHH:mm:ss", date);
}