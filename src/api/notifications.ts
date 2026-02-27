import axiosClient from "./axiosClient";

export async function getUnreadCount() {
  const res = await axiosClient.get("/api/v1/Notification/action/notReadCount");
  return res.data;
}

export async function getNotifications() {
  const params = {
    maxSize: 5,
    offset: 0,
    orderBy: "number",
    order: "desc",
    "whereGroup[0][type]": "in",
    "whereGroup[0][attribute]": "type",
    "whereGroup[0][value][0]": "Message",
  };
  const res = await axiosClient.get("/api/v1/Notification", { params });
  return res.data;
}

export async function markAllAsRead() {
  const res = await axiosClient.post("/api/v1/Notification/action/markAllRead");
  return res.data;
}