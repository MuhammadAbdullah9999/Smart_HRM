const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { ObjectId } = require("mongodb");
const { generateHash } = require('../utilities/generatePasswordHash');

const updateUser = async (userType, userId, email, contact, password) => {
    console.log('update called');
    console.log(userType, userId, email, contact, password)
    try {
        const db = await connectToMongoDB();
        let doc = '';
        if (userType === 'HR') {
            doc = 'HR';
        } else {
            doc = 'Employees';
        }
        const collection = db.collection(doc);

        // Check if the employee document exists
        const employee = await collection.findOne({
            _id: new ObjectId(userId),
        });

        if (employee) {
            // Check if the password is not null
            if (password !== null) {
                // Generate hash for the new password
                const hashedPassword = await generateHash(password);

                // Update the employee document with the new email, contact, and hashed password
                await collection.updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            email: email,
                            contact: contact,
                            password: hashedPassword,
                        },
                    }
                );
            } else {
                // Update the employee document with the new email and contact only
                await collection.updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            email: email,
                            contact: contact,
                        },
                    }
                );
            }

            console.log(`Updated details for employee with ID: ${userId}`);
            return { error: null };
        } else {
            console.log(`Employee with ID ${userId} not found.`);
            return { error: `Employee with ID ${userId} not found.` };
        }

    } catch (error) {
        console.error("Error updating employee details in MongoDB Atlas:", error);
        return { error: error };
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = {
    updateUser
};
