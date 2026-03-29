import { translations } from "./i18n";

export type Language = keyof typeof translations;

export type Message = {
    id: string;
    role: 'user' | 'agent';
    content: string;
    status?: string;
};