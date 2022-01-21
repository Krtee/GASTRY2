import { PostsProps } from "./Posts.types";
import "./PostsStyles.scss";
import { ReactComponent as AddIcon } from "../../assets/icons/add.svg";

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

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const addPost = () => {};

  return (
    <div className="posts">
      <button className="posts-add" onClick={addPost}>
        <span>
          <AddIcon />
        </span>
      </button>
      {dummyData.map((post, index) => (
        <img className="posts-item" src={post.image} alt="" key={index} />
      ))}
    </div>
  );
};

export default Posts;
