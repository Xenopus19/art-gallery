import Comment from "./Comment.ts";
import Like from "./Like.ts";
import Post from "./Post.ts";
import User from "./User.ts";

Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

export { User, Post, Like, Comment };