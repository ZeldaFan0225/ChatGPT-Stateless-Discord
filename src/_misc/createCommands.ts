export async function createCommands() {
    const commands = [
        {
            name: "chat",
            description: "Start a chat with the bot",
            type: 1,
            integration_types: [1],
            contexts: [0, 1, 2],
            options: [{
                type: 3,
                name: "message",
                description: "The message to send to the AI",
                required: true,
            },{
                type: 3,
                name: "system_instruction",
                description: "The system instruction to use",
                required: false,
                autocomplete: true
            },{
                type: 3,
                name: "model",
                description: "The model to use for this request",
                required: false,
                autocomplete: true
            },{
                type: 11,
                name: "image",
                description: "An image to show with the prompt",
                required: false,
            },{
                type: 5,
                name: "ephemeral",
                description: "Whether to show the response or not",
                required: false,
            }]
        },
        {
            name: "image",
            description: "Generate an image with the AI",
            type: 1,
            integration_types: [1],
            contexts: [0, 1, 2],
            options: [{
                type: 3,
                name: "prompt",
                description: "The prompt to use",
                required: true,
            },{
                type: 3,
                name: "aspect_ratio",
                description: "The images aspect ratio",
                required: false,
                choices: [{
                    name: "1:1",
                    value: "1:1"
                },{
                    name: "16:9",
                    value: "16:9"
                },{
                    name: "21:9",
                    value: "21:9"
                },{
                    name: "2:3",
                    value: "2:3"
                },{
                    name: "3:2",
                    value: "3:2"
                },{
                    name: "4:5",
                    value: "4:5"
                },{
                    name: "5:4",
                    value: "5:4"
                },{
                    name: "9:16",
                    value: "9:16"
                },{
                    name: "9:21",
                    value: "9:21"
                }]
            },{
                type: 3,
                name: "model",
                description: "The model to use",
                required: false,
                choices: [{
                    name: "sd3",
                    value: "sd3"
                },{
                    name: "sd3-turbo",
                    value: "sd3-turbo"
                }]
            },{
                type: 5,
                name: "ephemeral",
                description: "Whether to show the response or not",
                required: false,
            }]
        },
        {
            name: "dalle3",
            description: "Generate an image with Dalle3",
            type: 1,
            integration_types: [1],
            contexts: [0, 1, 2],
            options: [{
                type: 3,
                name: "prompt",
                description: "The prompt to use",
                required: true,
            },{
                type: 3,
                name: "aspect_ratio",
                description: "The images aspect ratio",
                required: false,
                choices: [{
                    name: "1024x1024",
                    value: "1024x1024"
                },{
                    name: "1792x1024",
                    value: "1792x1024"
                },{
                    name: "1024x1792",
                    value: "1024x1792"
                }]
            },{
                type: 3,
                name: "style",
                description: "The style to generate the image with",
                required: false,
                choices: [{
                    name: "vivid",
                    value: "vivid"
                },{
                    name: "natural",
                    value: "natural"
                }]
            },{
                type: 3,
                name: "quality",
                description: "The quality to generate the image at",
                required: false,
                choices: [{
                    name: "standard",
                    value: "standard"
                },{
                    name: "hd",
                    value: "hd"
                }]
            },{
                type: 5,
                name: "ephemeral",
                description: "Whether to show the response or not",
                required: false,
            }]
        }
    ]

    await fetch(`${process.env["DISCORD_BASE_URL"]}/applications/${process.env["CLIENT_ID"]}/commands`, {
        method: "PUT",
        headers: {
            "Authorization": `Bot ${process.env["BOT_TOKEN"]}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commands)
    }).then(res => res.json()).then(console.log)
}