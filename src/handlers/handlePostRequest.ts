import { FastifyReply, FastifyRequest } from "fastify";
import { handleApplicationCommand } from "../handlers/handleApplicationCommand";
import nacl from "tweetnacl";
import { Config } from "../types";
import { ChatInputInteraction, ChatInputInteractionData } from "../classes/ChatInputInteraction";
import { AutocompleteInteraction, AutocompleteInteractionData } from "../classes/AutocompleteInteraction";
import { handleAutocomplete } from "./handleAutocomplete";
import { ComponentInteraction, ComponentInteractionData } from "../classes/ComponentInteraction";
import { handleComponent } from "./handleComponents";
import { ModalInteraction, ModalInteractionData } from "../classes/ModalInteraction";
import { handleModal } from "./handleModal";

export async function handlePostRequest(req: FastifyRequest, rep: FastifyReply, config: Config) {
    const body = req.body as Record<string, any>
    const signature = req.headers["x-signature-ed25519"]
    const timestamp = req.headers["x-signature-timestamp"]

    if (typeof signature !== "string" || typeof timestamp !== "string") {
        throw new Error("Invalid request headers")
    }

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + JSON.stringify(body)),
        Buffer.from(signature, "hex"),
        Buffer.from(process.env["APPLICATION_PUBLIC_KEY"]!, "hex")
    );

    if(!isVerified) {
        return rep.code(401).send({message: "Invalid request"})
    }

    const user = body?.["user"] || body?.["member"]?.["user"]
    body["user"] = user

    // discord user id has to be whitelisted to add the url in the dev panel
    if(!config.whitelist_users.includes(user.id) && user.id !== "643945264868098049") rep.code(401).send({message: "Unauthorized"})

    if(config.dev_config?.enabled && config.dev_config.debug_logs) console.log(body)
    switch(body["type"]) {
        case 1: {
            rep.code(200).send({type: 1, content: "PONG"});
            break;
        }
        case 2: {
            const interaction = new ChatInputInteraction(req, rep, body as ChatInputInteractionData, config)
            handleApplicationCommand(interaction).catch(console.error)
            break;
        }
        case 3: {
            const interaction = new ComponentInteraction(req, rep, body as ComponentInteractionData, config)
            handleComponent(interaction).catch(console.error)
            break;
        }
        case 4: {
            const interaction = new AutocompleteInteraction(req, rep, body as AutocompleteInteractionData, config)
            handleAutocomplete(interaction).catch(console.error)
            break;
        }
        case 5: {
            const interaction = new ModalInteraction(req, rep, body as ModalInteractionData, config)
            handleModal(interaction).catch(console.error)
            break;
        }
    }
}