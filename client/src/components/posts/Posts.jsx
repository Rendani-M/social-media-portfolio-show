import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery(
    ["posts"],
    () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      }),
    { refetchInterval: 60000 }
  );  
  
  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post?.id} />)}
    </div>
  );
};

export default Posts;
