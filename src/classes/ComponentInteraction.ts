import { FastifyReply, FastifyRequest } from "fastify";
import { BaseInteractionData, Interaction } from "./Interaction";
import { Config } from "../types";

export class ComponentInteraction extends Interaction {
    override readonly data: ComponentInteractionData;
    constructor(req: FastifyRequest, rep: FastifyReply, data: ComponentInteractionData, config: Config) {
        super(req, rep, data, config);
        this.data = data;
    }
}

export interface ComponentInteractionData extends BaseInteractionData {
    data: {
        custom_id: string;
        component_type: ComponentType
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

export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT_MENU = 3,
    TEXT_INPUT = 4,
    USER_SELECT_MENU = 5,
    ROLE_SELECT_MENU = 6,
    MENTIONABLE_SELECT_MENU = 7,
    CHANNEL_SELECT_MENU = 8,
}