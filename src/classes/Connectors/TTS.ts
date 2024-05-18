import { Config } from "../../types"

export class TTS {
    static config: Config

    static async generateAudio(data: TTSGenerationRequest) {
        const requestData = {
            response_format: "mp3",
            ...data
        }

        const openaiReq = await fetch(`https://api.openai.com/v1/audio/speech`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env["OPENAI_TOKEN"]}`
            },
            body: JSON.stringify(requestData)
        })

        if(openaiReq.status !== 200) {
            if(this.config.dev_config?.enabled && this.config.dev_config.debug_logs) console.log(`Failed with status: ${openaiReq.status}`)
            throw new Error("Unable to generate audio")
        }

        return await openaiReq.blob();
    }
}

export interface TTSGenerationRequest {
    model: "tts-1" | "tts-1-hd"
    input: string,
    voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
    speed?: string
}

export interface Dalle3Response {
    b64_json: string,
    revised_prompt: string
}