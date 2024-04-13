const { ObjectId } = require('mongodb');
const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function deleteDepartment(organizationId, departmentName) {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('Organizations');

        // Find the organization by its ObjectId
        const organization = await collection.findOne({ _id: new ObjectId(organizationId) });

        if (organization) {
            // If organization has departments array
            if (organization.departments && organization.departments.length > 0) {
                // Filter out the department to be deleted
                const updatedDepartments = organization.departments.filter(
                    (dept) => dept !== departmentName
                );

                // Update the existing document with modified departments array
                await collection.updateOne(
                    { _id: new ObjectId(organizationId) },
                    { $set: { departments: updatedDepartments } }
                );

                console.log(`Department '${departmentName}' deleted successfully!`);
            } else {
                console.log('No departments found in the organization.');
            }
        } else {
            console.log(`Organization with ID '${organizationId}' not found.`);
        }
    } catch (error) {
        console.error('Error deleting department:', error);
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = { deleteDepartment };
