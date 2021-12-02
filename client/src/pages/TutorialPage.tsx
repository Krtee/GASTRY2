import React, { FC } from "react";
import Layout from "../components/layoutComponent/Layout";

interface TutorialPageProps {}

export const TutorialPage: FC<TutorialPageProps> = ({}) => {
  return (
    <Layout>
      <button>to matching page</button>
    </Layout>
  );
};

export default TutorialPage;
