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
    <div className="mb-8 rounded-2xl border border-gray-800 bg-[#171725] p-5">

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
            className="min-h-[100px] w-full resize-none rounded-xl border border-gray-700 bg-[#10101c] p-4 text-white outline-none placeholder:text-gray-500 focus:border-purple-500"
          />

          {/* Category + Button */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <label
                htmlFor="post-category"
                className="text-sm text-gray-500"
              >
                Category:
              </label>

              <select
                id="post-category"
                value={newPostCategory}
                onChange={(e) =>
                  onCategoryChange(e.target.value)
                }
                className="rounded-lg border border-gray-700 bg-[#10101c] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
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
              className="rounded-lg bg-purple-600 px-5 py-2 font-semibold transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Post
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}