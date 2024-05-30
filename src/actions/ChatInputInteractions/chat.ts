import { ChatGPT } from "../../classes/Connectors/ChatGPT";
import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { ChatCompletionMessages } from "../../types";
import { constructAvatarUrl } from "../../_misc/utils";
import { inspect } from "util";

export async function handleChat(interaction: ChatInputInteraction) {
    const prompt = interaction.data.data.options.find(option => option.name === "message")?.value || ""
    const system_instruction_name = interaction.data.data.options.find(option => option.name === "system_instruction")?.value || interaction.config.default_system_instruction
    const model = interaction.data.data.options.find(option => option.name === "model")?.value || interaction.config.default_model
    const imageIds = interaction.data.data.options.filter(option => option.name.startsWith("image")).map(o => o.value)
    const imageData = imageIds.map(id => interaction.data.data.resolved?.attachments[id]) || null
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(imageData)

    const model_config = interaction.config.models?.[model]
    const system_instruction = interaction.config.selectable_system_instructions?.find(i => i.name === system_instruction_name)

    if(!model_config) return await interaction.error("Invalid model.")
    if(!system_instruction) return await interaction.error("Invalid system instruction.")

    const userMessages = []

    if(imageData?.length && model_config.images?.supported) {
        if(!imageData.some(d => !d || d.content_type?.startsWith("image"))) return await interaction.error("The image must be an image.")
        userMessages.push(...imageData.map(d => ({
            type: "image_url" as const,
            image_url: {
                url: d!.url,
                detail: "auto" as const
            }
        })))
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
    const components = [{
        type: 1,
        components: [{
            type: 2,
            style: 1,
            label: "Followup",
            custom_id: "followup",
        }]
    }]
    const embeds = [{
        author: {
            name: interaction.data.user.global_name || interaction.data.user.username,
            icon_url: constructAvatarUrl({avatar: interaction.data.user.avatar, user_id: interaction.data.user.id})
        },
        color: 0x5865F2,
        description: prompt,
        footer: {text: `${model} | ${system_instruction_name}`},
    }, ...imageData.map(d => ({
        color: 0x5865F2,
        title: d?.filename || "Image",
        image: {url: d?.url},
    }))]

    const additionalDataPayload: Record<string, any> = {}
    if(interaction.config.allow_followup) {
        additionalDataPayload["components"] = components
        additionalDataPayload["embeds"] = embeds
    }
    
    if(reply.length > 2000) {
        const res = await interaction.followUpWithFile({
            flags: ephemeral ? 64 : 0,
            ...additionalDataPayload
        }, new Blob([reply], {type: "text/plain"}), "response.txt")
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(inspect(res?.errors || res, {depth: null}))
    } else {
        const res = await interaction.followUp({
            content: reply,
            flags: ephemeral ? 64 : 0,
            ...additionalDataPayload
        })
        if(interaction.config.dev_config?.enabled && interaction.config.dev_config.debug_logs) console.log(inspect(res?.errors || res, {depth: null}))
    }
}