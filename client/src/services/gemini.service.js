import api from "../api/api";

export const summarize = async (text) => {
  const res = await api.post("/ai/summarize", { text });
  return res.data.data.result;
};

export const improve = async (text) => {
  const res = await api.post("/ai/improve", { text });
  return res.data.data.result;
};

export const changeTone = async (text, tone) => {
  const res = await api.post("/ai/tone", { text, tone });
  return res.data.data.result;
};
