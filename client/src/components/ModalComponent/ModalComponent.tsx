import React, { FC } from "react";
import { createPortal } from "react-dom";
import "./ModalComponentStyles.scss";

interface ModalComponentProps {}

const ModalComponent: FC<ModalComponentProps> = ({ children }) => {
  return createPortal(
    <div className="modal__root">
      <div className="modal__content">{children}</div>
    </div>,
    document.getElementById("root")!
  );
};

export default ModalComponent;
