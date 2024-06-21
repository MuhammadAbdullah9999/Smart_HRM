const { MongoClient } = require('mongodb');
require('dotenv').config();

let client; // Declare the client variable at the module level

async function connectToMongoDB() {
    try {
        const uri = process.env.DB_URI;
        const dbName = process.env.DB_NAME;

        // Configure MongoClient options with serverSelectionTimeoutMS
        const options = {
            serverSelectionTimeoutMS: 50000, // Example: 5000 milliseconds (5 seconds)
        };

        client = new MongoClient(uri, options); // Pass options to MongoClient constructor

        await client.connect();

        const db = client.db(dbName);

        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

async function closeMongoDBConnection() {
    try {
        if (client) {
            await client.close();
        } else {
            console.log('No MongoDB connection to close');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

module.exports = { connectToMongoDB, closeMongoDBConnection };

// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// let client; // Declare the client variable at the module level

// async function connectToMongoDB() {
//     try {
//         const uri = process.env.LOCAL_DB_URI;
//         const dbName = process.env.DB_NAME;

//         // Configure MongoClient options with serverSelectionTimeoutMS
//         const options = {
//             serverSelectionTimeoutMS: 5000, // Example: 5000 milliseconds (5 seconds)
//         };

//         client = new MongoClient(uri, options); // Pass options to MongoClient constructor

//         await client.connect();

//         const db = client.db(dbName);

//         console.log('Successfully connected to MongoDB');

//         return db;
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     }
// }

// async function closeMongoDBConnection() {
//     try {
//         if (client) {
//             await client.close();
//             console.log('MongoDB connection closed');
//         } else {
//             console.log('No MongoDB connection to close');
//         }
//     } catch (error) {
//         console.error('Error closing MongoDB connection:', error);
//     }
// }

// module.exports = { connectToMongoDB, closeMongoDBConnection };
