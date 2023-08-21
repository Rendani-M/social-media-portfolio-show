import { makeRequest } from "../../axios";
import { useContext, useEffect, useState } from "react";
import subProfilePic from "../../assets/profilePic.jpg";
import { AuthContext } from "../../context/authContext";
import "./mobileOnlineUsers.scss";
import { Button } from "@mui/material";

function MobileOnlineUsers() {
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const { currentUser } = useContext(AuthContext);
  
    useEffect(() => {
      const fetchOnlineData = async () => {
        setIsLoadingFriends(true);
    
        try {
          const friendsResponse = await makeRequest.get("/onlinestatus/friends");
          setOnlineFriends(friendsResponse.data);
        } catch (error) {
          console.log(error);
        }
    
        setIsLoadingFriends(false);
      };
    
      fetchOnlineData();
      const interval = setInterval(fetchOnlineData, 60000);
    
      return () => clearInterval(interval);
    }, []);
    
  
    useEffect(() => {
      const fetchOnlineData = async () => {
        setIsLoadingUsers(true);
    
        try {
          const usersResponse = await makeRequest.get("/onlinestatus/users");
          setOnlineUsers(usersResponse.data);
        } catch (error) {
          console.log(error);
        }
    
        setIsLoadingUsers(false);
      };
    
      fetchOnlineData();
      const interval = setInterval(fetchOnlineData, 60000);
    
      return () => clearInterval(interval);
    }, []);
    
  
    const handleFollowUser = async (userId) => {
      try {
        await makeRequest.post("/relationships", { userId });
        setOnlineFriends((prev) => [...prev, onlineUsers.find((user) => user.id === userId)]);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleUnfollowUser = async (userId) => {
      try {
        await makeRequest.delete(`/relationships/${userId}`);
        setOnlineFriends((prev) => prev.filter((friend) => friend.id !== userId));
      } catch (error) {
        console.log(error);
      }
    };
  
    const filteredOnlineFriends = onlineFriends.filter((friend) => friend.id !== currentUser.id);
  
    return (
        <div className="contacts">
          <div className="container">
    
            <div className="item">
              <span>Online Friends</span>
              {isLoadingFriends ? (
                <div className="userInfo">
                  <span>Loading...</span>
                </div>
              ) : (
                filteredOnlineFriends?.map((friend) => (
                  <div className="user" key={friend?.id}>
                    <div className="userInfo">
                      <img src={friend?.profilePic || subProfilePic} alt="" />
                      <div className="online" />
                      <span>{friend?.name}</span>
                      <Button
                        onClick={() => handleUnfollowUser(friend.id)}
                        variant="contained"
                        color="secondary"
                      >
                        Unfollow
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="item">
              <span>App Users</span>
              {isLoadingUsers ? (
                <div className="userInfo">
                  <span>Loading...</span>
                </div>
              ) : (
                onlineUsers?.map((user) => (
                  !onlineFriends.find((friend) => friend.id === user.id) && (
                    <div className="user" key={user?.id}>
                      <div className="userInfo">
                        <img src={user?.profilePic || subProfilePic} alt="" />
                        <div className="online" />
                        <span>{user?.name}</span>
                        {user.id !== currentUser?.id && (
                          <Button onClick={() => handleFollowUser(user.id)} variant="contained" color="primary">
                            Follow
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </div>
        </div>
    );
}

export default MobileOnlineUsers