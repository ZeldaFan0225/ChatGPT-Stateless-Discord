import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { StabilityAI } from "../../classes/Connectors/StabilityAI";

export async function handleImage(interaction: ChatInputInteraction) {
    const prompt = interaction.data.data.options.find(option => option.name === "prompt")?.value || ""
    const aspect_ratio = interaction.data.data.options.find(option => option.name === "aspect_ratio")?.value
    const model = interaction.data.data.options.find(option => option.name === "model")?.value
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    const data = {
        prompt,
        aspect_ratio,
        model
    }

    interaction.deferReply(ephemeral);

    const result = await StabilityAI.generateImage(data).catch(console.error)

    if(!result) {
        return await interaction.error("An error occurred while generating the image.")
    }

    interaction.followUpWithFile({}, result, "image.png")
}