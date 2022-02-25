import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import { NotificationCardComponent } from "../components/NotificationCardComponent/NotificationCardComponent";
import "../styles/NotificationPage.styles.scss";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { acceptMultiMatch } from "../utils/multimatch/MultiMatch.Utils";
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
import { loadSingleUser } from "../utils/user/User.util";

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const { t } = useTranslation();
  const navProps = useNavigation(Page.NOTIFICATION);
  const history = useHistory();
  const { axios } = useAxios();
  const [{ user }, setUser] = useRecoilState(userState);
  const [peristentNotifcationList, setPeristentNotifcationList] =
    useState<Notification[]>();

  useEffect(() => {
    if (!axios || !user || !user.id) return;
    loadAllNotifications(user!.id, axios)
      .then((notifications) => {
        setPeristentNotifcationList(notifications);
        setUser((prevState) => ({ ...prevState, loading: true }));

        return loadSingleUser(user.id!, axios);
      })
      .then((serverUser) => {
        setUser({ user: serverUser, loading: false });
      });

    return () => {
      persistentNotificationHaveBeenSeen(user!.id!, axios);
    };
  }, [axios]);

  const handleNotiClick = async (noti: Notification) => {
    switch (noti.notificationType) {
      case NotificationType.MULTI_MATCH:
        history.push(`/matching/result/${noti.matchId}`);
        break;
      case NotificationType.BUDDY_REQUEST:
        history.push("/buddies");
        break;
      case NotificationType.REQUEST_MULTI_MATCH:
        acceptMultiMatch(axios, user!, noti.matchId!).then((matchId) => {
          setUser({ user: { ...user!, activeMatch: matchId }, loading: false });
          history.push("/matching");
        });
    }
  };
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
            onClick={() => handleNotiClick(noti)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default NotificationPage;
