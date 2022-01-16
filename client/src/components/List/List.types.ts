export interface ListProps {
  data: { _id: string; name?: string; email?: string }[];
  deleteBtnLabel: string;
  onDeleteItem: () => void;
  column: string; // property of object that is used to list data
}

export const dummyData = [
  {
    _id: "2",
    name: "Minh Vu Nguyen",
    email: "minh@email.com",
  },
  {
    _id: "3",
    name: "Domenico Ferrari",
    email: "domenico@email.com",
  },
  {
    _id: "4",
    name: "Nathalie Fischer",
    email: "nathalie@email.com",
  },
  {
    _id: "5",
    name: "Katharina Böhm",
    email: "katharina@email.com",
  },
  {
    _id: "6",
    name: "Bassam Mednini",
    email: "bassam@email.com",
  },
  {
    _id: "7",
    name: "Ines Novak",
    email: "ines@email.com",
  },
];
