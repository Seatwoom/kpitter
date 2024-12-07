import { useState } from "react";

const Post = ({ post, onLike, onUnlike, currentUser, onUserClick }) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking || !currentUser) return;

    setIsLiking(true);
    try {
      if (post.is_liked) {
        await onUnlike(post);
      } else {
        await onLike(post);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
    setIsLiking(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const PostHeader = () => (
    <div className="flex items-center mb-2">
      {onUserClick ? (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(post.author.username);
            }}
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {post.author.full_name || post.author.username}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(post.author.username);
            }}
            className="text-gray-500 text-sm ml-2 cursor-pointer hover:text-gray-700"
          >
            @{post.author.username}
          </div>
        </>
      ) : (
        <>
          <div className="font-medium text-gray-900">
            {post.author.full_name || post.author.username}
          </div>
          <div className="text-gray-500 text-sm ml-2">
            @{post.author.username}
          </div>
        </>
      )}
      <div className="text-gray-400 text-sm ml-auto">
        {formatDate(post.created_at)}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <PostHeader />
      <p className="text-gray-800 mb-3">{post.content}</p>
      <div className="flex items-center">
        <button
          onClick={handleLikeToggle}
          disabled={isLiking || !currentUser}
          className={`flex items-center space-x-1 ${
            post.is_liked ? "text-red-500" : "text-gray-500"
          } hover:text-red-500 disabled:opacity-50`}
        >
          <svg
            className="w-5 h-5"
            fill={post.is_liked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{post.likes}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
