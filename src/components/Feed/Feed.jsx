import "./Feed.css"
import Post from "../Post/Post"

function Feed() {
  return (
    <div className="feed">

      <h2>Home</h2>

      <Post 
        name="Surendra"
        message="Welcome to Silent Help platform"
      />

      <Post 
        name="User"
        message="This website helps disabled people communicate easily."
      />

    </div>
  )
}

export default Feed