import { ChatInputInteraction } from "../../classes/ChatInputInteraction";
import { Dalle3 } from "../../classes/Connectors/Dalle3";


export async function handleDalle3(interaction: ChatInputInteraction) {
    const prompt = interaction.data.data.options.find(option => option.name === "prompt")?.value || ""
    const aspect_ratio = interaction.data.data.options.find(option => option.name === "aspect_ratio")?.value
    const style = interaction.data.data.options.find(option => option.name === "style")?.value
    const quality = interaction.data.data.options.find(option => option.name === "quality")?.value
    const ephemeral = interaction.data.data.options.find(option => option.name === "ephemeral")?.value || false

    const data = {
        prompt,
        size: aspect_ratio,
        style,
        quality,
        user: interaction.data.user.id
    }

    interaction.deferReply(ephemeral);

    const result = await Dalle3.generateImage(data).catch(console.error)

    if(!result) {
        return await interaction.error("An error occurred while generating the images.")
    }

    const files = result.data.map((r, i) => ({
        name: `image_${i}.png`, 
        file: dataURItoBlob(`data:image/png;base64,${r.b64_json}`)
    }))

    interaction.followUpWithFiles({}, files)
}

function dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const [type, data] = dataURI.split(',')
    if(!type || !data) throw new Error("Unable to parse data URI")
    var byteString = atob(data);

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
}