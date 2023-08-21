import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import subProfilePic from "../../assets/profilePic.jpg";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(
    ["comments"],
    () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
    { refetchInterval: 60000 }
  );
  

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const randomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.31)`;
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser?.profilePic || subProfilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div
              className="comment"
              style={{
                boxShadow: `1px 0px 10px 6px ${randomColor()}`,
                WebkitBoxShadow: `1px 0px 10px 6px ${randomColor()}`,
                MozBoxShadow: `1px 0px 10px 6px ${randomColor()}`,
              }}
            >
              <img src={comment?.profilePic || subProfilePic} alt="" />
              <div className="info">
                <span>{comment?.name}</span>
                <p>{comment?.desc}</p>
              </div>
              <span className="date">
                {moment(comment?.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
