import "./Post.css"

function Post({ name, message }) {
  return (
    <div className="post">

      <div className="avatar"></div>

      <div className="postContent">
        <h4>{name}</h4>
        <p>{message}</p>
      </div>

    </div>
  )
}

export default Post