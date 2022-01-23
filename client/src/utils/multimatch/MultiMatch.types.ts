import { MatchRestaurantWrapper } from "../match/Match.types";

export interface MultiUserMatch {
  id?: string;
  userList: MultiMatchUserWrapper[];
  createdAt: Date;
  updatedAt: Date;
  matches: string[];
  creatorId: string;
  matchedRestaurants: MatchRestaurantWrapper[];
  active?: boolean;
}

export interface MultiMatchUserWrapper {
  userId: string;
  status: MultiMatchRequestStatus;
}

export enum MultiMatchRequestStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}
