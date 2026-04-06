import "./Feed.css"
import Post from "../Post/Post"

function Feed() {
  return (
    <main className="feed">
      <h2 className="heading">Home</h2>
      <Post 
        name="Surendra"
        message="Welcome to Silent Help platform"
      />
      <Post 
        name="User"
        message="This website helps disabled people communicate easily."
      />
    </main>
  );
}

export default Feed