import Post from "./Post";
const SinglePost = ({
  post,
  onLike,
  onUnlike,
  currentUser,
  onUserClick,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back
      </button>
      <Post
        post={post}
        onLike={onLike}
        onUnlike={onUnlike}
        currentUser={currentUser}
        onUserClick={onUserClick}
      />
    </div>
  );
};

export default SinglePost;
