import InputComponent from "./InputComponent";

export default {
  title: "InputComponent",
};

export const Test = () => {
  return (
    <InputComponent
      value=""
      placeholder="Email"
      onChange={(value) => console.log(value)}
    />
  );
};
