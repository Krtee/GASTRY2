export interface ListProps {
  data: any[];
  deleteBtnLabel: string;
  onDeleteItem: () => void;
  column: string; // property of object that is used to list data
}
