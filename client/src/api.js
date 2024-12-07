const API_URL = "http://localhost:8000/api";

const getAuthHeader = (username, password) => ({
  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
});

export const api = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(username, password),
      },
    });
    if (!response.ok) throw new Error("Login failed");
    return true;
  },

  // User endpoints
  getMe: async (username, password) => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeader(username, password),
    });
    if (!response.ok) throw new Error("Failed to get user data");
    return response.json();
  },

  getUser: async (username) => {
    const response = await fetch(`${API_URL}/users/${username}`);
    if (!response.ok) throw new Error("Failed to get user data");
    return response.json();
  },

  getUserPosts: async (
    username,
    page = 1,
    authUsername = null,
    authPassword = null
  ) => {
    const headers = authUsername
      ? getAuthHeader(authUsername, authPassword)
      : {};
    const response = await fetch(
      `${API_URL}/users/${username}/posts?page=${page}`,
      {
        headers,
      }
    );
    if (!response.ok) throw new Error("Failed to get posts");
    return response.json();
  },

  createPost: async (username, password, content) => {
    const response = await fetch(`${API_URL}/users/${username}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(username, password),
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },

  likePost: async (postAuthor, postId, username, password) => {
    const response = await fetch(
      `${API_URL}/users/${postAuthor}/posts/${postId}/like`,
      {
        method: "PUT",
        headers: getAuthHeader(username, password),
      }
    );
    if (!response.ok) throw new Error("Failed to like post");
    return true;
  },

  unlikePost: async (postAuthor, postId, username, password) => {
    const response = await fetch(
      `${API_URL}/users/${postAuthor}/posts/${postId}/like`,
      {
        method: "DELETE",
        headers: getAuthHeader(username, password),
      }
    );
    if (!response.ok) throw new Error("Failed to unlike post");
    return true;
  },
};
