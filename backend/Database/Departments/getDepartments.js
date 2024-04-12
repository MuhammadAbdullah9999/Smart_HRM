const { ObjectId } = require('mongodb');
const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function getDepartments(organizationId) {
    console.log(organizationId)
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('Organizations');
        
        const organization = await collection.findOne({ _id: new ObjectId(organizationId) });

        if (!organization) {
            console.log('No organization found with the given ID');
            return []; // Returns an empty array if no organization is found
        }

        if (organization.departments && organization.departments.length > 0) {
            console.log('Departments retrieved successfully:', organization.departments);
            return organization.departments;
        } else {
            console.log('No departments found for this organization');
            return []; // Returns an empty array if there are no departments
        }
    } catch (error) {
        console.error('Error retrieving departments:', error);
        return []; // Returns an empty array in case of any error
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = { getDepartments };
