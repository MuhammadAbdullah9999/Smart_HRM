const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');

async function generateReport(organizationId, year, month, reportType) {
    console.log(organizationId,year, month, reportType)
    try {
        const db = await connectToMongoDB();
        let reportData;
        let message;

        switch (reportType) {
            case 'allowances':
                reportData = await db.collection('payroll').find(
                    { organizationId, year, month },
                    { projection: { allowances: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                console.log(reportData);
                message = `Allowances data retrieved successfully for ${year}-${month}`;
                break;
            case 'bonuses':
                reportData = await db.collection('payroll').find(
                    { organizationId, year, month },
                    { projection: { bonuses: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                console.log(reportData);
                message = `Bonuses data retrieved successfully for ${year}-${month}`;
                break;
            case 'deductions':
                reportData = await db.collection('payroll').find(
                    { organizationId, year, month },
                    { projection: { deductions: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = `Deductions data retrieved successfully for ${year}-${month}`;
                break;
            case 'attendance':
                reportData = await db.collection('payroll').find(
                    { organizationId, year, month },
                    { projection: { attendance: 1, employeeId: 1, employeeName: 1, email: 1 } }
                ).toArray();
                message = `Attendance data retrieved successfully for ${year}-${month}`;
                break;
            case 'past_employees':
                reportData = await db.collection('past_employees').find({ organizationId }).toArray();
                message = `Past employees data retrieved successfully`;
                break;
            case 'all':
                reportData = await db.collection('payroll').find({ organizationId }).toArray();
                message = `Payroll data retrieved successfully for all months`;
                break;
            default:
                reportData = await db.collection('payroll').find({ organizationId, year, month }).toArray();
                message = `Payroll data retrieved successfully for ${year}-${month}`;
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
