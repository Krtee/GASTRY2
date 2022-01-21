export interface NotificationPageProps {}



export enum NotificationType {
  MULTI_MATCH = "MULTI_MATCH",
  REQUEST_MULTI_MATCH = "REQUEST_MULTI_M",
  USER = "USER",
  TOPIC = "TOPIC",
  BUDDY_REQUEST = "BUDDY_REQUEST",
}

export interface Notification {
  seen: boolean;
  title: string;
  message: string;
  notificationType: NotificationType;
  topic?: string;
}
