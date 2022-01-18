import ButtonComponent from "./ButtonComponent";

export default {
  title: "ButtonComponent",
};

export const Test = () => {
  return (
    <>
      <ButtonComponent value="Test Button" onClick={() => {}} />
      <ButtonComponent value="Test Button" onClick={() => {}} size="big" />
      <div style={{ backgroundColor: "black" }}>
        <ButtonComponent
          value="Test Button"
          onClick={() => {}}
          color="transparent"
        />
      </div>
    </>
  );
};
