import React from "react";
import CardComponent from "../CardComponent/CardComponent";
import { ReactComponent as SearchIcon } from "./../../assets/icons/search.svg";
import "./SearchComponentStyles.scss";
interface SearchComponentProps {
  value: string;
  onChange(value: string): void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChange,
}) => {
  return (
    <CardComponent className="search-component">
      <SearchIcon />
      <input
        value={value}
        onChange={(evt) => {
          evt.preventDefault();
          onChange(evt.target.value);
        }}
      />
    </CardComponent>
  );
};

export default SearchComponent;
