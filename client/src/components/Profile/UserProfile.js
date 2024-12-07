import { useState, useEffect } from "react";
import PostList from "../Posts/PostList";
const UserProfile = ({
  username,
  onLoadPosts,
  onLike,
  onUnlike,
  currentUser,
  onPostClick,
  posts = [], 
}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/${username}`
        );
        if (!response.ok) throw new Error("Failed to load user profile");
        const userData = await response.json();
        setUser(userData);

        if (!posts.length) {
          await onLoadPosts(username, 1);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (isLoading && !posts.length) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {user && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h1 className="text-2xl font-bold mb-2">
            {user.full_name || `@${user.username}`}
          </h1>
          {user.full_name && (
            <p className="text-gray-600 mb-2">@{user.username}</p>
          )}
          <p className="text-gray-700">{user.posts} posts</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <PostList
        posts={posts}
        onLike={onLike}
        onUnlike={onUnlike}
        currentUser={currentUser}
        onPostClick={onPostClick}
        hasMore={false}
        onLoadMore={() => {}}
      />
    </div>
  );
};
export default UserProfile;
