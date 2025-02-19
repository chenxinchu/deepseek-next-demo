import { NextResponse } from "next/server";
import dayjs from "dayjs";
import OpenAI from "openai";
import { initHistoryChat, getHistoryChat, setHistoryChat } from "@/lib/redis";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.API_KEY,
  // timeout: 60 * 1000,
});

export async function POST(req) {
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }
  if (!openai.apiKey) {
    return NextResponse.json(
      {
        code: "500",
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
        servertime: dayjs().valueOf(),
        data: {},
      },
      { status: 500 }
    );
  }

  const body = await req?.json();
  const chat = body.chat || "";
  const space = body.space || "defaut";

  if (chat.trim().length === 0) {
    return NextResponse.json(
      {
        code: "400",
        message: "Please enter a valid chat",
        servertime: dayjs().valueOf(),
        data: {},
      },
      { status: 400 }
    );
  }

  try {
    // 取聊天历史数据
    var hisData = (await getHistoryChat(space)) || "[]";
    hisData = JSON.parse(hisData);
    // 把用户输入的聊天内容加入到历史数据中
    hisData.push({ role: "user", content: chat });

    // 调用 DeepSeek API 进行聊天
    const completion = await openai.chat.completions.create({
      messages: [...hisData],
      model: "deepseek-chat",
    });
    console.log("message:", completion.choices[0].message);
    const crrentChat = completion.choices[0].message || {};

    // 把机器人回复的聊天内容加入到历史数据中
    hisData.push(crrentChat);

    // 更新聊天历史数据
    await setHistoryChat(space, JSON.stringify(hisData));

    // 返回本次聊天的内容
    return NextResponse.json({
      code: "200",
      message: "success",
      servertime: dayjs().valueOf(),
      data: crrentChat.content || "",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        code: "500",
        message: "Error processing request",
        servertime: dayjs().valueOf(),
        data: {},
      },
      { status: 500 }
    );
  }
}
