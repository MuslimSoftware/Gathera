/**
 * Returns 3 strings representing the time until an event: short, medium, and full.
 *
 * short: "35m", "6h", "3d", "1w", "1mo", ...
 *
 * medium: "Today (35m)", "Tomorrow (1d)", "Sunday (6d)", "Monday (1w)", "Monday (2mo)", ...
 *
 * full: "Today @ 6:30 PM", "Tomorrow @ 8:00 AM", "Sunday, Jun 12 @ 12:00 PM", ...
 *
 * @param eventDate The date of the event as a string.
 * @returns An object containing 3 strings representing the time until the event.
 */
export const getTimeUntilEvent = (eventDateStr: string | Date) => {
    const eventDate = new Date(eventDateStr);
    if (isNaN(eventDate.getTime())) throw new Error('Invalid date.');

    // ANDROID: ['Friday', 'Jun 16', '3:34 PM']
    // IOS: ['Monday', 'Jun 12 at 7:07 PM']
    const eventDateFull = eventDate
        .toLocaleString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        })
        .split(', ');
    const isAndroid = eventDateFull.length === 3;
    const isIOS = eventDateFull.length === 2;

    const eventWeekday = eventDateFull[0];
    const eventDayMonth = eventDateFull[1];
    let eventTime = eventDateFull[2];

    // on IOS, eventTime is undefined
    if (isIOS) {
        eventTime = eventDateFull[1].split(' at ')[1];
    }

    // Calculate # of days until event
    const today = new Date();
    let diffMinutes = Math.floor(Math.abs(eventDate.getTime() - today.getTime()) / (1000 * 60));

    // Calculate # of hours until event, rounded down
    const diffHours = Math.floor(diffMinutes / 60);

    // Calculate # of days until event, rounded down
    let diffDays = Math.floor(diffHours / 24);

    // Calculate # of weeks until event, rounded down
    const diffWeeks = Math.floor(diffDays / 7);

    // Calculate # of months until event, rounded down
    const diffMonths = Math.floor(diffWeeks / 4);

    const prefix = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${eventWeekday}`;
    const short =
        diffMonths >= 1
            ? `${diffMonths}mo`
            : diffWeeks >= 1
            ? `${diffWeeks}w`
            : diffDays >= 1
            ? `${diffDays}d`
            : diffHours >= 1
            ? `${diffHours}h`
            : `${diffMinutes}m`;

    let full = `${prefix}, ${eventDayMonth}${isIOS ? '' : ` at ${eventTime}`}`;
    if (prefix.toLowerCase().trim() === 'today' || prefix.toLowerCase().trim() === 'tomorrow') {
        full = `${prefix} at ${eventTime}`;
    }

    const splitTime = full.split(' at ');
    const full_split = {
        date: splitTime[0],
        time: splitTime[1],
    };

    return {
        short: `${short}`,
        medium: `${prefix.replace(',', '')} ${eventTime}`,
        full,
        full_split,
    };
};
