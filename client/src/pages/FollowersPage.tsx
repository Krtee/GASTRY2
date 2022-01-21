import Layout from "../components/LayoutComponent/Layout";
import List from "../components/List/List";
import { dummyData } from "../components/List/List.types";
import { Page, useNavigation } from "../utils/hooks/useNavigation";

const FollowersPage: React.FC<{}> = () => {
  const { currentLocation, onLocationChange } = useNavigation();

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
    >
      <List
        onDeleteItem={() => {}}
        deleteBtnLabel="Unfollow"
        data={dummyData}
        column="name"
      />
    </Layout>
  );
};

export default FollowersPage;
