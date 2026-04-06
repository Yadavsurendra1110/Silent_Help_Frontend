import "./Slidebar.css"

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Silent Help</h2>
      <ul>
        <li>Home</li>
        <li>All Problems</li>
        <li>My Posts</li>
        <li>Notifications</li>
        <li>Profile</li>
      </ul>
      <button className="postBtn btn">Post Problem</button>
    </aside>
  );
}

export default Sidebar