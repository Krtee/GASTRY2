import { useState } from "react";
import Searchbar from "../Searchbar/Searchbar";
import "./List.styles.scss";
import { ListProps } from "./List.types";

const List: React.FC<ListProps> = ({
  data,
  deleteBtnLabel,
  onDeleteItem,
  column,
}) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="list">
      <Searchbar value={searchValue} onChange={setSearchValue} placeholder="" />
      <div className="list-items-wrapper">
        {data
          ?.filter((result: any) =>
            result[column].toLowerCase().includes(searchValue)
          )
          .map((item: any) => (
            <div key={item._id} className="list-item">
              <p>{item[column]}</p>
              <button onClick={onDeleteItem}>{deleteBtnLabel}</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default List;
