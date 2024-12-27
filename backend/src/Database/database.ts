import { Sequelize, DataTypes, HostNotReachableError } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Esto permite conexiones con certificados no verificados (necesario para Heroku).
            },
        } : {},
    })
    : new Sequelize(
        process.env.PGDATABASE || '',
        process.env.PGUSER || '',
        process.env.PGPASSWORD || '',
        {
            host: process.env.PGHOST || 'localhost',
            dialect: 'postgres',
            port: parseInt(process.env.PGPORT || '5433', 10),
            dialectOptions: process.env.NODE_ENV === 'production' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            } : {},
        }
    );

//Models
export const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export const Board = sequelize.define('Board', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

export const Column = sequelize.define('Column', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    board_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Board,
            key: 'id',
        },
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export const Card = sequelize.define('Card', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    column_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Column,
            key: 'id',
        },
    },
    assignee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

export const BoardMember = sequelize.define('BoardMember', {
    board_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Board,
            key: 'id',
        },
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    role: {
        type: DataTypes.ENUM('Owner', 'Editor', 'Viewer'),
        allowNull: false,
    },
});

User.hasMany(Board, { foreignKey: 'owner_id' });
Board.belongsTo(User, { foreignKey: 'owner_id' });

Board.hasMany(Column, { foreignKey: 'board_id' });
Column.belongsTo(Board, { foreignKey: 'board_id' });

Column.hasMany(Card, { foreignKey: 'column_id' });
Card.belongsTo(Column, { foreignKey: 'column_id' });

User.hasMany(Card, { foreignKey: 'assignee_id' });
Card.belongsTo(User, { foreignKey: 'assignee_id' });

Board.belongsToMany(User, { through: BoardMember, foreignKey: 'board_id' });
User.belongsToMany(Board, { through: BoardMember, foreignKey: 'user_id' });
