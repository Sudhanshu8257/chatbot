import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import User from "../models/User.js";
import { GEMINI_MODEL } from "../utils/constants.js";
const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);
export async function getChat(req, res, next) {
    // For text-only input, use the gemini-pro model
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).json({ message: "Try logging in again" });
        const chats = user?.chats?.map(({ role, parts }) => ({ role, parts }));
        const last20Messages = chats.slice(-20);
        chats.push({ parts: message, role: "user" });
        user.chats.push({ parts: message, role: "user" });
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const chat = model.startChat({
            history: last20Messages,
        });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const history = await chat.getHistory();
        const text = response.text();
        console.log(response);
        const geminiResponse = { role: "model", parts: text };
        chats.push(geminiResponse);
        user.chats.push(geminiResponse);
        await user.save();
        return res.status(200).json({ chats: user.chats, history });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error", cause: error.message });
    }
}
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controller.js.map