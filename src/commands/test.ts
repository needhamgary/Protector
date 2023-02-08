import { slashCommand } from "../helpers/createCommands.js";

export default slashCommand({
    name: "test",
    description: "test new command function",
    plugins: [],
    async execute(ctx, options) {
        await ctx.reply({content: "test complete", ephemeral: true})
    },
   
})