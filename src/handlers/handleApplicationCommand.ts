import { handleAudio } from "../actions/ChatInputInteractions/audio";
import { handleChat } from "../actions/ChatInputInteractions/chat";
import { handleDalle3 } from "../actions/ChatInputInteractions/dalle3";
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
        case "dalle3": {
            handleDalle3(interaction)
            break;
        }
        case "audio": {
            handleAudio(interaction)
            break;
        }
    }
}