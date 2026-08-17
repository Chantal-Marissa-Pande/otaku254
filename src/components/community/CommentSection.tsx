interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  time: string;
}

interface CommentSectionProps {
  comments: Comment[];
  commentInput: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export default function CommentSection({
  comments,
  commentInput,
  onCommentChange,
  onAddComment,
}: CommentSectionProps) {
  return (
    <div className="mt-5 border-t border-[var(--otaku-border)] pt-5">

      <h4 className="mb-4 font-semibold">
        Comments
      </h4>

      {/* Existing comments */}
      <div className="space-y-4">

        {comments.length === 0 && (
          <p className="text-sm text-gray-500">
            No comments yet. Start the conversation!
          </p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3"
          >

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold">
              {comment.avatar}
            </div>

            <div className="rounded-xl bg-[var(--otaku-bg)] px-4 py-3 flex-1">

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {comment.username}
                </span>

                <span className="text-xs text-gray-600">
                  {comment.time}
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-[var(--otaku-muted)]">
                {comment.content}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* Add comment */}
      <div className="mt-5 flex gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
          YO
        </div>

        <div className="flex flex-1 gap-2">

          <input
            type="text"
            value={commentInput}
            onChange={(e) =>
              onCommentChange(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddComment();
              }
            }}
            placeholder="Write a comment..."
            className="form-field min-w-0 flex-1 py-2 text-sm"
          />

          <button
            onClick={onAddComment}
            disabled={!commentInput.trim()}
            className="primary-action min-h-0 px-4 py-2 text-sm"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}
