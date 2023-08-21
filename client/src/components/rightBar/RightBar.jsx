import { makeRequest } from "../../axios";
import "./rightBar.scss";
import { useContext, useEffect, useState } from "react";
import { ImageList, ImageListItem, Button } from "@mui/material";
import subProfilePic from "../../assets/profilePic.jpg";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {

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
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Advertisement</span>
          <div className="user">
            <img
              src="https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2023/02/02/3a77dc93-869c-409a-9bbc-a83f93fce7b7_087218b5.jpg"
              alt=""
            />
          </div>
        </div>

        <div className="item">
          <span>Latest Activities</span>
          <div className="album">
            <ImageList
              cols={3}
              rowHeight={90}
              gap={5}
              sx={{ overflow: "hidden", padding: "1em" }}
            >
              {itemData.map((item) => (
                <ImageListItem key={item?.img}>
                  <img
                    src={`${item?.img}?w=100&h=100&fit=crop&auto=format`}
                    srcSet={`${item?.img}?w=100&h=100&fit=crop&auto=format&dpr=2 2x`}
                    alt={item?.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        </div>

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
};


const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
];

export default RightBar;
