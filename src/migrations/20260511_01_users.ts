import { QueryInterface, DataTypes } from "sequelize";

export interface MigrationContext {
  context: QueryInterface;
}

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    },
  });
};
export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable("users");
};
