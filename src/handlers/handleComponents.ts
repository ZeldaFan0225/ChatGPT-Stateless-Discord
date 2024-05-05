import { handleFollowup } from "../actions/ComponentInteractions/followup";
import { ComponentInteraction } from "../classes/ComponentInteraction";

export async function handleComponent(interaction: ComponentInteraction) {
    switch(interaction.data.data.custom_id) {
        case "followup": {
            handleFollowup(interaction)
            break;
        }
    }
}