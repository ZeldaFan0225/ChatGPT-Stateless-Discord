import { ChatGPT } from "../../classes/Connectors/ChatGPT";
import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { ChatCompletionMessages } from "../../types";

export async function handleChat(interaction: ChatInputInteraction) {
    const prompt = interaction.data.data.options.find(option => option.name === "message")?.value || ""
    const system_instruction_name = interaction.data.data.options.find(option => option.name === "system_instruction")?.value || interaction.config.default_system_instruction
    const model = interaction.data.data.options.find(option => option.name === "model")?.value || interaction.config.default_model
    const imageId = interaction.data.data.options.find(option => option.name === "image")?.value
    const imageData = imageId ? interaction.data.data.resolved?.attachments[imageId] : null
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    const model_config = interaction.config.models?.[model]
    const system_instruction = interaction.config.selectable_system_instructions?.find(i => i.name === system_instruction_name)

    if(!model_config) return await interaction.error("Invalid model.")
    if(!system_instruction) return await interaction.error("Invalid system instruction.")

    const userMessages = []

    if(imageData && model_config.images?.supported) {
        if(!imageData.content_type?.startsWith("image")) return await interaction.error("The image must be an image.")
        userMessages.push({
            type: "image_url" as const,
            image_url: {
                url: imageData.url,
                detail: "auto" as const
            }
        })
    }

    const messages: ChatCompletionMessages[] = [
        {
            role: "system",
            content: system_instruction.system_instruction
        },
        {
            role: "user",
            content: [
                ...userMessages,
                {
                    type: "text",
                    text: prompt
                }
            ]
        }
    ]

    interaction.deferReply(ephemeral);

    if(model_config.moderation?.enabled) {
        const getsFlagged = await ChatGPT.checkIfPromptGetsFlagged(prompt)
        if(getsFlagged) return await interaction.error("Your prompt has been flagged.")
    }

    const completion = await ChatGPT.requestChatCompletion(messages, model_config, interaction.data.user.id)

    const reply = completion.choices[0]?.message.content || "No response";
    if(reply.length > 2000) {
        const res = await interaction.followUpWithFile({
            flags: ephemeral ? 64 : 0
        }, new Blob([reply], {type: "text/plain"}), "response.txt")
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(res?.errors || res)
    } else {
        const res = await interaction.followUp({
            content: reply,
            flags: ephemeral ? 64 : 0
        })
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(res?.errors || res)
    }
}