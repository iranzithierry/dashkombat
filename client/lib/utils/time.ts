
import { formatDistance, format, isToday, isTomorrow, isWithinInterval, addDays } from 'date-fns';

export function formatResetTime(timestamp: number) {
    const resetDate = new Date(timestamp);
    const now = new Date();
    switch (true) {
        case isToday(resetDate):
            return `Today at ${format(resetDate, 'HH:mm')}`;
        case isTomorrow(resetDate):
            return `Tomorrow at ${format(resetDate, 'HH:mm')}`;
        case isWithinInterval(resetDate, { start: now, end: addDays(now, 7) }):
            return `on ${format(resetDate, 'EEEE')} at ${format(resetDate, 'HH:mm')}`; 
        default:
            return `in ${formatDistance(resetDate, now, { addSuffix: false })} at ${format(resetDate, 'HH:mm')}`;
    }
}

export function getTimeRemaining(timestamp: number) {
    const total = timestamp - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return { total, hours, minutes, seconds };
}

export function formatCountdown(hours: number, minutes: number, seconds: number) {
    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}