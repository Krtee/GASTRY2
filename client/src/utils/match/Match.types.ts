import { Meal } from "../meal/Meal.types";

export interface Match {
  id?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  matchedMeals: Meal[];
  unMatchedMeals: Meal[];
  matchedRestaurants: MatchRestaurantWrapper[];
}

export interface MatchRestaurantWrapper {
  restaurantId: string;
  index: number;
}
