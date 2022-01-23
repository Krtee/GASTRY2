import { useHistory } from "react-router";

interface NotificationCardComponentProps {
  className: string;
  title: string;
  message: string;
  matchId?: string;
}

const NotificationCardComponent: React.FC<NotificationCardComponentProps> = ({
  className = "",
  title,
  message,
  matchId,
  children,
}) => {
  const history = useHistory();

  return (
    <div
      className={["notification-card--wrapper ", className].join("")}
      onClick={() =>
        matchId ? history.push(`/matching/result/${matchId}`) : () => {}
      }
    >
      <p className="notification-card--title"> {title}</p>
      <p className="notification-card--message"> {message}</p>
    </div>
  );
};

export default NotificationCardComponent;
