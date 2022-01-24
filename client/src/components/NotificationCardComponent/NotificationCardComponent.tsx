import { ReactElement, useEffect } from "react";
import { ReactComponent as MatchIcon } from "../../assets/icons/Match.svg";
import { ReactComponent as FriendIcon } from "../../assets/icons/friend-plus.svg";
import { NotificationType } from "../../utils/notification/Notification.types";
import "./NotificationCardComponent.styles.scss";
import React from "react";
import ReactDOM from "react-dom";

export interface NotificationCardComponentProps {
  className?: string;
  title: string;
  message: string;
  onClick?(): void;
  seen?: boolean;
  notificationType: NotificationType;
  index?: number;
  disableAnimation?: boolean;
  duration?: number;
  onDestroy?(): void;
}

export const NotificationCardComponent: React.FC<NotificationCardComponentProps> =
  ({
    className = "",
    title,
    message,
    onClick,
    seen,
    notificationType,
    index = 0,
    disableAnimation,
    onDestroy,
    duration = 4000,
    children,
  }) => {
    /**
     * useEffect to destroying an notification after a given duration
     */
    useEffect(() => {
      if (onDestroy && duration) {
        const destroyTimer = setTimeout(() => onDestroy(), duration);
        return () => clearTimeout(destroyTimer);
      }
    }, []);

    /**
     * Helper method to get corresponding Notification icon
     * @returns appropriate Icon
     */
    const getNotificationIcon = (): ReactElement => {
      switch (notificationType) {
        case NotificationType.MULTI_MATCH:
          return <MatchIcon />;
        case NotificationType.BUDDY_REQUEST:
          return (
            <div className="friend">
              <FriendIcon />
            </div>
          );
        default:
          return <FriendIcon />;
      }
    };

    return (
      <div
        className={[
          "notification-card--wrapper ",
          className,
          disableAnimation ? " disable" : "",
        ].join("")}
        onClick={onClick}
        style={{
          animationDelay: `${0.05 * index}s`,
        }}
      >
        <div className="notification-card--icon-container">
          {getNotificationIcon()}
        </div>
        <div
          className={[
            "notification-card--text ",
            disableAnimation ? " disable" : "",
          ].join("")}
          style={{
            animation: disableAnimation ? "none" : "",
          }}
        >
          <p className="notification-card--title"> {title}</p>
          <p className="notification-card--message"> {message}</p>
        </div>

        <div
          className={["notification-card--dot ", seen ? "" : "new"].join("")}
        />
      </div>
    );
  };

/**
 * Method to generate a notification and append it to the body
 *
 * @param content the text which is displayed in the bottom
 * @param type type of the notification default is ("info")
 * @param title the title which is on top a default value is set by the component
 * @param duration duration of showing the notification in ms
 */
export const generateNotification = (
  title: string,
  message: string,
  notificationType: NotificationType,
  duration?: number,
  onClick?: () => void
): void => {
  let divWrapper: HTMLDivElement = document.createElement("div");
  let className: string = "in-app-notification";
  let idName: string =
    "notification-" +
    (Math.random() * Number(Date.now().toFixed(0))).toFixed(0);
  divWrapper.id = idName;
  divWrapper.className = className;
  const createdNotification = React.createElement(
    NotificationCardComponent,
    {
      message: message,
      title: title,
      notificationType: notificationType,
      duration: duration,
      onDestroy: () => document.getElementById(idName)?.remove(),
      onClick: onClick,
    },
    null
  );
  ReactDOM.render(createdNotification, document.body.appendChild(divWrapper));
};
