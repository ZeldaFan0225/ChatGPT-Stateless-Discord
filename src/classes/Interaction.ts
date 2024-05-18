import { FastifyReply, FastifyRequest } from "fastify";
import { Config } from "../types";

export class Interaction {
    protected fastifyReply: FastifyReply;
    readonly data: BaseInteractionData;
    readonly config: Config;
    hasReplied = false;
    constructor(_req: FastifyRequest, rep: FastifyReply, data: BaseInteractionData, config: Config) {
        this.fastifyReply = rep;
        this.data = data;
        this.config = config;
    }

    deferReply(ephemeral = false) {
        if(this.hasReplied) return;
        this.hasReplied = true;
        this.fastifyReply.code(200).send({type: 5, data: {flags: ephemeral ? 64 : 0}})
    }

    reply(data: Record<string, any>) {
        if(this.hasReplied) return;
        this.hasReplied = true;
        this.fastifyReply.code(200).send({type: 4, data})
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
        return await fetch(`${process.env["DISCORD_BASE_URL"]}/webhooks/${this.data.application_id}/${this.data.token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    }

    async followUpWithFile(data: Record<string, any>, file: Blob, name: string) {
        const formData = new FormData();
        formData.set("payload_json", JSON.stringify(data));
        formData.set("files[0]", file, name);

        return await fetch(`${process.env["DISCORD_BASE_URL"]}/webhooks/${this.data.application_id}/${this.data.token}`, {
            method: "POST",
            body: formData
        }).then(res => res.json())
    }

    async followUpWithFiles(data: Record<string, any>, files: {file: Blob, name: string}[]) {
        const formData = new FormData();
        formData.set("payload_json", JSON.stringify(data));
        for(let i = 0; i < files.length; i++) {
            formData.set(`files[${i}]`, files[i]!.file, files[i]!.name);
        }

        return await fetch(`${process.env["DISCORD_BASE_URL"]}/webhooks/${this.data.application_id}/${this.data.token}`, {
            method: "POST",
            body: formData
        }).then(res => res.json())
    }

    async sendModal(data: Record<string, any>) {
        if(this.hasReplied) return;
        this.hasReplied = true;
        this.fastifyReply.code(200).send({type: 9, data})
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
    user: {
        avatar: string | null;
        avatar_decoration_data: null | {
            asset: string;
            sku_id: string;
        };
        clan: any;
        discriminator: string;
        global_name: string;
        id: string;
        public_flags: number;
        username: string;
    };
}