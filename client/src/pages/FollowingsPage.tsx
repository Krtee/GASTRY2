import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import Layout from "../components/LayoutComponent/Layout";
import List from "../components/List/List";
import { Page, useNavigation } from "../utils/hooks/useNavigation";

const FollowingsPage: React.FC<{}> = () => {
  const navProps = useNavigation(Page.FOLLOWINGS);
  const history = useHistory();
  const { t } = useTranslation();

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
        title: t("general.pages.profile.subscribedRestaurants"),
      }}
    >
      <List
        onDeleteItem={() => {}}
        deleteBtnLabel="Unfollow"
        data={[]}
        column="name"
      />
    </Layout>
  );
};

export default FollowingsPage;
