import React from "react";

const nickname = localStorage.getItem("nickname") || "태명이";
const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
  nickname
)}`;

const ProfileTab = () => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: 24,
        position: "relative",
        width: "calc(100% - 48px)",
        maxWidth: 560,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(60,165,92,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <img
          src={avatarUrl}
          alt="프로필"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#eee",
          }}
        />
        <div style={{ fontSize: 22, fontWeight: 700 }}>{nickname}</div>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: 20,
          color: "#3CA55C",
          fontWeight: 600,
          marginTop: 24,
        }}
      >
        임신 24주차
      </div>
    </div>
  );
};

export default ProfileTab;
