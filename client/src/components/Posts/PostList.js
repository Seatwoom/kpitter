import Post from "./Post";
const PostList = ({
  posts,
  onLike,
  onUnlike,
  currentUser,
  onUserClick,
  onPostClick,
  onLoadMore,
  hasMore,
}) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onPostClick && onPostClick(post)}
          className="cursor-pointer"
        >
          <Post
            post={post}
            onLike={onLike}
            onUnlike={onUnlike}
            currentUser={currentUser}
            onUserClick={onUserClick}
          />
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Load More
          </button>
        </div>
      )}

      {!posts.length && (
        <div className="text-center text-gray-500 py-8">
          No posts to display
        </div>
      )}
    </div>
  );
};

export default PostList;
