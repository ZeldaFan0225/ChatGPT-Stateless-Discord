import { handleChat } from "../actions/ChatInputInteractions/chat";
import { ChatInputInteraction } from "../classes/ChatInputInteraction";

export async function handleApplicationCommand(interaction: ChatInputInteraction) {
    switch(interaction.data.data.name) {
        case "chat": {
            handleChat(interaction)
            break;
        }
    }
}