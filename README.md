# deepseek 案例

## 启动项目

1. 安装依赖

```bash
npm install
```

2. 启动 redis

```bash
docker run -d --name redis -p 6379:6379 redis
# or
brew services start redis
```

3. 创建`.env`文件

```bash
API_KEY=XXXXX # 你的API_KEY
```

4. 启动项目

```bash
npm run dev
```

页面地址：`http://localhost:3000/`
接口地址：`http://localhost:3000/api/chat`

## 项目依赖

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ioredis](https://github.com/redis/ioredis)
- [Redis](https://redis.io/)
- [OpenAI](https://openai.com/)
- [DeepSeek](https://deepseek.com/)

## 核心功能实现

### 使用`Redis`存储聊天记录

- 使用`ioredis`连接`Redis`

目录：`/lib/redis.js`

实现：

```js
import Redis from "ioredis";
const redis = new Redis();

export const getHistoryChat = async (uuid) => {
  const data = await redis.hget("chat_history", uuid);
  return data;
};
```

## 使用`Next.js`的`Router Handlers`实现聊天接口功能

目录：`/app/api/chat/route.js`

实现：

```js
import { NextResponse } from "next/server";
export async function POST(req) {
  if (req.method === "OPTIONS") {
    return NextResponse.next();
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
  // do something ....

  try {
    // 返回本次聊天的内容
    return NextResponse.json({
      code: "200",
      message: "success",
      servertime: dayjs().valueOf(),
      data: "hello world",
    });
  } catch (err) {
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
```

## 使用`DeepSeek`的`deepseek-chat`接口实现聊天功能

目录：`/app/api/chat/route.js`

实现：

```js
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.API_KEY,
  // timeout: 60 * 1000,
});

// 调用 DeepSeek API 进行聊天
const completion = await openai.chat.completions.create({
  messages: [...hisData],
  model: "deepseek-chat",
});

```
