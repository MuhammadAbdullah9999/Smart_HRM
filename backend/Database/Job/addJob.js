const {connectToMongoDB,closeMongoDBConnection}=require('../connectDB');
const {ObjectId}=require('mongodb');

async function addJob(organizationId, jobTitle, jobDescription, location ,jobType,requirements,noOfPositions) {
   
    try {

        const db = await connectToMongoDB();
        const organizationsCollection = db.collection('Organizations');

        const organization = await organizationsCollection.findOne({ _id:new ObjectId(organizationId) });

        if (organization) {
            if (!organization.jobs) {
                organization.jobs = [];
            }

            organization.jobs.push({
                _id:new ObjectId(),
                organizationId,
                jobTitle,
                jobDescription,
                location,
                jobType,
                requirements,
                noOfPositions,
                status: 'Open'
            });

            await organizationsCollection.updateOne({ _id:new ObjectId(organizationId) }, { $set: organization });

            console.log('Job added successfully!');
            
        } else {
            console.log('Organization not found!');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await closeMongoDBConnection();
    }
}

// Usage example
module.exports={
    addJob
}