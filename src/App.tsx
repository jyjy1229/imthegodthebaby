import React, { useState, useEffect } from "react";
import "./App.css";
import HomeTab from "./tabs/HomeTab";
import DiaryTab from "./tabs/DiaryTab";
import CommunityTab from "./tabs/CommunityTab";
import ProfileTab from "./tabs/ProfileTab";
import WritePostModal from "./modals/WritePostModal";

// 샘플 SVG 아이콘 컴포넌트 정의
const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12L12 4L21 12"
      stroke="#3CA55C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="6"
      y="12"
      width="12"
      height="8"
      rx="2"
      stroke="#3CA55C"
      strokeWidth="2"
    />
  </svg>
);
const DiaryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      stroke="#3CA55C"
      strokeWidth="2"
    />
    <line x1="8" y1="8" x2="16" y2="8" stroke="#3CA55C" strokeWidth="2" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#3CA55C" strokeWidth="2" />
    <line x1="8" y1="16" x2="12" y2="16" stroke="#3CA55C" strokeWidth="2" />
  </svg>
);
const CommunityIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7l-3 3z"
      stroke="#3CA55C"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" stroke="#3CA55C" strokeWidth="2" />
    <path
      d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
      stroke="#3CA55C"
      strokeWidth="2"
    />
  </svg>
);

const tabs = [
  { key: "홈", icon: <HomeIcon /> },
  { key: "일지", icon: <DiaryIcon /> },
  { key: "커뮤니티", icon: <CommunityIcon /> },
  { key: "프로필", icon: <ProfileIcon /> },
];

function App() {
  const [selected, setSelected] = useState(0);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [refreshCommunity, setRefreshCommunity] = useState(0);

  // 최초 1회 guest_id, nickname 저장
  useEffect(() => {
    if (!localStorage.getItem("guest_id")) {
      localStorage.setItem("guest_id", crypto.randomUUID());
    }
    if (!localStorage.getItem("nickname")) {
      const taemyeongList = [
        "콩콩이",
        "튼튼이",
        "깜찍이",
        "복덩이",
        "사랑이",
        "보물이",
        "쑥쑥이",
        "달콩이",
        "별이",
        "해님이",
        "다복이",
        "행운이",
        "기쁨이",
        "반짝이",
        "햇살이",
        "꽃님이",
        "하늘이",
        "미소",
        "초롱이",
        "맑음이",
      ];
      const idx = Math.floor(Math.random() * taemyeongList.length);
      localStorage.setItem("nickname", taemyeongList[idx]);
    }
  }, []);

  return (
    <div className="app-root">
      <header className="App-header">
        <img
          src={require("./assets/long_logo.png")}
          alt="logo"
          style={{ height: 32, marginLeft: 8, marginTop: 8, marginBottom: 8 }}
        />
      </header>
      <div className="main-content">
        {selected === 0 && <HomeTab />}
        {selected === 1 && <DiaryTab />}
        {selected === 2 && <CommunityTab refreshCommunity={refreshCommunity} />}
        {selected === 3 && <ProfileTab />}
      </div>
      {/* 커뮤니티 탭일 때만 하단 고정 플로팅 버튼 */}
      {selected === 2 && (
        <button
          style={{
            position: "fixed",
            left: "50%",
            bottom: 80, // tab bar 위에 띄우기 (tab bar 높이+여유)
            transform: "translateX(130px)",
            display: "flex",
            alignItems: "center",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: 999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            padding: "12px 24px 12px 16px",
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
            zIndex: 2000,
            gap: 10,
          }}
          onClick={() => setShowWriteModal(true)}
        >
          {/* 연필 SVG 아이콘 */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 8 }}
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
          글쓰기
        </button>
      )}
      {/* 글쓰기 모달 */}
      <WritePostModal
        open={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSubmit={() => {
          setShowWriteModal(false);
          setRefreshCommunity((v) => v + 1);
        }}
      />
      <nav className="tab-bar">
        {tabs.map((tab, idx) => (
          <button
            key={tab.key}
            className={`tab-btn${selected === idx ? " selected" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.key}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
