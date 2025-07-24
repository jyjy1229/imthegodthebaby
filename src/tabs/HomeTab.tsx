import { useState } from "react";
import WritePostModal from "../modals/WritePostModal";
import thumb13 from "../assets/thumbnail_13.png";
import fetal3dVideo from "../assets/fetal_3d_demo.mp4";
import UltrasoundResultModal from "../modals/UltrasoundResultModal";

const items = [
  {
    id: 1,
    thumb: require("../assets/thumbnail_3.png"),
    date: "2024년 6월 1일 촬영본",
  },
  {
    id: 2,
    thumb: require("../assets/thumbnail_7.png"),
    date: "2024년 6월 20일 촬영본",
  },
  {
    id: 3,
    thumb: require("../assets/thumbnail_9.png"),
    date: "2024년 7월 13일 촬영본",
  },
  {
    id: 4,
    thumb: require("../assets/thumbnail_10.png"),
    date: "2024년 7월 30일 촬영본",
  },
];

const HomeTab = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  // Fetal Vision/3D Fetal Vision demo 상태 (localStorage 연동 제거)
  const [fvState, setFvState] = useState<"idle" | "generating" | "done">(
    "idle"
  );
  const [fvTime, setFvTime] = useState(3);
  const [fv3dState, setFv3dState] = useState<"idle" | "generating" | "done">(
    "idle"
  );
  const [fv3dTime, setFv3dTime] = useState(3);
  const [showFetalModal, setShowFetalModal] = useState(false);
  const [showFetal3dModal, setShowFetal3dModal] = useState(false);

  // Fetal Vision 생성하기 클릭
  const handleFvGenerate = () => {
    setFvState("generating");
    setFvTime(3);
    let t = 3;
    const interval = setInterval(() => {
      t--;
      setFvTime(t);
      if (t === 0) {
        clearInterval(interval);
        setFvState("done");
      }
    }, 1000);
  };
  // 3D Fetal Vision 생성하기 클릭
  const handleFv3dGenerate = () => {
    setFv3dState("generating");
    setFv3dTime(3);
    let t = 3;
    const interval = setInterval(() => {
      t--;
      setFv3dTime(t);
      if (t === 0) {
        clearInterval(interval);
        setFv3dState("done");
      }
    }, 1000);
  };

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
          maxWidth: 600,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item.id)}
            style={{
              background: "#f6f8f6",
              borderRadius: 16,
              width: "100%",
              aspectRatio: "3 / 4",
              boxSizing: "border-box",
              boxShadow: "0 2px 8px rgba(60,165,92,0.08)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              fontSize: "clamp(13px, 3vw, 16px)",
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
                position: "relative",
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImage(item.thumb);
                  setShowWriteModal(true);
                }}
                style={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  background: "rgba(255,255,255,0.85)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="공유하기"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3CA55C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <line x1="12" y1="15" x2="12" y2="4" />
                  <polyline points="8 8 12 4 16 8" />
                </svg>
              </button>
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
              <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 15px)" }}>
                {item.date}
              </p>
            </div>
          </div>
        ))}
        {/* grid의 마지막 row에 2개 배너 */}
        <div
          style={{
            background: "#fff",
            border: "2px solid #a8e063",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(60,165,92,0.10)",
            padding: 16,
            minHeight: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(14px, 4vw, 20px)",
              marginBottom: 4,
            }}
          >
            god의 예측
          </div>
          <div
            style={{
              color: "#666",
              fontSize: "clamp(12px, 3vw, 15px)",
              marginBottom: 12,
            }}
          >
            AI로 내 아기의 모습을 예측해보세요!
          </div>
          {/* Fetal Vision 배너 버튼/상태 */}
          <button
            onClick={
              fvState === "idle"
                ? handleFvGenerate
                : fvState === "done"
                ? () => setShowFetalModal(true)
                : undefined
            }
            disabled={fvState === "generating"}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 24px",
              borderRadius: 12,
              border: "1.5px solid #a8e063",
              background: "#fff",
              color: "#056c22",
              fontWeight: 700,
              fontSize: "clamp(12px, 3.5vw, 15px)",
              boxShadow: "0 2px 8px rgba(90,90,214,0.06)",
              cursor: fvState === "generating" ? "default" : "pointer",
              opacity: fvState === "generating" ? 0.7 : 1,
              whiteSpace: "normal",
              wordBreak: "keep-all",
            }}
          >
            {fvState === "idle" && "지금 내 아이의 모습은?"}
            {fvState === "generating" && `AI 생성 중... (${fvTime}초 남음)`}
            {fvState === "done" && "확인하기"}
          </button>
        </div>
        <div
          style={{
            background:
              "linear-gradient(135deg, #f8ffe8 0%, #a8e063 50%, #056c22 100%)",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(60,165,92,0.10)",
            padding: 16,
            minHeight: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "clamp(14px, 4vw, 20px)",
              marginBottom: 4,
            }}
          >
            3D 영상 변환기
          </div>
          <div
            style={{
              color: "#666",
              fontSize: "clamp(12px, 3vw, 15px)",
              marginBottom: 12,
            }}
          >
            내 아기의 모습을 3D 영상으로 확인해보세요!
          </div>
          {/* 3D Fetal Vision 배너 버튼/상태 */}
          <button
            onClick={
              fv3dState === "idle"
                ? handleFv3dGenerate
                : fv3dState === "done"
                ? () => setShowFetal3dModal(true)
                : undefined
            }
            disabled={fv3dState === "generating"}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 24px",
              borderRadius: 12,
              border: "1.5px solid #a8e063",
              background: "#fff",
              color: "#056c22",
              fontWeight: 700,
              fontSize: "clamp(12px, 3.5vw, 15px)",
              boxShadow: "0 2px 8px rgba(90,90,214,0.06)",
              cursor: fv3dState === "generating" ? "default" : "pointer",
              opacity: fv3dState === "generating" ? 0.7 : 1,
              whiteSpace: "normal",
              wordBreak: "keep-all",
            }}
          >
            {fv3dState === "idle" && "요리보고 저리보고"}
            {fv3dState === "generating" && `AI 생성 중... (${fv3dTime}초 남음)`}
            {fv3dState === "done" && "확인하기"}
          </button>
        </div>
      </div>
      {/* 팝업(모달) */}
      <UltrasoundResultModal open={openId !== null} onClose={handleClose}>
        <img
          src={
            openId !== null
              ? items.find((i) => i.id === openId)?.thumb
              : undefined
          }
          alt="아기 썸네일"
          style={{
            width: 240,
            height: 240,
            objectFit: "cover",
            borderRadius: 16,
            display: "block",
            margin: "0 auto",
          }}
        />
      </UltrasoundResultModal>
      {/* 공유하기 글쓰기 모달 */}
      <WritePostModal
        open={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        defaultImages={modalImage ? [modalImage] : []}
      />
      {/* Fetal Vision 모달 */}
      <UltrasoundResultModal
        open={showFetalModal}
        onClose={() => setShowFetalModal(false)}
        width={400}
      >
        <img
          src={thumb13}
          alt="아기 썸네일"
          style={{
            width: 240,
            height: 240,
            objectFit: "cover",
            borderRadius: 16,
            display: "block",
            margin: "0 auto",
          }}
        />
      </UltrasoundResultModal>
      {/* 3D Fetal Vision 모달 */}
      <UltrasoundResultModal
        open={showFetal3dModal}
        onClose={() => setShowFetal3dModal(false)}
        width={400}
      >
        <video
          src={fetal3dVideo}
          controls
          style={{
            width: 320,
            borderRadius: 16,
            display: "block",
            margin: "0 auto",
          }}
        />
      </UltrasoundResultModal>
    </div>
  );
};

export default HomeTab;
