import { UserPostsProps } from "./UserPosts.types";
import "./UserPostsStyles.scss";

const UserPosts = ({ posts }: UserPostsProps) => {
  return (
    <div className="user-posts">
      {posts.map((post) => (
        <div className="user-posts-item"></div>
      ))}
    </div>
  );
};

export default UserPosts;
