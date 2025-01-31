import { useEffect, useMemo, useState } from 'react';

/**
 * Custom hook to countdown a value by a given interval (default 1s).
 * @param initialValue The initial value to countdown from, in seconds.
 * @param interval The interval to countdown by (default 1s), in seconds.
 * @returns The current countdown value, start, pause, and reset functions.
 */
export const useCountdown = (initialValue: number, interval: number = 1) => {
    const [countdown, setCountdown] = useState<number>(initialValue);
    const [isActive, setIsActive] = useState<boolean>(false);
    const intervalMS = useMemo(() => interval * 1000, [interval]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isActive && countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, intervalMS);
        } else if (countdown <= 0) {
            setIsActive(false);
            setCountdown(initialValue);
        }

        return () => clearInterval(intervalId);
    }, [countdown, isActive]);

    const start = () => setIsActive(true);
    const pause = () => setIsActive(false);
    const reset = () => setCountdown(initialValue);

    return { countdown, isActive, start, pause, reset };
};
