import { FastifyReply, FastifyRequest } from "fastify";
import { Config } from "../types";

export class Interaction {
    #reply: FastifyReply;
    readonly data: BaseInteractionData;
    readonly config: Config;
    hasReplied = false;
    constructor(_req: FastifyRequest, rep: FastifyReply, data: BaseInteractionData, config: Config) {
        this.#reply = rep;
        this.data = data;
        this.config = config;
    }

    deferReply(ephemeral = false) {
        if(this.hasReplied) return;
        this.hasReplied = true;
        this.#reply.code(200).send({type: 5, data: {flags: ephemeral ? 64 : 0}})
    }

    reply(data: Record<string, any>) {
        if(this.hasReplied) return;
        this.hasReplied = true;
        this.#reply.code(200).send({type: 4, data})
    }

    async error(content: string) {
        const payload = {
            embeds: [{
                color: 0xED4245,
                description: `❌ Error | \`${content}\``
            }],
            flags: 64
        }
        if(this.hasReplied) await this.followUp(payload)
        else this.reply(payload)
    }

    async followUp(data: Record<string, any>) {
        fetch(`${process.env["DISCORD_BASE_URL"]}/webhooks/${this.data.application_id}/${this.data.token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    }
}

export interface BaseInteractionData {
    app_permissions: string;
    application_id: string;
    authorizing_integration_owners: Record<string, string>;
    chananel: {
        flags: number;
        icon: string | null;
        id: string;
        last_message_id: string | null;
        last_pin_timestamp: string | null;
        type: number;
    };
    channel_id: string;
    context: number;
    entitlements: any[];
    id: string;
    locale: string;
    token: string;
    type: number;
    version: number;
}