const { connectToMongoDB,closeMongoDBConnection } = require('../connectDB');
const {ObjectId}=require('mongodb');

async function addAllowances(employeeId, allowanceType, allowanceAmount) {
    console.log(employeeId)
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('Employees');

        // Find employee by ID
        const employee = await collection.findOne({ _id: new ObjectId(employeeId) });

        // If employee exists, find allowance type
        if (employee) {
            const allowances = employee.Allowances || [];
            const existingAllowanceIndex = allowances.findIndex(allowance => allowance.type === allowanceType);

            // If allowance type exists, update its amount
            if (existingAllowanceIndex !== -1) {
                allowances[existingAllowanceIndex].amount = allowanceAmount;
            } else {
                // If allowance type does not exist, add new entry
                allowances.push({ type: allowanceType, amount: allowanceAmount });
            }

            await collection.updateOne({ _id: new ObjectId(employee._id) }, { $set: { Allowances: allowances } });

            console.log('Allowance added/updated successfully!');
        } else {
            console.log('Employee not found!');
        }
    } catch (error) {
        console.error('Error adding/updating allowance:', error);
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = {
    addAllowances
};