import React, { useEffect, useState } from "react";
import PullToRefresh from "react-pull-to-refresh";
import { supabase } from "../supabaseClient";

interface CommunityTabProps {
  refreshCommunity?: number;
}

// 더미 프로필 이미지
const dummyProfile = "https://api.dicebear.com/7.x/thumbs/svg?seed=guest";

const CommunityTab: React.FC<CommunityTabProps> = ({ refreshCommunity }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("id, nickname, content, created_at, image_urls")
        .order("created_at", { ascending: false });
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

  // 3줄 이상인지 대략 판단 (글자 수 기준, 한글 기준 45자*3=135자)
  const isLongContent = (content: string) =>
    content.length > 135 || content.split("\n").length > 3;

  return (
    <PullToRefresh
      style={{ width: "100%" }}
      onRefresh={() =>
        new Promise((resolve) => {
          setForceRefresh((v) => v + 1);
          resolve();
        })
      }
    >
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
            style={{ textAlign: "center", color: "#22c55e", marginBottom: 12 }}
          >
            불러오는 중...
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <img
                      src={dummyProfile}
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
                    <span
                      style={{ color: "#888", fontSize: 13, marginLeft: 8 }}
                    >
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
    </PullToRefresh>
  );
};

export default CommunityTab;
