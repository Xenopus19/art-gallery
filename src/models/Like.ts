import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../utils/db.ts";

class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare postId: string;
}
Like.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
  },
  {
    sequelize,
    underscored: true,
    modelName: "likes",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id']
      }
    ]
  },
);

export type LikeType = InferAttributes<Like>;
export type NewLikeType = InferCreationAttributes<Like>;

export default Like;
