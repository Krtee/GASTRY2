import SearchComponent from "./SearchComponent";

export default {
  title: "SearchInputComponent",
};

export const Test = () => {
  return <SearchComponent value="" onChange={(value) => console.log(value)} />;
};
