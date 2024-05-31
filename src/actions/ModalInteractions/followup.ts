import { constructAvatarUrl, getAttachmentContent } from "../../_misc/utils";
import { ChatGPT } from "../../classes/Connectors/ChatGPT";
import { ModalInteraction } from "../../classes/ModalInteraction";

export async function handleFollowup(interaction: ModalInteraction) {
    const ephemeral = (interaction.data.message.flags & 64) === 64
    interaction.deferReply(ephemeral);
    const original_prompt = interaction.data.message.embeds[0]!["description"]
    const original_response = interaction.data.message.attachments[0]?.url ? await getAttachmentContent(interaction.data.message.attachments[0]?.url) : interaction.data.message.content
    const [model, system_instruction] = interaction.data.message.embeds[0]!["footer"].text.split(" | ") || ""
    const model_data = interaction.config.models?.[model]
    const system_instruction_data = interaction.config.selectable_system_instructions?.find(i => i.name === system_instruction)
    const prompt = interaction.data.data.components[0]!["components"][0]!.value
    if(!model_data || !system_instruction_data || !original_prompt || !original_response) return await interaction.error("Invalid model or system instruction.")

    if(interaction.data.message.interaction_metadata.user_id !== interaction.data.user.id) return await interaction.error("You can only follow up on your own messages.")

    const userMessages = []
    if(interaction.data.message.embeds.length > 1) {
        userMessages.push(interaction.data.message.embeds.map(e => ({
            type: "image_url" as const,
            image_url: {
                url: e["image"].url as string,
                detail: "auto" as const
            }
        })))
    }
    
    const messages = [
        {
            role: "system" as const,
            content: system_instruction_data.system_instruction
        },
        {
            role: "user" as const,
            content: [
                ...userMessages,
                {
                    type: "text" as const,
                    text: original_prompt as string
                }
            ]
        },
        {
            role: "assistant" as const,
            content: original_response as string
        },
        {
            role: "user" as const,
            content: prompt
        }
    ]

    if(model_data.moderation?.enabled) {
        const getsFlagged = await ChatGPT.checkIfPromptGetsFlagged(prompt)
        if(getsFlagged) return await interaction.error("Your prompt has been flagged.")
    }

    const completion = await ChatGPT.requestChatCompletion(messages, model_data, interaction.data.user.id)

    const reply = completion.choices[0]?.message.content || "No response";

    const embeds = [{
        author: {
            name: interaction.data.user.global_name || interaction.data.user.username,
            icon_url: constructAvatarUrl({avatar: interaction.data.user.avatar, user_id: interaction.data.user.id})
        },
        color: 0x5865F2,
        description: prompt,
        footer: {text: `${model} | ${system_instruction}`},
    }]
    if(reply.length > 2000) {
        const res = await interaction.followUpWithFile({
            flags: ephemeral ? 64 : 0,
            embeds
        }, new Blob([reply], {type: "text/plain"}), "response.txt")
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(res?.errors || res)
    } else {
        const res = await interaction.followUp({
            content: reply,
            flags: ephemeral ? 64 : 0,
            embeds
        })
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(res?.errors || res)
    }
}