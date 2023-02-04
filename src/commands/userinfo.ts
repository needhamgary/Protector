import { commandModule, CommandType } from "@sern/handler";
import { publish } from "#plugins";
import { logger } from "#logger";
import { EmbedBuilder, GuildMember, User } from "discord.js";

export default commandModule({
  type: CommandType.CtxUser,
  plugins: [publish()],
  execute: async (ctx) => {
    const target = (await ctx.guild?.members.fetch(
      ctx.targetMember?.user.id!
    )) as GuildMember;
    const fetchedUser = (await target?.user.fetch()) as User;
    const joins = (target.joinedTimestamp! / 1000) as unknown as string;
    const accs = (target.user.createdTimestamp! / 1000) as unknown as string;
    const accountCreation = parseInt(accs);
    const joiningTime = parseInt(joins);
    const Response = new EmbedBuilder()
      .setColor("Aqua")
      .setAuthor({
        name: target.user.tag,
        iconURL: target.user.avatarURL()!,
      })
      .setThumbnail(target.user.avatarURL())
      .setDescription(
        `• UserID: ${target.user.id}
        • Roles: ${
          target.roles.cache
            .map((r) => r)
            .join(" ")
            .replace("@everyone", "") || "none"
        }
        • Account Created <t:${accountCreation}:D> | <t:${accountCreation}:R>
        • Account Joined <t:${joiningTime}:D> | <t:${joiningTime}:R>            
            `
      )
      .setImage(fetchedUser.bannerURL()!);

    ctx.reply({
      embeds: [Response],
      ephemeral: false,
    });
  },
});
