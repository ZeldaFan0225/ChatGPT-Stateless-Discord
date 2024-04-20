import { handleChat } from "../actions/ChatInputInteractions/chat";
import { handleImage } from "../actions/ChatInputInteractions/image";
import { ChatInputInteraction } from "../classes/ChatInputInteraction";

export async function handleApplicationCommand(interaction: ChatInputInteraction) {
    switch(interaction.data.data.name) {
        case "chat": {
            handleChat(interaction)
            break;
        }
        case "image": {
            handleImage(interaction)
            break;
        }
    }
}