import { ChatGPT } from "../../classes/ChatCompletion/ChatGPT";
import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { ChatCompletionMessages } from "../../types";

export async function handleChat(interaction: ChatInputInteraction) {
    const prompt = interaction.data.data.options.find(option => option.name === "prompt")?.value || ""
    const imageId = interaction.data.data.options.find(option => option.name === "image")?.value
    const imageData = imageId ? interaction.data.data.resolved?.attachments[imageId] : null
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    const userMessages = []

    if(imageData) {
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
            content: interaction.config.completion_configuration?.system ?? "system"
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

    const getsFlagged = await ChatGPT.checkIfPromptGetsFlagged(prompt)

    if(getsFlagged) return await interaction.error("Your prompt has been flagged.")

    console.log("requesting completion...")
    const completion = await ChatGPT.requestChatCompletion(messages, interaction.data.id, interaction.config)

    interaction.followUp({
        content: completion.choices[0]?.message.content || "No response",
        flags: ephemeral ? 64 : 0
    })
}