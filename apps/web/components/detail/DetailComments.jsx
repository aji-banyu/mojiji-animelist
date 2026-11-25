"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  CornerDownRight,
  Send,
  User,
  ChevronDown,
  Check,
  ArrowUpDown,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INPUT_WRAPPER_CLASS =
  "flex flex-1 min-w-0 items-end gap-2.5 rounded-xl border border-border px-3.5 outline-none hover:border-border-hover focus-within:border-primary/40 transition-colors cursor-text";

const TEXTAREA_BASE_CLASS =
  "w-full flex-1 min-w-0 resize-none border-0 bg-transparent py-[3px] text-sm leading-[22px] text-text placeholder:text-text-3 outline-none focus:outline-none focus:ring-0 custom-scrollbar";

const COMMENT_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "best", label: "Terbaik" },
  { value: "oldest", label: "Terlama" },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function getInitials(name) {
  if (!name) return "AN";
  const parts = name.trim().split(/[\s_]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatRelativeTime(isoString, nowMs) {
  const createdMs = new Date(isoString).getTime();
  if (Number.isNaN(createdMs)) return "";
  const diff = Math.max(0, nowMs - createdMs);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(createdMs));
}

function formatExactTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function autoResizeTextarea(el, maxHeight) {
  if (!el) return;
  el.style.height = "auto";
  const nextHeight = Math.min(el.scrollHeight, maxHeight);
  el.style.height = `${nextHeight}px`;
  el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Avatar({ username, className = "" }) {
  return (
    <span
      className={`h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center select-none uppercase ${className}`}
    >
      {getInitials(username)}
    </span>
  );
}

/* ─── Soft Like Button ────────────────────────────────────── */
function LikeButton({ liked, count, size = 13, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer outline-none focus:outline-none ${
        liked ? "text-text-2" : "text-text-3 hover:text-destructive/75"
      }`}
      aria-label={liked ? "Batalkan suka" : "Suka"}
    >
      <Heart
        size={size}
        className={
          liked
            ? "fill-destructive/65 text-destructive/80 transition-colors"
            : "transition-colors"
        }
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}

/* ─── Single Reply ────────────────────────────────────────── */
function ReplyItem({ reply, nowMs, onLikeReply, commentId }) {
  return (
    <div className="flex gap-2.5 group">
      <Avatar username={reply.username} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-text leading-none">
            {reply.username}
          </span>
          <time
            dateTime={reply.createdAt}
            title={formatExactTime(reply.createdAt)}
            className="text-[11px] text-text-3"
          >
            {formatRelativeTime(reply.createdAt, nowMs)}
          </time>
        </div>
        <p className="mt-1 text-sm text-text leading-relaxed break-words">
          {reply.content}
        </p>
        <div className="mt-1.5">
          <LikeButton
            liked={reply.likedByMe}
            count={reply.likes}
            size={12}
            onClick={() => onLikeReply(commentId, reply.id)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Single Comment ──────────────────────────────────────── */
function CommentItem({
  comment,
  nowMs,
  currentUser,
  onLike,
  onLikeReply,
  onReplySubmit,
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const replyRef = useRef(null);

  const handleToggleReply = useCallback(() => {
    setShowReplyInput((v) => {
      if (!v) setTimeout(() => replyRef.current?.focus(), 50);
      return !v;
    });
  }, []);

  const handleSendReply = useCallback(() => {
    const content = replyValue.trim();
    if (!content) return;
    onReplySubmit(comment.id, content);
    setReplyValue("");
    setShowReplyInput(false);
  }, [comment.id, onReplySubmit, replyValue]);

  const handleReplyKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && replyValue.trim()) {
        e.preventDefault();
        handleSendReply();
      }
    },
    [handleSendReply, replyValue]
  );

  return (
    <div className="flex gap-3 group">
      <Avatar username={comment.username} />

      <div className="flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-text leading-none">
            {comment.username}
          </span>
          <time
            dateTime={comment.createdAt}
            title={formatExactTime(comment.createdAt)}
            className="text-[11px] text-text-3"
          >
            {formatRelativeTime(comment.createdAt, nowMs)}
          </time>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm text-text leading-relaxed break-words">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-3.5">
          <LikeButton
            liked={comment.likedByMe}
            count={comment.likes}
            size={13}
            onClick={() => onLike(comment.id)}
          />

          {currentUser && (
            <button
              type="button"
              onClick={handleToggleReply}
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-3 hover:text-primary-text transition-colors cursor-pointer outline-none focus:outline-none"
            >
              <CornerDownRight size={12} />
              Balas
            </button>
          )}
        </div>

        {/* Inline Reply Input */}
        {showReplyInput && currentUser && (
          <div className="mt-3 flex max-w-xl items-start gap-2.5">
            <Avatar username={currentUser.username} className="mt-1" />
            <div
              onClick={() => replyRef.current?.focus()}
              className={`${INPUT_WRAPPER_CLASS} bg-bg py-[5px] min-h-[40px]`}
            >
              <textarea
                ref={replyRef}
                value={replyValue}
                onChange={(e) => setReplyValue(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                placeholder={`Balas ke ${comment.username}...`}
                rows={1}
                className={TEXTAREA_BASE_CLASS}
                style={{ maxHeight: "120px", overflowY: "hidden" }}
                onInput={(e) => autoResizeTextarea(e.target, 120)}
              />
              {replyValue.trim() && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendReply();
                  }}
                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center bg-transparent text-primary hover:text-primary-hover active:scale-95 transition-all cursor-pointer outline-none focus:outline-none"
                  aria-label="Kirim balasan"
                >
                  <Send size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reply Thread */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-3.5 border-l-2 border-border space-y-3">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                nowMs={nowMs}
                commentId={comment.id}
                onLikeReply={onLikeReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function DetailComments({ type, malId }) {
  const user = useAuthStore((s) => s.user);
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const textareaRef = useRef(null);
  const sortRef = useRef(null);

  /* ── Realtime clock tick for relative timestamps ── */
  useEffect(() => {
    if (comments.length === 0) return undefined;
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, [comments.length]);

  /* ── Close sort dropdown on outside click or Escape ── */
  useEffect(() => {
    if (!sortOpen) return undefined;
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [sortOpen]);

  /* ── Redirect path for guest ── */
  const redirectPath =
    typeof window !== "undefined"
      ? `/login/?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
      : "/login/";

  /* ── Total count (top-level + replies) ── */
  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  /* ── Sorted comments ── */
  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortBy === "oldest") {
      return list.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    if (sortBy === "best") {
      return list.sort(
        (a, b) =>
          b.likes - a.likes ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments, sortBy]);

  const activeSortLabel =
    COMMENT_SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Terbaru";

  /* ── Handlers ── */
  const handleSubmit = useCallback(() => {
    const content = inputValue.trim();
    if (!content || !user) return;
    const nowIso = new Date().toISOString();
    setNowMs(Date.now());
    setComments((prev) => [
      {
        id: crypto.randomUUID(),
        userId: user.id,
        username: user.username,
        content,
        createdAt: nowIso,
        likes: 0,
        likedByMe: false,
        replies: [],
      },
      ...prev,
    ]);
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  }, [inputValue, user]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [inputValue, handleSubmit]
  );

  const handleLike = useCallback((commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likedByMe: !c.likedByMe,
              likes: c.likedByMe ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  }, []);

  const handleLikeReply = useCallback((commentId, replyId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId
                  ? {
                      ...r,
                      likedByMe: !r.likedByMe,
                      likes: r.likedByMe ? r.likes - 1 : r.likes + 1,
                    }
                  : r
              ),
            }
          : c
      )
    );
  }, []);

  const handleReplySubmit = useCallback(
    (parentId, content) => {
      if (!user || !content) return;
      const nowIso = new Date().toISOString();
      setNowMs(Date.now());
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: [
                  ...(c.replies || []),
                  {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    username: user.username,
                    content,
                    createdAt: nowIso,
                    likes: 0,
                    likedByMe: false,
                  },
                ],
              }
            : c
        )
      );
    },
    [user]
  );

  /* suppress unused vars for future API integration */
  void type;
  void malId;

  /* ───────────────────────── RENDER ───────────────────────── */
  return (
    <section className="pt-6 border-t border-border space-y-5">
      {/* ── Header + Sortiran (Sejajar lebar box komentar) ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-text font-heading">
            Komentar
          </h2>
          <span className="text-xs font-bold text-text-3 bg-surface-2 border border-border rounded-full px-2.5 py-0.5 tabular-nums">
            {totalCount}
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOpen((prev) => !prev)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            className="rounded-full px-3.5 text-xs font-semibold gap-1.5"
          >
            <ArrowUpDown size={13} className="text-text-2" />
            <span>{activeSortLabel}</span>
            <ChevronDown
              size={14}
              className={cn(
                "text-text-2 transition-transform duration-150",
                sortOpen && "rotate-180"
              )}
            />
          </Button>

          {sortOpen && (
            <div
              role="listbox"
              aria-label="Urutkan komentar berdasarkan"
              className="absolute right-0 top-full mt-2 z-30 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-lg animate-in fade-in zoom-in-95 duration-150"
            >
              {COMMENT_SORT_OPTIONS.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary-soft text-primary-text font-bold"
                        : "font-medium text-text-2 hover:text-text hover:bg-surface-2"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className="text-primary-text" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Input Bar (Tetap ringkas, terpisah di atas box) ── */}
      <div className="max-w-2xl">
        {user ? (
          /* Logged-in: active flex input bar */
          <div className="flex gap-3 items-start">
            <Avatar username={user.username} className="mt-1.5" />
            <div
              onClick={() => textareaRef.current?.focus()}
              className={`${INPUT_WRAPPER_CLASS} bg-surface py-[7px] min-h-[44px]`}
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis komentar..."
                rows={1}
                className={TEXTAREA_BASE_CLASS}
                style={{ maxHeight: "160px", overflowY: "hidden" }}
                onInput={(e) => autoResizeTextarea(e.target, 160)}
              />
              {inputValue.trim() && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  className="shrink-0 inline-flex h-7 w-7 items-center justify-center bg-transparent text-primary hover:text-primary-hover active:scale-95 transition-all cursor-pointer outline-none focus:outline-none"
                  aria-label="Kirim komentar"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Guest: clickable bar → redirect to login */
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2 min-h-[44px]">
            <div className="h-8 w-8 shrink-0 rounded-full bg-surface-2 border border-border flex items-center justify-center">
              <User size={15} className="text-text-3" />
            </div>
            <span className="flex-1 text-sm text-text-3 select-none">
              Tulis komentar...
            </span>
            <Link
              href={redirectPath}
              className="shrink-0 bg-primary text-primary-foreground text-xs font-bold rounded-full px-4 py-1.5 hover:bg-primary-hover transition-colors"
            >
              Masuk
            </Link>
          </div>
        )}
      </div>

      {/* ── Box Isi Komentar (Terpisah dari Input Bar) ── */}
      <div className="w-full rounded-xl border border-border bg-surface shadow-sm">
        {sortedComments.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2 text-text-3">
              <MessageCircle size={20} strokeWidth={1.6} />
            </div>
            <p className="text-sm font-semibold text-text-2">
              Belum ada komentar
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 divide-y divide-border/60">
            {sortedComments.map((comment) => (
              <div key={comment.id} className="py-5 first:pt-0 last:pb-0">
                <CommentItem
                  comment={comment}
                  nowMs={nowMs}
                  currentUser={user}
                  onLike={handleLike}
                  onLikeReply={handleLikeReply}
                  onReplySubmit={handleReplySubmit}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
