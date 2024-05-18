import { Config } from "../../types"

export class Dalle3 {
    static config: Config

    static async generateImage(data: Dalle3ImageGenerationRequest) {
        const requestData = {
            response_format: "b64_json",
            model: "dall-e-3",
            ...data
        }

        const openaiReq = await fetch(`https://api.openai.com/v1/images/generations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env["OPENAI_TOKEN"]}`
            },
            body: JSON.stringify(requestData)
        })

        const result: {data: Dalle3Response[], created: number} = await openaiReq.json()
        if(this.config.dev_config?.enabled && this.config.dev_config.debug_logs) console.log(result)

        if(!result?.created) throw new Error(`Unable to generate response`)
        
        return result
    }
}

export interface Dalle3ImageGenerationRequest {
    prompt: string
    quality?: "standard" | "hd",
    size?: "1024x1024" | "1792x1024" | "1024x1792",
    style?: "vivid" | "natural",
    user?: string
}

export interface Dalle3Response {
    b64_json: string,
    revised_prompt: string
}