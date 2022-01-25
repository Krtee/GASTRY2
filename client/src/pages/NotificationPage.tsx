import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import { NotificationCardComponent } from "../components/NotificationCardComponent/NotificationCardComponent";
import "../styles/NotificationPage.styles.scss";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import {
  Notification,
  NotificationPageProps,
  NotificationType,
} from "../utils/notification/Notification.types";
import {
  loadAllNotifications,
  persistentNotificationHaveBeenSeen,
} from "../utils/notification/Notification.util";
import { userState } from "../utils/user/User.state";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const navProps = useNavigation(Page.NOTIFICATION);
  const history = useHistory();
  const { axios } = useAxios();
  const user = useRecoilValue(userState);

  const [peristentNotifcationList, setPeristentNotifcationList] =
    useState<Notification[]>();

  useEffect(() => {
    if (!axios || !user || !user.id) return;
    loadAllNotifications(user!.id, axios).then((notifications) => {
      setPeristentNotifcationList(notifications);
    });

    return () => {
      persistentNotificationHaveBeenSeen(user!.id, axios);
    };
  }, [axios, user]);
  return (
    <Layout
      {...navProps}
      header={{
        leftIconButton: {
          value: <ArrowLeftIcon />,
          onClick: () => history.goBack(),
        },
        title: t("general.navigation.NOTIFICATION"),
      }}
    >
      <div className="notification-page--wrapper">
        {peristentNotifcationList?.map((noti, index) => (
          <NotificationCardComponent
            {...noti}
            index={index}
            key={index}
            onClick={
              noti.notificationType === NotificationType.MULTI_MATCH
                ? () => history.push(`/matching/result/${noti.matchId}`)
                : noti.notificationType === NotificationType.BUDDY_REQUEST
                ? () => alert("IMPLEMET ROUTING TO FRIENDS PAGE")
                : () => alert("NO DEFAULT IMPLEMENT")
            }
          />
        ))}
      </div>
    </Layout>
  );
};

export default NotificationPage;
