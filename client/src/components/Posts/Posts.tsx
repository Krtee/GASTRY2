import { PostsProps } from "./Posts.types";
import "./PostsStyles.scss";
import { ReactComponent as AddIcon } from "../../assets/icons/add.svg";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/user/User.state";

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const addPost = () => {};
  const [user, setUser] = useRecoilState(userState);

  return (
    <div className="posts">
      <button className="posts-add" onClick={addPost}>
        <span>
          <AddIcon />
        </span>
      </button>
      {user?.posts?.map((post, index) => (
        <img className="posts-item" src={post} alt="" key={index} />
      ))}
    </div>
  );
};

export default Posts;
