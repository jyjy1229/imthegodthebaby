import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface WritePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  defaultImages?: string[];
}

const WritePostModal: React.FC<WritePostModalProps> = ({
  open,
  onClose,
  onSubmit,
  defaultImages,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // defaultImages가 있을 때 미리보기/첨부 목록에 추가
  useEffect(() => {
    if (open && defaultImages && defaultImages.length > 0) {
      setPreviews(defaultImages);
      // assets 이미지를 File로 변환해서 images에도 추가
      Promise.all(
        defaultImages.map(async (url, idx) => {
          const res = await fetch(url);
          const blob = await res.blob();
          return new File([blob], `default_${idx}.png`, { type: blob.type });
        })
      ).then((files) => setImages(files));
    } else if (open) {
      setPreviews([]);
      setImages([]);
    }
  }, [open, defaultImages]);

  if (!open) return null;

  // 이미지 미리보기 생성
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 3 - images.length);
    setImages((prev) => [...prev, ...files].slice(0, 3));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === "string") {
          setPreviews((prev) =>
            [...prev, ev.target!.result as string].slice(0, 3)
          );
        }
      };
      reader.readAsDataURL(file);
    });
    // input value 초기화 (같은 파일 다시 첨부 가능)
    e.target.value = "";
  };

  // 이미지 삭제
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // 이미지 Supabase Storage 업로드
  const uploadImages = async () => {
    if (images.length === 0) return [];
    const urls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `posts/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}_${safeFileName}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(filePath, file);
      if (error) {
        alert("이미지 업로드 실패: " + error.message);
        console.error("이미지 업로드 실패:", error);
        continue;
      }
      const { data } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);
      console.log("업로드된 이미지 publicUrl:", data.publicUrl);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const nickname = localStorage.getItem("nickname") || "익명";
    const guest_id = localStorage.getItem("guest_id") || "";
    let image_urls: string[] = [];
    if (images.length > 0) {
      image_urls = await uploadImages();
    }
    await supabase
      .from("posts")
      .insert({ nickname, guest_id, content, image_urls });
    setLoading(false);
    setContent("");
    setImages([]);
    setPreviews([]);
    if (onSubmit) onSubmit();
    else onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 20, // 기존 32에서 20으로 변경
          minWidth: 320, // 기존 320에서 400으로 변경
          maxWidth: 480, // 기존 400에서 520으로 변경
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0 }}>글쓰기</h3>
        <textarea
          placeholder="내 아이의 상태를 공유해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 16,
            resize: "none",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          }}
        />
        {/* 이미지 첨부 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 15, color: "#555" }}>
            사진 첨부 (최대 3장)
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageChange}
              disabled={images.length >= 3}
            />
            <span
              style={{
                marginLeft: 8,
                color: images.length >= 3 ? "#aaa" : "#22c55e",
                cursor: images.length >= 3 ? "not-allowed" : "pointer",
              }}
            >
              + 사진 추가
            </span>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {previews.map((src, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={src}
                  alt="preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "1px solid #eee",
                  }}
                />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    fontSize: 13,
                    color: "white",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 6 }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 0",
              borderRadius: 12,
              cursor: "pointer",
              border: "none",
              background: "#eee",
              fontSize: 14,
              width: "100%",
              flex: 1,
              color: "white",
              height: 40,
            }}
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "6px 0",
              borderRadius: 12,
              cursor: "pointer",
              border: "none",
              background: "#3CA55C",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              width: "100%",
              flex: 1,
              height: 40,
            }}
            disabled={loading || !content.trim()}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePostModal;
