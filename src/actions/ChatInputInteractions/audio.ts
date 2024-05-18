import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { TTS } from "../../classes/Connectors/TTS";


export async function handleAudio(interaction: ChatInputInteraction) {
    const input = interaction.data.data.options.find(option => option.name === "input")?.value || ""
    const model = interaction.data.data.options.find(option => option.name === "model")?.value
    const voice = interaction.data.data.options.find(option => option.name === "voice")?.value
    const speed = interaction.data.data.options.find(option => option.name === "speed")?.value
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    const data = {
        input,
        model,
        voice,
        speed
    }

    interaction.deferReply(ephemeral);

    const result = await TTS.generateAudio(data).catch(console.error)

    if(!result) {
        return await interaction.error("An error occurred while generating the audio.")
    }

    interaction.followUpWithFile({}, result, "audio.mp3")
}