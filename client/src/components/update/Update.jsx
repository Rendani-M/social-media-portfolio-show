import React, { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import app from "../../firebase";
import { Button, CircularProgress } from "@mui/material";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    let coverUrl = user.coverpic;
    if (cover) {
      try {
        coverUrl = await uploadFile(cover);
      } catch (error) {
        console.error("Error uploading cover image:", error);
      }
    }

    let profileUrl = user.profilepic;
    if (profile) {
      try {
        
        setUploading(true);
        profileUrl = await uploadFile(profile);
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
    
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    
    setUploading(false);
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  return (
    <div className="update">
      <div className="wrapper">
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : user.coverpic}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : user?.profilepic}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            value={texts.username}
            name="username"
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <Button
            onClick={handleClick}
            variant="contained"
            disabled={mutation.isLoading || uploading}
            startIcon={(mutation.isLoading || uploading) && <CircularProgress size={20} />}
          >
            {uploading ? "Updating..." : "Update"}
          </Button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
