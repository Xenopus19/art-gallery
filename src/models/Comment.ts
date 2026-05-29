import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../utils/db.js";

class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<string>;
  declare text: string;
  declare userId: string;
  declare postId: string;
  declare createdAt: CreationOptional<Date>;
}
Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "posts", 
        key: "id",
      },
      onUpdate: "CASCADE", 
      onDelete: "CASCADE", 
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
    createdAt: {
        type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: "comments",
    timestamps: true,
  },
);

export type CommentType = InferAttributes<Comment>;
export type NewCommentType = InferCreationAttributes<Comment>;

export default Comment;
