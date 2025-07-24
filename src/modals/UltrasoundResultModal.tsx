// src/UltrasoundResultModal.tsx
import React, { ReactElement } from "react";

interface UltrasoundResultModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
}

const UltrasoundResultModal: React.FC<UltrasoundResultModalProps> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as ReactElement<any>, {
            style: {
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 24,
              display: "block",
              ...(((children as ReactElement<any>).props
                .style as React.CSSProperties) || {}),
            },
          })
        : children}
    </div>
  );
};

export default UltrasoundResultModal;
