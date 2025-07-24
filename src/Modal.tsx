import React from "react";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
}

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  children,
  width = 400,
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
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 40,
          minWidth: 320,
          width: width,
          maxWidth: "90vw",
          boxShadow: "0 8px 32px rgba(60,165,92,0.18)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AppModal;
