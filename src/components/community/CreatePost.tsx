interface CreatePostProps {
  newPost: string;
  newPostCategory: string;
  onPostChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCreatePost: () => void;
}

export default function CreatePost({
  newPost,
  newPostCategory,
  onPostChange,
  onCategoryChange,
  onCreatePost,
}: CreatePostProps) {
  return (
    <div className="theme-card mb-8 rounded-2xl border p-5">

      <div className="flex gap-4">

        {/* User Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold">
          YO
        </div>

        <div className="flex-1">

          {/* Post Input */}
          <textarea
            value={newPost}
            onChange={(e) =>
              onPostChange(e.target.value)
            }
            placeholder="What's on your mind?"
            className="form-field min-h-[100px] resize-none"
          />

          {/* Category + Button */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <label
                htmlFor="post-category"
                className="text-sm text-[var(--otaku-muted)]"
              >
                Category:
              </label>

              <select
                id="post-category"
                value={newPostCategory}
                onChange={(e) =>
                  onCategoryChange(e.target.value)
                }
                className="form-field min-h-0 w-auto px-3 py-2 text-sm"
              >
                <option value="General">
                  General
                </option>

                <option value="Anime">
                  Anime
                </option>

                <option value="Manga">
                  Manga
                </option>

                <option value="K-pop">
                  K-pop
                </option>
              </select>

            </div>

            <button
              onClick={onCreatePost}
              disabled={!newPost.trim()}
              className="primary-action min-h-0 px-5 py-2"
            >
              Post
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
