const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function generateReport(organizationId, year, month) {
    try {
        const db = await connectToMongoDB();
        const Collection = db.collection('payroll');

        // Query to find payroll data based on organizationId, year, and month
        const reportData = await Collection.find({ organizationId, year, month }).toArray();

        if (!reportData) {
            return { data: null, message: `No payroll data found for ${year}-${month}`, error: null };
        }

        return { data: reportData, message: `Payroll data retrieved successfully for ${year}-${month}`, error: null };
    } catch (error) {
        return { error: `Error retrieving payroll data: ${error.message}`, data: null };
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = {
    generateReport,
};
