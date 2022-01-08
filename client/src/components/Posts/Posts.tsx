import { PostsProps } from "./Posts.types";
import "./PostsStyles.scss";

// TODO: fetch real data from backend
const dummyData = [
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
];

const Posts = ({ posts }: PostsProps) => {
  return (
    <div className="posts">
      {dummyData.map((post, index) => (
        <img className="posts-item" src={post.image} alt="" key={index} />
      ))}
    </div>
  );
};

export default Posts;
