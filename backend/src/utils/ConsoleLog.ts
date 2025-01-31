import { PRODUCTION } from '@/config/env.config';

export enum Colors {
    WHITE = '\u001b[37m',
    GREEN = '\u001b[32m',
    RED = '\u001b[31m',
    YELLOW = '\u001b[33m',
}

const consoleLog = (message: string) => {
    const currTime = new Date().toLocaleTimeString();
    const white = PRODUCTION ? '' : Colors.WHITE;
    console.log(`${white}[${currTime}] ${message}${white}`);
};

export const consoleLogColor = (color: Colors, message: string) => {
    const colorStr = PRODUCTION ? '' : color;
    consoleLog(`${colorStr}${message}`);
};

export const consoleLogError = (message: string) => consoleLogColor(Colors.RED, message);

export const consoleLogSuccess = (message: string) => consoleLogColor(Colors.GREEN, message);

export const consoleLogWarning = (message: string) => consoleLogColor(Colors.YELLOW, message);

export default consoleLog;
