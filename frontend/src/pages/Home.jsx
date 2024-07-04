import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  console.log(import.meta.env);
  console.log(import.meta.env.VITE_SOME_KEY);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label={`New`} />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => {
            return isPostsLoading ? (
              <Post isLoading={true} key={index} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${import.meta.env.VITE_REACT_APP_API_URL}${obj.imageUrl}` : ""}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj?.user?._id}
              />
            );
          })}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Isaiah Stevenson",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Aliquam auctor, velit eget laoreet posuere, enim nisl elementum purus",
              },
              {
                user: {
                  fullName: "May Bowman",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
