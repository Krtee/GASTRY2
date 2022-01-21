import React, { FC } from "react";
import { createPortal } from "react-dom";
import "./ModalComponentStyles.scss";

export interface ModalComponentProps {
  className?: string;
}

const ModalComponent: FC<ModalComponentProps> = ({ className, children }) => {
  return createPortal(
    <div className="modal__root">
      <div className={"modal__content " + className}>{children}</div>
    </div>,
    document.getElementById("root")!
  );
};

export default ModalComponent;
