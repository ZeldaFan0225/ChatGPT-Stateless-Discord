import { handleFollowup } from "../actions/ModalInteractions/followup";
import { ModalInteraction } from "../classes/ModalInteraction";

export async function handleModal(interaction: ModalInteraction) {
    switch(interaction.data.data.custom_id) {
        case "followup": {
            handleFollowup(interaction)
            break;
        }
    }
}