import { AxiosInstance } from "axios";
import { ResponseTypes } from "../AxiosUtil";
import { User, UserRole } from "./User.types";

/**
 * Helper function to create an empty user for modification
 * @returns an instance of user {@link User}
 * @author Domenico Ferrari
 */
export const createEmptyUser = (): User => {
  return {
    id: "",
    photo: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    role: UserRole.USER,
    posts: [],
    preferences: [],
    favoriteRestaurants: [],
    followers: [],
    followings: [],
  };
};

/**
 * API method to create a new user {@link User}
 * @param axios
 * @returns boolean for either successful creation or failed one
 * @author Domenico Ferrari
 */
export const createNewUser = async (
  axios: AxiosInstance,
  newUser: User
): Promise<ResponseTypes> => {
  return axios
    .post("/user/", newUser)
    .then((response) => response.data)
    .catch(() => {
      console.error("Error while creating a new user!");
    });
};

/**
 * API method to load an {@link User} by its id
 *
 * @param userId The id of the {@link User} to fetch
 * @param axios The axios instance
 * @returns Either the loaded user or undefined in case of an error
 * * @author Fadel Kaadan
 */
export const loadSingleUser = async (
  userId: string,
  axios: AxiosInstance
): Promise<User> => {
  return axios
    .get("/user/id/", { params: { userId: userId } })
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during user load!", exc));
};

/**
 * API method to update an {@link User} by its id
 *
 * @param userId The id of the {@link User} to fetch
 * @param axios The axios instance
 * @param data The updated user info
 * @returns Either the loaded user or undefined in case of an error
 */
export const updateUserInfo = async (
  axios: AxiosInstance,
  data: any
): Promise<User> => {
  return axios
    .post("/user/update/", data)
    .then((resp) => resp.data)
    .catch((exc) => console.error("Error during user load!", exc));
};
