import { env } from "#util";
import mongoose, { connect } from "mongoose";
import { client } from "#client";

export default async function getConnected(url?: string) {
    mongoose.set("strictQuery", false);
    await connect(url? url: env.mongouri);
}

