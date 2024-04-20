import { handleChat } from "../actions/AutocompleteInteractions/chat";
import { AutocompleteInteraction } from "../classes/AutocompleteInteraction";

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
    switch(interaction.data.data.name) {
        case "chat": {
            handleChat(interaction)
            break;
        }
    }
}