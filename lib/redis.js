import Redis from "ioredis";

const redis = new Redis();

export const initHistoryChat = async () => {
  const initData = {
    chat1: '[{"role":"user","content":"hello"}]',
  };
  await redis.hset("chat_history", initData);
  return "init";
};

export const getHistoryChat = async (uuid) => {
  const data = await redis.hget("chat_history", uuid);
  return data;
};

export const setHistoryChat = async (uuid, data) => {
  await redis.hset("chat_history", [uuid], data);
  return uuid;
};

export const deleteNote = async (uuid) => {
  await redis.hdel("chat_history", uuid);
  return uuid;
};

export default redis;
