const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { sendEmail } = require('./SendMail/sendMail');
const { getOrganizationName } = require('../GetOrganizationData/GetOrganizationName');

async function calculatePayroll(organizationId, year, month) {
    const organizationName = await getOrganizationName(organizationId);

    try {
        const db = await connectToMongoDB();
        const employeesCollection = db.collection('Employees');
        const payrollCollection = db.collection('payroll');

        // Check if organization has no employees
        const employeeCount = await employeesCollection.countDocuments({ organizationId });
        if (employeeCount === 0) {
            return { data: null, message: `No employees to calculate payroll for ${year}-${month}`, error: null };
        }

        // Check if payroll is already calculated for all employees in the given month and year
        const existingPayroll = await payrollCollection.findOne({ organizationId, year, month });
        if (existingPayroll) {
            return { data: existingPayroll, message: `Payroll already calculated for ${year}-${month}`, error: null };
        }

        const employees = await employeesCollection.find({ organizationId }).toArray();

        const payrollPromises = employees.map(async (employee) => {
            const { _id, name, email, salary, bonuses, Allowances, deductions } = employee;

            // Convert salary to integer
            const parsedSalary = parseInt(salary);

            // Check if bonuses array exists and has items
            const bonus = bonuses && bonuses.length > 0
                ? bonuses.find((bonus) => bonus.year === year && bonus.month === month)
                : undefined;

            // Check if Allowances array exists
            const totalAllowances = Allowances && Allowances.length > 0
                ? Allowances.reduce((total, allowance) => total + parseInt(allowance.amount), 0)
                : 0;

            // Check if deductions array exists
            const totalDeductions = deductions && deductions.length > 0
                ? deductions.reduce((total, deduction) => total + parseInt(deduction.deductionAmount), 0)
                : 0;

            // Convert bonus amount to integer
            const bonusAmount = bonus ? parseInt(bonus.bonusAmount) : 0;

            // Calculate total pay after converting all values to integers
            const totalPay = parsedSalary + bonusAmount + totalAllowances - totalDeductions;

            // Extract types of allowances
            const allowanceTypes = Allowances && Allowances.length > 0
                ? Allowances.map((allowance) => allowance.type)
                : [];

            // Extract types of deductions
            const deductionTypes = deductions && deductions.length > 0
                ? deductions.map((deduction) => deduction.deductionType)
                : [];

            // Extract types of bonuses
            const bonusTypes = bonuses && bonuses.length > 0
                ? bonuses.map((bonus) => bonus.bonusType)
                : [];

            const payrollEntry = {
                organizationId,
                organizationName, // Store organization name in payroll
                employeeId: _id,
                employeeName: name,
                email,
                salary: parsedSalary,
                month,
                year,
                totalPay,
                bonus: bonusAmount,
                allowances: {
                    total: totalAllowances,
                    types: allowanceTypes,
                },
                deductions: {
                    total: totalDeductions,
                    types: deductionTypes,
                },
                bonuses: {
                    types: bonusTypes,
                },
            };

            // Use the email service component
            // await sendEmail("hafizzabdullah999@gmail.com", `Payroll ${month} ${year}`, payrollEntry);

            return payrollEntry;
        });

        // Wait for all emails to be sent and all entries to be calculated before proceeding
        const payroll = await Promise.all(payrollPromises);

        // Store the entire payrollEntry in the database
        await payrollCollection.insertMany(payroll);

        const message = `Payroll calculation and email sending completed for ${year}-${month}`;

        // console.log(message);

        // Send sample email with data for the first employee
        if (payroll.length > 0) {
            await sendEmail("hafizzabdullah999@gmail.com", `Payroll ${month} ${year}`, payroll[0]);
        }

        return { data: payroll, message, error: null };
    } catch (error) {
        return { error: `Error in payroll calculation: ${error.message}`, data: null };
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = {
    calculatePayroll,
};
