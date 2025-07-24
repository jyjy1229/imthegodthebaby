import React, { useState } from "react";

const items = [
  {
    id: 1,
    thumb: require("../assets/thumbnail_3.png"),
    date: "2024년06월01일 촬영본",
  },
  {
    id: 2,
    thumb: require("../assets/thumbnail_7.png"),
    date: "2024년06월02일 촬영본",
  },
  {
    id: 3,
    thumb: require("../assets/thumbnail_9.png"),
    date: "2024년06월03일 촬영본",
  },
  {
    id: 4,
    thumb: require("../assets/thumbnail_10.png"),
    date: "2024년06월04일 촬영본",
  },
  {
    id: 5,
    thumb: require("../assets/thumbnail_13.png"),
    date: "2024년06월05일 촬영본",
  },
];

const HomeTab = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleOpen = (id: number) => setOpenId(id);
  const handleClose = () => setOpenId(null);

  return (
    <div
      style={{
        padding: "24px 0 0 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
          alignItems: "start",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item.id)}
            style={{
              background: "#f6f8f6",
              borderRadius: 16,
              height: 350,
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 2px 8px rgba(60,165,92,0.08)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 500,
              transition: "box-shadow 0.2s",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                background: "#e0e0e0",
                margin: 0,
                padding: 0,
              }}
            >
              <img
                src={item.thumb}
                alt="썸네일"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "8px 16px",
                textAlign: "left",
              }}
            >
              <p style={{ margin: 0 }}>{item.date}</p>
            </div>
          </div>
        ))}
      </div>
      {/* 팝업(모달) */}
      {openId !== null && (
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
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              minWidth: 260,
              boxShadow: "0 4px 24px rgba(60,165,92,0.15)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#3CA55C",
              }}
              aria-label="닫기"
            >
              ×
            </button>
            <h3 style={{ marginBottom: 12 }}>썸네일</h3>
            <img
              src={items.find((i) => i.id === openId)?.thumb}
              alt="썸네일"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
            <p style={{ marginTop: 16 }}>
              {items.find((i) => i.id === openId)?.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
