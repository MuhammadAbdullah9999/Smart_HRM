const { ObjectId } = require('mongodb');
const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function addDepartments(organizationId, departments) {
    console.log(organizationId, departments);
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('Organizations');

        // Use 'let' for organization since it might be reassigned
        let organization = await collection.findOne({ _id: new ObjectId(organizationId) });

        if (organization) {
            // If the organization has an existing departments array, append to it
            if (organization.departments) {
                organization.departments.push(departments);
            } else {
                // Otherwise, initialize the departments array
                organization.departments = [departments];
            }
            // Update the existing document with modified organization data
            await collection.updateOne({ _id: new ObjectId(organizationId) }, { $set: { departments: organization.departments } });
        } else {
            // If the organization doesn't exist, create a new one with the departments
            organization = { organizationId, departments };
            await collection.insertOne(organization);
        }

        console.log('Departments added successfully!');
    } catch (error) {
        console.error('Error adding departments:', error);
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = { addDepartments };
