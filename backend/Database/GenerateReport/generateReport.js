const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function generateReport(organizationId, year, month, reportType) {
    console.log(organizationId, year, month, reportType);
    try {
        const db = await connectToMongoDB();
        let reportData;
        let message;

        // Determine the query based on whether month is "All Months"
        const query = { organizationId, year };
        if (month !== "All Months") {
            query.month = month;
        }

        switch (reportType) {
            case 'allowances':
                reportData = await db.collection('payroll').find(
                    query,
                    { projection: { allowances: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = month === "All Months" ?
                    `Allowances data retrieved successfully for all months of ${year}` :
                    `Allowances data retrieved successfully for ${year}-${month}`;
                break;
            case 'bonuses':
                reportData = await db.collection('payroll').find(
                    query,
                    { projection: { bonuses: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = month === "All Months" ?
                    `Bonuses data retrieved successfully for all months of ${year}` :
                    `Bonuses data retrieved successfully for ${year}-${month}`;
                break;
            case 'deductions':
                reportData = await db.collection('payroll').find(
                    query,
                    { projection: { deductions: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = month === "All Months" ?
                    `Deductions data retrieved successfully for all months of ${year}` :
                    `Deductions data retrieved successfully for ${year}-${month}`;
                break;
            case 'attendance':
                reportData = await db.collection('payroll').find(
                    query,
                    { projection: { attendance: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = month === "All Months" ?
                    `Attendance data retrieved successfully for all months of ${year}` :
                    `Attendance data retrieved successfully for ${year}-${month}`;
                break;
            case 'past_employees':
                reportData = await db.collection('PastEmployees').find({ organizationId }).toArray();
                message = `Past employees data retrieved successfully`;
                break;
            case 'all':
                reportData = await db.collection('payroll').find({ organizationId }).toArray();
                message = `Payroll data retrieved successfully for all months`;
                break;
            default:
                reportData = await db.collection('payroll').find(query).toArray();
                message = month === "All Months" ?
                    `Payroll data retrieved successfully for all months of ${year}` :
                    `Payroll data retrieved successfully for ${year}-${month}`;
                break;
        }

        if (!reportData.length) {
            return { data: null, message: `No ${reportType} data found for ${year}-${month}`, error: null };
        }

        return { data: reportData, message, error: null };
    } catch (error) {
        return { error: `Error retrieving ${reportType} data: ${error.message}`, data: null };
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = {
    generateReport,
};
