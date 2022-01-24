import Layout from "../components/LayoutComponent/Layout";
import List from "../components/List/List";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { userState } from "../utils/user/User.state";

const BuddiesPage: React.FC<{}> = () => {
  const { currentLocation, onLocationChange } = useNavigation();
  const history = useHistory();
  const { t } = useTranslation();
  const [user, setUser] = useRecoilState(userState);

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => {
            history.goBack();
          },
        },
        title: t("general.pages.profile.friends"),
      }}
    >
      <List
        onDeleteItem={() => {}}
        deleteBtnLabel="Unfollow"
        data={user?.buddies}
        column="firstName"
      />
    </Layout>
  );
};

export default BuddiesPage;
