import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_ESPOCRM_URL,
  withCredentials: true,
});

// 1) عدد الإشعارات غير المقروءة
export async function getUnreadCount() {
  const res = await api.get("/api/v1/Notification/action/notReadCount");
  return res.data;
}

// 2) قائمة الإشعارات
export async function getNotifications() {
  const params = {
    maxSize: 5,
    offset: 0,
    orderBy: "number",
    order: "desc",
    "whereGroup[0][type]": "in",
    "whereGroup[0][attribute]": "type",
    "whereGroup[0][value][]": "Message",
  };

  const res = await api.get("/api/v1/Notification", { params });
  return res.data;
}

// 3) تعليم الكل مقروء
export async function markAllAsRead() {
  const res = await api.post("/api/v1/Notification/action/markAllRead");
  return res.data;
}
