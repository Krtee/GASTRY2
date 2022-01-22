import { AxiosInstance } from "axios";
import { NotificationType } from "./Notification.types";

/**
 * API method to load all notifications form user by their id
 *
 * @param userId The id of the user which notifications should be fetched
 * @param axios The axios instance
 * @returns Notifications
 * @author Domenico Ferrari
 */
export const loadAllNotifications = async (
  userId: string,
  axios: AxiosInstance
): Promise<Notification[]> => {
  return axios
    .get("/notification/persistent/all/", { params: { userId: userId } })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during noti fetch!", exc));
};
/**
 * API method to load all notifications form user by their id with given type
 *
 * @param userId The id of the user which notifications should be fetched
 * @param type type of noti to be fetched
 * @param axios The axios instance
 * @returns Notifications
 * @author Domenico Ferrari
 */
export const loadAllNotificationsViaType = async (
  type: NotificationType,
  userId: string,
  axios: AxiosInstance
): Promise<Notification[]> => {
  return axios
    .get("/notification/persistent/type/", {
      params: { type: type, userId: userId },
    })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during noti fetch!", exc));
};
/**
 * API method to load all notifications form user by their id with given seen flag
 *
 * @param userId The id of the user which notifications should be fetched
 * @param seen whether noti has been seen before or not
 * @param axios The axios instance
 * @returns Notifications
 * @author Domenico Ferrari
 */
export const loadAllNotificationsViaSeen = async (
  seen: boolean,
  userId: string,
  axios: AxiosInstance
): Promise<Notification[]> => {
  return axios
    .get("/notification/persistent/seen/", {
      params: { seen: seen, userId: userId },
    })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during noti fetch!", exc));
};
/**
 * PUT IT IN USEEFFECT CLEANUP
 * API method to update all notifications that have been seen now
 *
 * @param userId The id of the user which notifications have been seen now
 * @param axios The axios instance
 * @returns Notifications
 * @author Domenico Ferrari
 */
export const persistentNotificationHaveBeenSeen = async (
  userId: string,
  axios: AxiosInstance
): Promise<Notification[]> => {
  return axios
    .post("/notification/persistent/update/", userId)
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during noti fetch!", exc));
};
