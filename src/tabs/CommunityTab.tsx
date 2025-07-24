import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface CommunityTabProps {
  refreshCommunity?: number;
}

const CommunityTab: React.FC<CommunityTabProps> = ({ refreshCommunity }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [forceRefresh] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const start = Date.now();
      const { data, error } = await supabase
        .from("posts")
        .select("id, nickname, content, created_at, image_urls")
        .order("created_at", { ascending: false });
      const elapsed = Date.now() - start;
      await new Promise((res) => setTimeout(res, Math.max(0, 1000 - elapsed)));
      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, [refreshCommunity, forceRefresh]);

  // 시간 표시 함수
  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: 24,
        position: "relative",
        minHeight: "80vh",
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
            height: 36,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                border: "2.5px solid #ddd",
                borderTop: "2.5px solid #22c55e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {posts.length === 0 && !loading ? (
        <p>아직 게시글이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {posts.map((post) => {
            const lines = post.content.split("\n");
            const long = lines.length > 3;
            const showAll = expanded[post.id];
            const preview = lines.slice(0, 3).join("\n");
            return (
              <li
                key={post.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  padding: 20,
                  marginBottom: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* 상단: 프로필, 닉네임, 시간 */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                      post.nickname
                    )}`}
                    alt="profile"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#eee",
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>
                    {post.nickname}
                  </span>
                  <span style={{ color: "#888", fontSize: 13, marginLeft: 8 }}>
                    {timeAgo(post.created_at)}
                  </span>
                </div>
                {/* 본문: 처음 3줄만, 더보기 클릭 시 전체 표시 */}
                <div
                  style={{
                    fontSize: 16,
                    color: "#222",
                    lineHeight: 1.6,
                    minHeight: 48,
                    whiteSpace: "pre-line",
                  }}
                  title={post.content}
                >
                  {showAll ? post.content : preview}
                </div>
                {/* 이미지 썸네일 */}
                {Array.isArray(post.image_urls) &&
                  post.image_urls.length > 0 && (
                    <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
                      {post.image_urls
                        .slice(0, 3)
                        .map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt="첨부 이미지"
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid #eee",
                            }}
                          />
                        ))}
                    </div>
                  )}
                {/* 더보기/간략히 버튼 */}
                {long &&
                  (showAll ? (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#888",
                        fontWeight: 600,
                        cursor: "pointer",
                        alignSelf: "flex-start",
                        padding: 0,
                        marginTop: -8,
                      }}
                      onClick={() =>
                        setExpanded((e) => ({ ...e, [post.id]: false }))
                      }
                    >
                      간략히
                    </button>
                  ) : (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#888",
                        fontWeight: 600,
                        cursor: "pointer",
                        alignSelf: "flex-start",
                        padding: 0,
                        marginTop: -8,
                      }}
                      onClick={() =>
                        setExpanded((e) => ({ ...e, [post.id]: true }))
                      }
                    >
                      ... 더 보기
                    </button>
                  ))}
                {/* 하단: 좋아요, 댓글, 조회수 */}
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    marginTop: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                    }}
                  >
                    <span role="img" aria-label="like">
                      👍
                    </span>{" "}
                    좋아요
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                    }}
                  >
                    <span role="img" aria-label="comment">
                      💬
                    </span>{" "}
                    댓글 쓰기
                  </button>
                  <span style={{ marginLeft: "auto" }}>조회 0</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommunityTab;
