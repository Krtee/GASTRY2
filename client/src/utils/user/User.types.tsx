export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum TYPES {
  CAFE = "CAFE",
  COLD = "COLD",
  WARM = "WARM",
  DESSERT = "DESSERT",
}

export enum DIETS {
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  GLUTENFREE = "GLUTEN_FREE",
  NOPORK = "NO_PORK",
}

export enum INTOLERANCES {
  PEANUT = "PEANUT",
  FISH = "FISH",
  ONION = "ONION",
  GARLIC = "GARLIC",
  TOMATOE = "TOMATOE",
}

export enum CUISINES {
  ITALIAN = "ITALIAN",
  ASIAN = "ASIAN",
  GREEK = "GREEK",
  SOUTHAMERICAN = "SOUTH_AMERICAN",
  AFRICAN = "AFRICAN",
  SPANISH = "SPANISH",
  FRENCH = "FRENCH",
}

export interface Buddy {
  createDate: Date;
  lastUpdated: Date;
  notificationEnabled: boolean;
  buddyId: string;
  buddyType: BuddyType;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface User {
  id: string;
  photo?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email?: string;
  role: UserRole;
  city?: string;
  lat?: string;
  long?: string;
  bio?: string;
  password?: string;
  token?: string;
  posts?: [];
  diets?: string[];
  intolerances?: string[];
  cuisines?: string[];
  types?: string[];
  favoriteRestaurants?: [];
  visitedRestaurants?: [];
  subscribedRestaurants?: [];
  buddies: Buddy[];
  activeMatch?: string;
}

export enum BuddyType {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  INCOMING = "INCOMING",
}
