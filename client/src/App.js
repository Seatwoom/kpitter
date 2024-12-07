import { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Post from "./components/Posts/Post";
import PostList from "./components/Posts/PostList";
import CreatePost from "./components/Posts/CreatePost";
import UserProfile from "./components/Profile/UserProfile";
import SinglePost from "./components/Posts/SinglePost";
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    return currentUser ? "home" : "register";
  });

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [userCredentials, setUserCredentials] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);

  const API_URL = "http://localhost:8000/api";

  const getAuthHeader = (username, password) => ({
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  });
  const loadAllPosts = async () => {
    try {
      const users = ["user_1", "user_2", "user_3"];
      const allPosts = [];

      const headers = userCredentials
        ? getAuthHeader(userCredentials.username, userCredentials.password)
        : {};

      for (const username of users) {
        const response = await fetch(`${API_URL}/users/${username}/posts`, {
          headers,
        });

        if (response.ok) {
          const userPosts = await response.json();
          allPosts.push(...userPosts);
        }
      }

      allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setFeedPosts(allPosts);
    } catch (error) {
      setError("Failed to load feed");
    }
  };

  useEffect(() => {
    if (currentUser && currentPage === "feed") {
      loadAllPosts();
    }
  }, [currentPage, currentUser]);

  const handleLogin = async (credentials) => {
    try {
      const loginResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(credentials.username, credentials.password),
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Login failed");
      }

      const userResponse = await fetch(`${API_URL}/me`, {
        headers: getAuthHeader(credentials.username, credentials.password),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user data");
      }

      const userData = await userResponse.json();
      setCurrentUser(userData);
      setUserCredentials(credentials);
      setCurrentPage("home");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Registration failed");
      setCurrentPage("login");
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const handleCreatePost = async (postData) => {
    if (!currentUser || !userCredentials) return;

    try {
      const response = await fetch(
        `${API_URL}/users/${currentUser.username}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(
              userCredentials.username,
              userCredentials.password
            ),
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      throw new Error("Failed to create post");
    }
  };
  const handleLikePost = async (post) => {
    if (!currentUser || !userCredentials) return;

    try {
      const response = await fetch(
        `${API_URL}/users/${post.author.username}/posts/${post.id}/like`,
        {
          method: "PUT",
          headers: getAuthHeader(
            userCredentials.username,
            userCredentials.password
          ),
        }
      );

      if (!response.ok) throw new Error("Failed to like post");

      const updatedPost = { ...post, likes: post.likes + 1, is_liked: true };

      updatePostInAllLists(updatedPost);

      if (selectedPost?.id === post.id) {
        setSelectedPost(updatedPost);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleUnlikePost = async (post) => {
    if (!currentUser || !userCredentials) return;

    try {
      const response = await fetch(
        `${API_URL}/users/${post.author.username}/posts/${post.id}/like`,
        {
          method: "DELETE",
          headers: getAuthHeader(
            userCredentials.username,
            userCredentials.password
          ),
        }
      );

      if (!response.ok) throw new Error("Failed to unlike post");

      const updatedPost = { ...post, likes: post.likes - 1, is_liked: false };
      updatePostInAllLists(updatedPost);
      if (selectedPost?.id === post.id) {
        setSelectedPost(updatedPost);
      }
    } catch (error) {
      console.error("Failed to unlike post:", error);
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setUserCredentials(null);
    setPosts([]);
    setCurrentPage("login");
  };

  const loadPosts = async () => {
    try {
      const headers = userCredentials
        ? getAuthHeader(userCredentials.username, userCredentials.password)
        : {};

      const response = await fetch(
        `${API_URL}/users/${currentUser.username}/posts`,
        {
          headers,
        }
      );

      if (!response.ok) throw new Error("Failed to load posts");

      const postsData = await response.json();
      setPosts(postsData);
    } catch (error) {
      setError("Failed to load posts");
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadPosts();
    }
  }, [currentUser]);
  const handleViewProfile = async (username) => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`);
      if (!response.ok) throw new Error("Failed to load user profile");
      const userData = await response.json();
      setSelectedProfile(userData);
      setCurrentPage("profile");
    } catch (error) {
      setError("Failed to load user profile");
    }
  };
  const updatePostInAllLists = (updatedPost) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );

    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    if (profilePosts.length > 0) {
      setProfilePosts((prevPosts) =>
        prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    }

    if (selectedPost?.id === updatedPost.id) {
      setSelectedPost(updatedPost);
    }
  };

  const loadUserPosts = async (username, page = 1) => {
    try {
      const headers = userCredentials
        ? getAuthHeader(userCredentials.username, userCredentials.password)
        : {};

      const response = await fetch(
        `${API_URL}/users/${username}/posts?page=${page}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to load posts");
      const posts = await response.json();
      setProfilePosts(posts); 
      return posts;
    } catch (error) {
      throw new Error("Failed to load posts");
    }
  };
  const handlePostClick = (post) => {
    setPreviousPage(currentPage);
    setSelectedPost(post);
    setCurrentPage("single-post");
  };

  const renderContent = () => {
    if (!currentUser && currentPage === "home") {
      return (
        <Register
          onRegister={handleRegister}
          onRegisterSuccess={() => setCurrentPage("login")}
        />
      );
    }

    switch (currentPage) {
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onLoginSuccess={() => setCurrentPage("home")}
          />
        );
      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onRegisterSuccess={() => setCurrentPage("login")}
          />
        );
      case "profile":
        if (selectedProfile) {
          return (
            <UserProfile
              username={selectedProfile.username}
              onLoadPosts={loadUserPosts}
              onLike={handleLikePost}
              onUnlike={handleUnlikePost}
              currentUser={currentUser}
              onPostClick={handlePostClick}
              posts={profilePosts}
            />
          );
        }
      case "home":
        return (
          <div className="max-w-2xl mx-auto p-4">
            {currentUser && <CreatePost onCreatePost={handleCreatePost} />}
            <PostList
              posts={posts}
              onLike={handleLikePost}
              onUnlike={handleUnlikePost}
              currentUser={currentUser}
              onUserClick={handleViewProfile}
              onPostClick={handlePostClick}
              hasMore={false}
              onLoadMore={() => {}}
            />
          </div>
        );
      case "feed":
        return (
          <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h1 className="text-2xl font-bold mb-2">Feed</h1>
              <p className="text-gray-700">All posts</p>
            </div>
            <PostList
              posts={feedPosts}
              onLike={handleLikePost}
              onUnlike={handleUnlikePost}
              currentUser={currentUser}
              onUserClick={handleViewProfile}
              onPostClick={handlePostClick}
              hasMore={false}
              onLoadMore={() => {}}
            />
          </div>
        );
      case "single-post":
        return (
          <div className="max-w-2xl mx-auto p-4">
            <button
              onClick={() => {
                if (selectedPost) {
                  updatePostInAllLists(selectedPost);
                }
                setCurrentPage(previousPage || "feed");
                setSelectedPost(null);
              }}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <span>← Back</span>
            </button>
            {selectedPost && (
              <Post
                post={selectedPost}
                onLike={handleLikePost}
                onUnlike={handleUnlikePost}
                currentUser={currentUser}
                onUserClick={handleViewProfile}
              />
            )}
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />
      <main className="flex-grow">
        {error && (
          <div className="max-w-2xl mx-auto p-4 mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};
export default App;
