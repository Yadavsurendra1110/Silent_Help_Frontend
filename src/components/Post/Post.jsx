import "./Post.css"

function Post({ name, message }) {
  return (
    <section className="post card">
      <div className="avatar"></div>
      <div className="postContent">
        <h4>{name}</h4>
        <p>{message}</p>
      </div>
    </section>
  );
}

export default Post