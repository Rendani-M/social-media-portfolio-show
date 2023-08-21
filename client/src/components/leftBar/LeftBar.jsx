import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useNavigate} from "react-router-dom";
import { AutoAwesomeOutlined, BrowseGalleryOutlined, EmojiEventsOutlined, GamepadOutlined, GroupOutlined, Logout, MessageOutlined, MovieOutlined, PeopleAltOutlined, PersonOutline, SavingsOutlined, ShopOutlined, VideoCallOutlined } from "@mui/icons-material";

const LeftBar = () => {
  const history = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      history("/login")
      
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="item">
            <PeopleAltOutlined/>
            <span>Friends</span>
          </div>
          <div className="item">
            <GroupOutlined/>
            <span>Groups</span>
          </div>
          <div className="item">
            <ShopOutlined/>
            <span>Marketplace</span>
          </div>
          <div className="item">
            <MovieOutlined/>
            <span>Watch</span>
          </div>
          <div className="item">
            <AutoAwesomeOutlined/>
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <EmojiEventsOutlined/>
            <span>Events</span>
          </div>
          <div className="item">
            <GamepadOutlined/>
            <span>Gaming</span>
          </div>
          <div className="item">
            <BrowseGalleryOutlined/>
            <span>Gallery</span>
          </div>
          <div className="item">
            <VideoCallOutlined/>
            <span>Videos</span>
          </div>
          <div className="item">
            <MessageOutlined/>
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <SavingsOutlined/>
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <PersonOutline/>
            <span>Tutorials</span>
          </div>
          <div className="item">
            <Logout />
            <span onClick={handleLogout}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
