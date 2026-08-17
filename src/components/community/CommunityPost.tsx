import CommentSection from "./CommentSection";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
}

interface CommunityPostData {
  id: string;
  username: string;
  avatar: string;
  category: string;
  content: string;
  likes: number;
  liked: boolean;
  time: string;
  comments: Comment[];
}

interface CommunityPostProps {
  post: CommunityPostData;
  commentsOpen: boolean;
  commentInput: string;
  onLike: () => void;
  onToggleComments: () => void;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export default function CommunityPost({
  post,
  commentsOpen,
  commentInput,
  onLike,
  onToggleComments,
  onCommentChange,
  onAddComment,
}: CommunityPostProps) {
  return (
    <article className="theme-card rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-purple-500/40">

      {/* User information */}
      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 font-bold">
          {post.avatar}
        </div>

        <div>
          <h3 className="font-semibold">
            {post.username}
          </h3>

          <p className="text-sm text-[var(--otaku-muted)]">
            {post.time}
          </p>
        </div>

        <span className="ml-auto rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
          {post.category}
        </span>

      </div>

      {/* Post content */}
      <p className="mt-4 leading-7 text-[var(--otaku-text)]">
        {post.content}
      </p>

      {/* Actions */}
      <div className="mt-5 flex gap-6 border-t border-[var(--otaku-border)] pt-4">

        <button
          onClick={onLike}
          className={`flex items-center gap-2 transition ${
            post.liked
              ? "text-pink-400"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <span>
            {post.liked ? "❤️" : "♡"}
          </span>

          <span>
            {post.likes}
          </span>
        </button>

        <button
          onClick={onToggleComments}
          className="flex items-center gap-2 text-gray-400 transition hover:text-purple-400"
        >
          <span>💬</span>

          <span>
            {post.comments.length}
          </span>
        </button>

      </div>

      {/* Comments */}
      {commentsOpen && (
        <CommentSection
          comments={post.comments}
          commentInput={commentInput}
          onCommentChange={onCommentChange}
          onAddComment={onAddComment}
        />
      )}

    </article>
  );
}
