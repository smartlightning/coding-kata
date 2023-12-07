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
    const result = await writePost(postContent);
    console.log(result);
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
      <div>
        {postData.map((post, index) => (
          <div key={index}>
            {post.user ? (
              <div>
                <img src={post.user.image} alt={post.user.name} />
                <h4>{post.user.name}</h4>
              </div>
            ) : null}
            <p>{post.message}</p>
            <small>
              Posted at: {new Date(post.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            value={inputValue}
            onChange={handleInputChange}
            type="text"
            placeholder="Write your post here"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
