import { AxiosInstance } from "axios";

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
    .get("/notification/persistent/all", { params: { userId: userId } })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during user load!", exc));
};
