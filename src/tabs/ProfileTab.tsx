import React from "react";

const nickname = localStorage.getItem("nickname") || "태명이";
const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
  nickname
)}`;

const ProfileTab = () => {
  return (
    <div
      style={{
        width: 400,
        maxWidth: "100%",
        margin: "40px 0 0 0",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
