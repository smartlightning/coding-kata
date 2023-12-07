import { useEffect, useState } from "react";

function App() {
  // get posts
  const [postData, setPostData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const getAllPosts = async () => {
    const response = await fetch("https://whistlebird.vercel.app/posts");

    const result = await response.json();
    setPostData(result.data);
  };
  const writePost = async (postData) => {
    try {
      const response = await fetch("https://whistlebird.vercel.app/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      return data; // This will be the response from the server, possibly the created post
    } catch (error) {
      console.error("Error writing post:", error);
    }
  };

  useEffect(() => {
    getAllPosts().catch(console.error);
  }, []);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior
    const postContent = { message: inputValue };
    await writePost(postContent);
    setInputValue(""); // Clear the input field after submit
    // Optionally, refresh the posts list here
    await getAllPosts();
  };

  console.log(postData);
  if (!postData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="p-10 bg-gray-100 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            value={inputValue}
            onChange={handleInputChange}
            type="text"
            placeholder="Write your post here"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="mt-10 space-y-6">
        {postData.map((post, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            {post.user ? (
              <div className="flex items-center space-x-4">
                <img
                  src={post.user.image}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <h4 className="text-lg font-semibold">{post.user.name}</h4>
              </div>
            ) : null}
            <p className="mt-2">{post.message}</p>
            <small className="block mt-2 text-gray-500">
              Posted at: {new Date(post.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
