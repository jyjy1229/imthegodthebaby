import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const biometryData = [
  {
    week: 13,
    CRL: 42,
    CRL_min: 37,
    CRL_max: 47,
    BPD: 27,
    BPD_min: 25,
    BPD_max: 31,
    HC: 122,
    HC_min: 116,
    HC_max: 129,
    AC: 98,
    AC_min: 90,
    AC_max: 110,
    FL: 19,
    FL_min: 16,
    FL_max: 22,
  },
  {
    week: 16,
    CRL: 59,
    CRL_min: 53,
    CRL_max: 67,
    BPD: 50,
    BPD_min: 46,
    BPD_max: 54,
    HC: 170,
    HC_min: 162,
    HC_max: 182,
    AC: 160,
    AC_min: 148,
    AC_max: 172,
    FL: 33,
    FL_min: 29,
    FL_max: 36,
  },
  {
    week: 19,
    CRL: 87,
    CRL_min: 80,
    CRL_max: 97,
    BPD: 64,
    BPD_min: 60,
    BPD_max: 69,
    HC: 215,
    HC_min: 205,
    HC_max: 225,
    AC: 194,
    AC_min: 182,
    AC_max: 208,
    FL: 46,
    FL_min: 42,
    FL_max: 50,
  },
  {
    week: 22,
    CRL: 101,
    CRL_min: 92,
    CRL_max: 112,
    BPD: 70,
    BPD_min: 66,
    BPD_max: 75,
    HC: 238,
    HC_min: 225,
    HC_max: 252,
    AC: 225,
    AC_min: 210,
    AC_max: 240,
    FL: 54,
    FL_min: 49,
    FL_max: 59,
  },
];

const volumeData = [
  { week: 13, volume: 75, volume_min: 55, volume_max: 95 },
  { week: 16, volume: 210, volume_min: 160, volume_max: 260 },
  { week: 19, volume: 410, volume_min: 330, volume_max: 500 },
  { week: 22, volume: 630, volume_min: 520, volume_max: 750 },
];

const BIOMETRY_TABS = [
  {
    key: "CRL",
    label: "CRL",
    color: "#ffb300",
    maxAreaColor: "#ffe082",
    minAreaColor: "#fff",
    min: "CRL_min",
    max: "CRL_max",
    unit: "mm",
    description: "머리-엉덩이 길이",
  },
  {
    key: "BPD",
    label: "BPD",
    color: "#ff7043",
    maxAreaColor: "#ffe0b2",
    minAreaColor: "#fff",
    min: "BPD_min",
    max: "BPD_max",
    unit: "mm",
    description: "머리 가로길이",
  },
  {
    key: "HC",
    label: "HC",
    color: "#e53935",
    maxAreaColor: "#ffcdd2",
    minAreaColor: "#fff",
    min: "HC_min",
    max: "HC_max",
    unit: "mm",
    description: "머리 둘레",
  },
  {
    key: "AC",
    label: "AC",
    color: "#f06292",
    maxAreaColor: "#f8bbd0",
    minAreaColor: "#fff",
    min: "AC_min",
    max: "AC_max",
    unit: "mm",
    description: "복부 둘레",
  },
  {
    key: "FL",
    label: "FL",
    color: "#29b6f6",
    maxAreaColor: "#b3e5fc",
    minAreaColor: "#fff",
    min: "FL_min",
    max: "FL_max",
    unit: "mm",
    description: "대퇴골 길이",
  },
];

const DiaryTab = () => {
  const [selectedTab, setSelectedTab] = useState("CRL");
  const tabInfo = BIOMETRY_TABS.find((t) => t.key === selectedTab);

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: 24,
        position: "relative",
        minHeight: "80vh",
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <div
          className="chip-scroll"
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {BIOMETRY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border:
                  tab.key === selectedTab
                    ? "2px solid #3CA55C"
                    : "1px solid #ccc",
                background: "#fff",
                color: tab.key === selectedTab ? "#222" : "#333",
                fontWeight: tab.key === selectedTab ? "bold" : "normal",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s",
              }}
            >
              {tab.description}
            </button>
          ))}
        </div>
        {tabInfo && (
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 4px 24px rgba(60,165,92,0.10)",
              padding: 16,
              minHeight: 140,
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 12,
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#fff",
                background: "#3CA55C",
                borderRadius: 16,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 15,
                position: "absolute",
                right: 24,
                top: 24,
                zIndex: 2,
              }}
            >
              아이의 {tabInfo.key} 계측값이 정상입니다
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={biometryData}>
                <XAxis
                  dataKey="week"
                  label={{
                    value: "임신 주차(주)",
                    position: "insideBottomRight",
                    offset: -4,
                  }}
                />
                <YAxis
                  label={{
                    value: tabInfo.unit,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={tabInfo.max}
                  fill={tabInfo.maxAreaColor}
                  fillOpacity={0.5}
                  name="최대 정상치"
                />
                <Area
                  type="monotone"
                  dataKey={tabInfo.min}
                  fill={tabInfo.minAreaColor}
                  fillOpacity={1}
                  name="최소 정상치"
                />
                <Line
                  type="monotone"
                  dataKey={tabInfo.key}
                  stroke={tabInfo.color}
                  dot={{ r: 4 }}
                  name={tabInfo.label}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div>
        <h3>태아 크기</h3>
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(60,165,92,0.10)",
            padding: 16,
            minHeight: 140,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 12,
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#fff",
              background: "#3CA55C",
              borderRadius: 16,
              padding: "6px 16px",
              fontWeight: 600,
              fontSize: 15,
              position: "absolute",
              right: 24,
              top: 24,
              zIndex: 2,
            }}
          >
            아이의 크기는 상위 43%입니다.
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <XAxis
                dataKey="week"
                label={{
                  value: "임신 주차(주)",
                  position: "insideBottomRight",
                  offset: -4,
                }}
              />
              <YAxis
                label={{ value: "cm³", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volume_max"
                fill="#ffe082"
                fillOpacity={0.5}
                name="최대 정상치"
              />
              <Area
                type="monotone"
                dataKey="volume_min"
                fill="#fff"
                fillOpacity={1}
                name="최소 정상치"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#ffb300"
                dot={{ r: 4 }}
                name="내 아이"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DiaryTab;
