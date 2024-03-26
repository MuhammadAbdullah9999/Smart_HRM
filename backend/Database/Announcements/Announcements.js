const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { ObjectId } = require('mongodb');

// Function to add announcement
async function addAnnouncement(organizationId, title, date) {
    try {
        // Connect to MongoDB Atlas
        const db = await connectToMongoDB();

        // Generate a new ObjectId for the announcement
        const announcementId = new ObjectId();

        // Find the organization by organizationId
        const organization = await db.collection('Organizations').findOne({ _id: new ObjectId(organizationId) });

        if (!organization) {
            // If organization not found, create a new one
            await db.collection('Organizations').insertOne({ _id: new ObjectId(organizationId), announcements: [{ _id: announcementId, title, date }] });
            await closeMongoDBConnection();
            return { message: "Announcement added successfully!", error: null };
        } else {
            // If organization found, append the announcement to the existing array
            await db.collection('Organizations').updateOne({ _id: new ObjectId(organizationId) }, { $push: { announcements: { _id: announcementId, title, date } } });
            await closeMongoDBConnection();
            return { message: "Announcement added successfully!", error: null };
        }
    } catch (error) {
        console.error('Error adding announcement:', error);
        return { message: null, error: error };
    }
}

// Function to get announcements for a specific organization
async function getAnnouncements(organizationId) {
    try {
        // Connect to MongoDB Atlas
        const db = await connectToMongoDB();

        // Find the organization by organizationId
        const organization = await db.collection('Organizations').findOne({ _id: new ObjectId(organizationId) });

        if (!organization) {
            await closeMongoDBConnection();
            return { message: "Organization not found.", announcements: [] };
        } else {
            await closeMongoDBConnection();
            return { announcements: organization.announcements || [] };
        }
    } catch (error) {
        console.error('Error getting announcements:', error);
        return { message: "Error: Unable to get announcements.", error: error };
    }
}

// Function to delete an announcement for a specific organization
async function deleteAnnouncement(announcementId,organizationId) {
    try {
        // Connect to MongoDB Atlas
        const db = await connectToMongoDB();

        // Delete the announcement from the organization's array
        const result = await db.collection('Organizations').updateOne({ _id: new ObjectId(organizationId) }, { $pull: { announcements: { _id: new ObjectId(announcementId) } } });

        await closeMongoDBConnection();
console.log(result)
        if (result.modifiedCount > 0) {
            return { message: "Announcement deleted successfully!", error: null };
        } else {
            return { message: "Announcement not found.", error: null };
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return { message: "Error: Unable to delete announcement.", error: error };
    }
}

module.exports = {
    addAnnouncement,
    getAnnouncements,
    deleteAnnouncement
};
