import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import List from "../components/List/List";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { userState } from "../utils/user/User.state";

const BuddiesPage: React.FC<{}> = () => {
  const navProps = useNavigation(Page.BUDDIES);
  const history = useHistory();
  const { t } = useTranslation();
  const user = useRecoilValue(userState);

  return (
    <Layout
      {...navProps}
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
      {user && (
        <List
          onDeleteItem={() => {}}
          deleteBtnLabel="Unfollow"
          data={user.buddies}
          column="firstName"
        />
      )}
    </Layout>
  );
};

export default BuddiesPage;
