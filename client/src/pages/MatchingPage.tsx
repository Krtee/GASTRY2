import { FC } from "react";
import Layout from "../components/layoutComponent/Layout";
import { Page, useNavigation } from "../utils/hooks/useNavigation";

interface MatchingPageProps {}

const MatchingPage: FC<MatchingPageProps> = ({}) => {
  const { currentLocation, onLocationChange } = useNavigation(Page.MATCHING);
  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
    ></Layout>
  );
};

export default MatchingPage;
