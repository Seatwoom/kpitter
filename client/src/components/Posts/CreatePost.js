import { useState } from "react";

const CreatePost = ({ onCreatePost }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onCreatePost({ content });
      setContent("");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={140}
          required
          className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500">
            {content.length}/140 characters
          </div>

          <button
            type="submit"
            disabled={isSubmitting || content.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
