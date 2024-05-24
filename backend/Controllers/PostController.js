import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      massage: "Article could not receive",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      massage: "Article could not receive",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const getOnePost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { returnDocument: "after" }
    );

    if (!getOnePost) {
      console.error(`Post with ID ${postId} not found`);
      return res.status(404).json({
        message: "Post could not be found",
      });
    }

    res.json(getOnePost);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      massage: "Article could not receive",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const removedPost = await PostModel.findOneAndDelete({ _id: postId });

    if (!removedPost) {
      console.error(`Post with ID ${postId} not found`);
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in remove:", error);

    res.status(500).json({
      message: "Error while processing the request",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Couldn't update post",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      massage: "Article could not found",
    });
  }
};
