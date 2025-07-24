import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";

const tabs = [
  { key: "home", icon: "🏠" },
  { key: "search", icon: "🔍" },
  { key: "add", icon: "➕" },
  { key: "notifications", icon: "🔔" },
  { key: "profile", icon: "👤" },
];

function App() {
  const [selected, setSelected] = useState(0);
  const { t, i18n } = useTranslation();

  const handleLang = () => {
    i18n.changeLanguage(i18n.language === "ko" ? "en" : "ko");
  };

  return (
    <div className="app-root">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0 0 0",
        }}
      >
        <div
          className="logo-text point-text"
          style={{ fontWeight: 700, fontSize: 20, marginLeft: 16 }}
        >
          {t("logo")}
        </div>
        <button
          onClick={handleLang}
          style={{
            background: "none",
            border: "none",
            color: "#1e90ff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 22,
            lineHeight: 1,
            padding: 0,
            transition: "color 0.2s",
            marginRight: 16,
          }}
          className="lang-btn"
          aria-label={
            i18n.language === "ko" ? "Switch to English" : "한국어로 변경"
          }
        >
          <span role="img" aria-label="language">
            🌐
          </span>
        </button>
      </div>
      <div className="main-content">
        <h1>
          {t(`tabs.${tabs[selected].key}`)} {t("page")}
        </h1>
        <p>{t("here_is", { tab: t(`tabs.${tabs[selected].key}`) })}</p>
      </div>
      <nav className="tab-bar">
        {tabs.map((tab, idx) => (
          <button
            key={tab.key}
            className={`tab-btn${selected === idx ? " selected" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{t(`tabs.${tab.key}`)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
