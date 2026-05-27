import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../utils/db.ts";
import type { User } from "./index.ts";
import type { CommentType } from "./Comment.ts";
import { uuidv7 } from "uuidv7";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<string>;
  declare description: string;
  declare title: string;
  declare userId: string;
  declare imageUrl: string;
  declare author?: NonAttribute<User>;
  declare likesCount?: NonAttribute<number>;
  declare comments?: NonAttribute<CommentType[]>;
}
Post.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      defaultValue: "",
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
      onUpdate: "CASCADE", 
      onDelete: "CASCADE", 
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "posts",
    timestamps: false,
    hooks: {
    beforeValidate: (post) => {
      if (!post.id) {
        post.id = uuidv7(); 
      }
    },
  },
  },
);

export type PostType = InferAttributes<Post>;
export type NewPostType = InferCreationAttributes<Post>;

export default Post;
