import { FastifyReply, FastifyRequest } from "fastify";
import { BaseInteractionData, Interaction } from "./Interaction";
import { Config } from "../types";

export class ModalInteraction extends Interaction {
    override readonly data: ModalInteractionData;
    constructor(req: FastifyRequest, rep: FastifyReply, data: ModalInteractionData, config: Config) {
        super(req, rep, data, config);
        this.data = data;
    }
}

export interface ModalInteractionData extends BaseInteractionData {
    data: {
        custom_id: string;
        components: Record<string, any>[];
    },
    message: {
        interaction_metadata: {
            user_id: string;
        };
        embeds: Record<string, any>[];
        content: string | null;
        attachments: {
            url: string;
        }[];
        flags: number;
    }
}