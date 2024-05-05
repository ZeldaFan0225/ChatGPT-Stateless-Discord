export function constructAvatarUrl(data: {avatar: string | null, user_id: string}) {
    if(!data.avatar) return `https://cdn.discordapp.com/embed/avatars/${BigInt(data.user_id) % 6n}.png`
    return `https://cdn.discordapp.com/avatars/${data.user_id}/${data.avatar}.${data.avatar.startsWith("a_") ? "gif" : "png"}`
}

export async function getAttachmentContent(url: string) {
    const response = await fetch(url);
    return await response.text();
}