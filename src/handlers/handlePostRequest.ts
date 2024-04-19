import { FastifyReply, FastifyRequest } from "fastify";
import { handleApplicationCommand } from "../handlers/handleApplicationCommand";
import nacl from "tweetnacl";
import { Config } from "../types";
import { ChatInputInteraction, ChatInputInteractionData } from "../classes/ChatInputInteraction";

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

    switch(body["type"]) {
        case 1: {
            rep.code(200).send({type: 1, content: "PONG"});
            break;
        }
        case 2: {
            const interaction = new ChatInputInteraction(req, rep, body as ChatInputInteractionData, config)
            handleApplicationCommand(interaction).catch(console.error)
        }
    }
}