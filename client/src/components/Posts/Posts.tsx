import { useRecoilValue } from "recoil";
import { ReactComponent as AddIcon } from "../../assets/icons/add.svg";
import { userState } from "../../utils/user/User.state";
import { PostsProps } from "./Posts.types";
import "./PostsStyles.scss";

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const addPost = () => {};
  const { user } = useRecoilValue(userState);

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
