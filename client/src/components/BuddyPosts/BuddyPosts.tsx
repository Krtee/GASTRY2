import { BuddyPostsProps } from "./BuddyPosts.types";
import "./BuddyPosts.styles.scss";

const BuddyPosts: React.FC<BuddyPostsProps> = ({ posts }) => {
  return (
    <div className="posts">
      {posts?.map((post, index) => (
        <img className="posts-item" src={""} alt="" key={index} />
      ))}
    </div>
  );
};

export default BuddyPosts;
