import { AutocompleteInteraction } from "../../classes/AutocompleteInteraction";

export async function handleChat(interaction: AutocompleteInteraction) {
    const focused = interaction.data.data.options.find(option => option.focused)

    switch(focused?.name) {
        case "system_instruction": {
            const choices = interaction.config.selectable_system_instructions?.filter(i => i.name?.toLowerCase().includes(focused.value.toLowerCase()))
            interaction.autocompleteResult(choices?.map(i => ({ name: i.name, value: i.name })).slice(0, 25) || [])
            break;
        }
        case "model": {
            const choices = Object.keys(interaction.config.models || {}).filter(m => m.toLowerCase().includes(focused.value.toLowerCase()))
            interaction.autocompleteResult(choices?.map(i => ({ name: i, value: i })).slice(0, 25) || [])
            break;
        }
    }
    console.log(interaction.data, focused)
}