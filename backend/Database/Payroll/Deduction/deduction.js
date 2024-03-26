const { connectToMongoDB, closeMongoDBConnection } = require('../../connectDB');
const { ObjectId } = require('mongodb');

async function addDeductionToEmployee(employeeId, month, year, deductionReason, deductionAmount) {
    try {
        // Connect to MongoDB Atlas
        const db = await connectToMongoDB();

        // Get the employee collection
        const employeeCollection = db.collection('Employees');

        // Find the employee document based on employeeId
        const employee = await employeeCollection.findOne({ _id: new ObjectId(employeeId) });

        // If employee document exists, add the deduction
        if (employee) {
            // Check if the employee document has a 'deductions' array, and create it if not
            const deductionsArray = employee.deductions || [];

            // Check if the deduction reason for the given month and year already exists
            const existingDeductionIndex = deductionsArray.findIndex(
                (deduction) => deduction.month === month && deduction.year === year
            );

            if (existingDeductionIndex !== -1) {
                // If the deduction reason already exists for the given month and year, update its deduction amount
                deductionsArray[existingDeductionIndex].deductionAmount = deductionAmount;
            } else {
                // If the deduction reason does not exist for the given month and year, append the new deduction to the 'deductions' array
                deductionsArray.push({
                    month: month,
                    year: year,
                    deductionReason: deductionReason,
                    deductionAmount: deductionAmount
                });
            }

            // Update the employee document with the modified 'deductions' array
            await employeeCollection.updateOne(
                { _id: new ObjectId(employeeId) },
                { $set: { deductions: deductionsArray } }
            );

            console.log('Deduction added successfully.');
            return { error: null };

        } else {
            console.log('Employee not found.');
        }
    } catch (error) {
        console.error('Error adding deduction to MongoDB Atlas:', error);
        return { error: error };
    } finally {
        // Close the MongoDB connection
        await closeMongoDBConnection();
    }
}

module.exports = {
    addDeductionToEmployee
};
