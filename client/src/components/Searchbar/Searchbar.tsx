import "./Searchbar.styles.scss";
import { SearchbarProps } from "./Searchbar.types";
import search from "../../assets/icons/search.svg";
import { ChangeEvent } from "react";

const Searchbar = ({ value, placeholder, onChange }: SearchbarProps) => {
  return (
    <div className="searchbar">
      <img src={search} alt="search-icon" className="searchbar-icon" />
      <input
        className="searchbar-input"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
};

export default Searchbar;
