import { FastifyReply, FastifyRequest } from "fastify";
import { BaseInteractionData, Interaction } from "./Interaction";
import { Config } from "../types";

export class ChatInputInteraction extends Interaction {
    override readonly data: ChatInputInteractionData;
    constructor(req: FastifyRequest, rep: FastifyReply, data: ChatInputInteractionData, config: Config) {
        super(req, rep, data, config);
        this.data = data;
    }
}

export interface ChatInputInteractionData extends BaseInteractionData {
    data: {
        id: string;
        name: string;
        type: 1;
        resolved?: {
            attachments: Record<string, {
                content_type?: string;
                id: string;
                filename: string;
                size: number;
                url: string;
                proxy_url: string;
                height: number;
                width: number;
            }>
        }
        options: {
            name: string;
            type: number;
            value: any;
        }[]
    }
}