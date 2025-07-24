import React, { useState } from "react";
import "./App.css";
import HomeTab from "./tabs/HomeTab";
import DiaryTab from "./tabs/DiaryTab";
import CommunityTab from "./tabs/CommunityTab";
import ProfileTab from "./tabs/ProfileTab";

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

  return (
    <div className="app-root">
      <header className="App-header">
        <div
          className="logo-text point-gradient"
          style={{
            fontWeight: 700,
            fontSize: 24,
            marginLeft: 8,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          god난아기
        </div>
      </header>
      <div className="main-content">
        {selected === 0 && <HomeTab />}
        {selected === 1 && <DiaryTab />}
        {selected === 2 && <CommunityTab />}
        {selected === 3 && <ProfileTab />}
      </div>
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
