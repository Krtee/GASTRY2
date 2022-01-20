import { ReactComponent as ShareIcon } from "./../../assets/icons/share.svg";
import IconButtonComponent from "./IconButtonComponent";
export default {
  title: "IconButtonComponent",
};

export const Test = () => {
  return (
    <>
      <IconButtonComponent value={<ShareIcon />} onClick={() => {}} />
      <IconButtonComponent
        value={<ShareIcon />}
        onClick={() => {}}
        size="small"
      />
      <div style={{ backgroundColor: "black" }}>
        <IconButtonComponent
          value={<ShareIcon />}
          onClick={() => {}}
          color="transparent"
        />
      </div>
    </>
  );
};
