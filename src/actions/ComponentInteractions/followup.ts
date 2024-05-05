import { ComponentInteraction } from "../../classes/ComponentInteraction";

export async function handleFollowup(interaction: ComponentInteraction) {
    if(interaction.data.message.interaction_metadata.user_id !== interaction.data.user.id) return await interaction.error("You can only follow up on your own messages.")
    interaction.sendModal({
        title: "Followup",
        custom_id: "followup",
        components: [{
            type: 1,
            components: [{
                type: 4,
                label: "Message",
                style: 2,
                required: true,
                max_length: 2000,
                custom_id: "message"
            }]
        }]
    })
}