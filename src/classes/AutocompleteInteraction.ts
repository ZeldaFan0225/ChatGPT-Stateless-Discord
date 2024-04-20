import { FastifyReply, FastifyRequest } from "fastify";
import { BaseInteractionData, Interaction } from "./Interaction";
import { Config } from "../types";

export class AutocompleteInteraction extends Interaction {
    override readonly data: AutocompleteInteractionData;
    constructor(req: FastifyRequest, rep: FastifyReply, data: AutocompleteInteractionData, config: Config) {
        super(req, rep, data, config);
        this.data = data;
    }

    async autocompleteResult(choices: AutocompleteChoice[]) {
        this.fastifyReply.code(200).send({
            type: 8,
            data: {
                choices
            }
        })
    }
}

export interface AutocompleteInteractionData extends BaseInteractionData {
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
            focused: boolean;
        }[]
    }
}

export interface AutocompleteChoice {
    name: string,
    value: string
}