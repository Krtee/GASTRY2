import { ReactElement } from "react";
import { ReactComponent as MatchIcon } from "../../assets/icons/Match.svg";
import { ReactComponent as FriendIcon } from "../../assets/icons/friend-plus.svg";
import { NotificationType } from "../../utils/notification/Notification.types";
import "./NotificationCardComponent.styles.scss";

export interface NotificationCardComponentProps {
  className?: string;
  title: string;
  message: string;
  onClick?(): void;
  icon?: ReactElement;
  seen?: boolean;
  notificationType: NotificationType;
  index?: number;
}

const NotificationCardComponent: React.FC<NotificationCardComponentProps> = ({
  className = "",
  title,
  message,
  onClick,
  seen,
  notificationType,
  index = 0,
  children,
}) => {
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
      className={["notification-card--wrapper ", className].join("")}
      onClick={onClick}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="notification-card--icon-container">
        {getNotificationIcon()}
      </div>
      <div className="notification-card--text">
        <p className="notification-card--title"> {title}</p>
        <p className="notification-card--message"> {message}</p>
      </div>

      <div
        className={["notification-card--dot ", seen ? "" : "new"].join("")}
      />
    </div>
  );
};

export default NotificationCardComponent;
