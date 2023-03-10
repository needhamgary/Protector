// @ts-nocheck
/**
 * This is OwnerOnly plugin, it allows only bot owners to run the command, like eval.
 *
 * @author @EvolutionX-10 [<@697795666373640213>]
 * @version 1.0.0
 * @example
 * ```ts
 * import { ownerOnly } from "../plugins/ownerOnly";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ ownerOnly(["your IDs"]) ],
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 */

import { CommandType, CommandControlPlugin, controller } from "@sern/handler";
export function ownerOnly(ownerIDs: string[]) {
  return CommandControlPlugin<CommandType.Both>(async (ctx, args) => {
    if (ownerIDs.includes(ctx.user.id)) return controller.next();
    //* If you want to reply when the command fails due to user not being owner, you can use following
    await ctx.reply("Only owner can run it!!!");
    return controller.stop(); //! Important: It stops the execution of command!
  });
}

