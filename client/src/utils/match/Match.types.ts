import { Meal } from "../meal/Meal.types";

export interface Match {
  id?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  matchedMeals: Meal[];
  unmatchedMeals: Meal[];
  matchedRestaurants: MatchRestaurantWrapper[];
  partOfGroup?: boolean;
}

export interface MatchRestaurantWrapper {
  restaurant: GoogleMapsResponseRestaurant;
  index: number;
  [key: string]: any;
}
export interface GoogleMapsAddressComponents {
  long_name?: string;
  short_name?: string;
  types?: string[];
  [key: string]: string | string[] | undefined;
}

export interface GoogleMapsOpeningHours {
  open_now?: boolean;
  weekday_text?: string[] | null;
  periods?: GoogleMapsOpeningHours[];
  [key: string]: any;
}

export interface GoogleMapsOpeningHoursPeriods {
  open?: GoogleMapsOpeningHoursPeriods;
  close?: GoogleMapsOpeningHoursPeriods;
  [key: string]: GoogleMapsOpeningHoursPeriods | undefined;
}

export interface GoogleMapsPhotos {
  height?: number;
  width?: number;
  photo_reference?: string;
  [key: string]: number | string | undefined;
}

export interface GoogleMapsPlaceOpeningHoursPeriodDetail {
  day?: number;
  time?: number;
  [key: string]: number | undefined;
}

export interface GoogleMapsResponseRestaurant {
  place_id?: string;
  business_status?: BusinessStatus;
  name?: string;
  opening_hours?: GoogleMapsOpeningHours;
  photos?: GoogleMapsPhotos[];
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  website?: string;
  reviews?: GoogleMapsReview[];
  url?: string;
  address_components?: GoogleMapsAddressComponents[];
  formatted_address?: string;
  geometry?: GoogleMapsGeometryWrapper;
  international_phone_number?: string;
  formatted_phone_number?: string;
  [key: string]: any;
}

export interface GoogleMapsResponseWrapper {
  results?: GoogleMapsResponseRestaurant[];
  status?: string;
  next_page_token?: string;
  html_attributions?: any[];
  [key: string]: any;
}

export interface GoogleMapsReview {
  author_name?: string;
  rating?: string;
  relative_time_description?: string;
  time?: number;
  profile_photo_url?: string;
  text?: string;
  [key: string]: string | number | undefined;
}

export enum BusinessStatus {
  OPERATIONAL = "OPERATIONAL",
  CLOSED_TEMPORARILY = "CLOSED_TEMPORARILY",
  CLOSED_PERMANENTLY = "CLOSED_PERMANENTLY",
}

export interface GoogleMapsGeometryWrapper {
  location?: GooogleMapsGeolocation;
}

export interface GooogleMapsGeolocation {
  lat?: string;
  lng?: string;
}
