import "./Slidebar.css"

function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="logo">Silent Help</h2>

      <ul>
        <li>Home</li>
        <li>All Problems</li>
        <li>My Posts</li>
        <li>Notifications</li>
        <li>Profile</li>
      </ul>

      <button className="postBtn">Post Problem</button>

    </div>
  )
}

export default Sidebar