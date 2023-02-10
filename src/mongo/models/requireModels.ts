import { afk } from "./index.js";

export async function setAfk(
  userId: string,
  userName: string,
  afkReason: string,
) {
  const afkData = await afk.findOne({
    _id: userId,
  });

  if (!afkData) {
    const newData = new afk(
      {
        _id: userId,
        username: userName,
        date: Date.now(),
        reason: afkReason,
      },
      {},
      {
        upsert: true,
      }
    );
    await newData.save();

    return newData;
  }
  return afkData;
}


