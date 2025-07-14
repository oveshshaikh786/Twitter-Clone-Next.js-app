import { getServerSession } from "next-auth";
import {initMongoose} from "../../libs/mongoose";
import {authOptions} from "./auth/[...nextauth]";
import User from "../../models/User";

export default async function profile(req, res) {
    await initMongoose();
    const session = await getServerSession(req, res, authOptions);
    const {bio, name, username, cover} = req.body;
    await User.findByIdAndUpdate(session.user.id, {bio, name, username, ...(cover && { cover })});
    res.json('ok');
} 