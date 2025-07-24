import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface CommunityTabProps {
  refreshCommunity?: number;
}

interface Comment {
  id: string;
  post_id: string;
  guest_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

const CommunityTab: React.FC<CommunityTabProps> = ({ refreshCommunity }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [showComments, setShowComments] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [comments, setComments] = useState<{ [id: string]: Comment[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>(
    {}
  );
  const [commentCounts, setCommentCounts] = useState<{ [id: string]: number }>(
    {}
  );
  const [forceRefresh] = useState(0);
  const guest_id = localStorage.getItem("guest_id") || "";
  const nickname = localStorage.getItem("nickname") || "익명";

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const start = Date.now();
      const { data, error } = await supabase
        .from("posts")
        .select("id, nickname, content, created_at, image_urls")
        .order("created_at", { ascending: false });
      if (!error && data) {
        // 각 게시글의 좋아요 수와 내가 누른 여부 조회
        const postIds = data.map((p: any) => p.id);
        let likesMap: Record<string, number> = {};
        let likedMap: Record<string, boolean> = {};
        let commentCountMap: Record<string, number> = {};
        if (postIds.length > 0) {
          // 좋아요 수
          const { data: likesData } = await supabase
            .from("likes")
            .select("post_id, guest_id");
          if (likesData) {
            postIds.forEach((id: string) => {
              likesMap[id] = likesData.filter(
                (l: any) => l.post_id === id
              ).length;
              likedMap[id] = likesData.some(
                (l: any) => l.post_id === id && l.guest_id === guest_id
              );
            });
          }
          // 댓글 개수
          const { data: commentsData } = await supabase
            .from("comments")
            .select("post_id");
          if (commentsData) {
            commentsData.forEach((c: any) => {
              commentCountMap[c.post_id] =
                (commentCountMap[c.post_id] || 0) + 1;
            });
          }
        }
        setCommentCounts(commentCountMap);
        setPosts(
          data.map((p: any) => ({
            ...p,
            likesCount: likesMap[p.id] || 0,
            likedByMe: likedMap[p.id] || false,
          }))
        );
      }
      const elapsed = Date.now() - start;
      await new Promise((res) => setTimeout(res, Math.max(0, 1000 - elapsed)));
      setLoading(false);
    };
    fetchPosts();
  }, [refreshCommunity, forceRefresh]);

  // 댓글 목록 불러오기
  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from("comments")
      .select("id, post_id, guest_id, nickname, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((prev) => ({ ...prev, [postId]: data || [] }));
  };

  // 댓글 등록
  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    await supabase.from("comments").insert({
      post_id: postId,
      guest_id,
      nickname,
      content,
    });
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId);
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

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

  // 좋아요 토글
  const handleLike = async (post: any) => {
    if (!guest_id) return;
    if (post.likedByMe) {
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: post.id, guest_id });
    } else {
      await supabase.from("likes").insert({ post_id: post.id, guest_id });
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likesCount: p.likedByMe ? p.likesCount - 1 : p.likesCount + 1,
              likedByMe: !p.likedByMe,
            }
          : p
      )
    );
  };

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
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: post.guest_id === guest_id ? "#3CA55C" : undefined,
                    }}
                  >
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
                      color: post.likedByMe ? "#e74c3c" : "#888",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    onClick={() => handleLike(post)}
                  >
                    <span role="img" aria-label="like">
                      {post.likedByMe ? "❤️" : "🤍"}
                    </span>
                    {post.likesCount}
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
                      fontSize: 16,
                    }}
                    onClick={() => {
                      setShowComments((prev) => {
                        const next = { ...prev, [post.id]: !prev[post.id] };
                        if (!prev[post.id]) fetchComments(post.id);
                        return next;
                      });
                    }}
                  >
                    <span role="img" aria-label="comment">
                      💬
                    </span>
                    {commentCounts[post.id] || 0}
                  </button>
                </div>
                {/* 댓글 목록 및 입력창 */}
                {showComments[post.id] && (
                  <div
                    style={{
                      marginTop: 12,
                      background: "#fafafa",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        maxHeight: 180,
                        overflowY: "auto",
                        marginBottom: 8,
                      }}
                    >
                      {(comments[post.id] || []).map((c) => (
                        <div
                          key={c.id}
                          style={{ marginBottom: 8, fontSize: 15 }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                c.guest_id === guest_id ? "#3CA55C" : undefined,
                            }}
                          >
                            {c.nickname}
                          </span>
                          <span
                            style={{
                              color: "#bbb",
                              fontSize: 12,
                              marginLeft: 6,
                            }}
                          >
                            {timeAgo(c.created_at)}
                          </span>
                          <span
                            style={{
                              color: "#aaa",
                              fontSize: 12,
                              marginLeft: 8,
                            }}
                          >
                            {c.content}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color:
                            localStorage.getItem("guest_id") === guest_id
                              ? "#3CA55C"
                              : undefined,
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        {nickname}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          placeholder="댓글을 입력하세요"
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          style={{
                            flex: 1,
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            padding: "6px 12px",
                            fontSize: 15,
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          style={{
                            background: "#fff",
                            border: "1.5px solid #3CA55C",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(60,165,92,0.08)",
                            transition: "box-shadow 0.15s",
                          }}
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3CA55C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 19V5" />
                            <polyline points="5 12 12 5 19 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommunityTab;
