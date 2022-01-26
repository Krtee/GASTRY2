import "./List.styles.scss";
import { ListProps } from "./List.types";

const List: React.FC<ListProps> = ({
  data,
  deleteBtnLabel,
  onDeleteItem,
  column,
  filterString,
}) => {
  return (
    <div className="list">
      {data?.length > 0 && (
        <div className="list-items-wrapper">
          {data
            ?.filter(
              (result: any) =>
                !filterString ||
                result[column]?.toLowerCase().includes(filterString)
            )
            .map((item: any) => (
              <div key={item._id} className="list-item">
                <p>{item[column]}</p>
                <button onClick={onDeleteItem}>{deleteBtnLabel}</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default List;
