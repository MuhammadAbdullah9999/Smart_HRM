const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { sendEmail } = require('./SendMail/sendMail');
const { getOrganizationName } = require('../GetOrganizationData/GetOrganizationName');

async function calculatePayroll(organizationId, year, month, userType) {
    console.log(month, year);
    const organizationName = await getOrganizationName(organizationId);

    try {
        const db = await connectToMongoDB();
        let employeesCollection;

        // Choose collection based on userType
        if (userType === "business_owner") {
            employeesCollection = db.collection('HR');
        } else {
            employeesCollection = db.collection('Employees');
        }

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
            const { _id, name, email, salary, bonuses, Allowances, deductions, attendance } = employee;

            // Convert salary to integer and handle null values
            const parsedSalary = parseInt(salary) || 0;

            // Convert month name to its corresponding numerical value
            const monthNumber = new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1;

            const monthlyAttendance = attendance ? attendance.filter(a => {
                if (a.date) {
                    const [attendanceYear, attendanceMonth] = a.date.split('-');
                    return parseInt(attendanceMonth) === monthNumber && parseInt(attendanceYear) === year;
                } else {
                    return false;
                }
            }) : [];

            console.log("attendance is ", monthlyAttendance);

            // Calculate total work hours or attendance metrics as needed
            const totalWorkHours = monthlyAttendance.length > 0 ? calculateTotalWorkHours(monthlyAttendance) : 0;

            // Check if bonuses array exists and has items
            const bonus = bonuses && bonuses.length > 0
                ? bonuses.find(bonus => bonus.year === year && bonus.month === month)
                : undefined;

            // Check if Allowances array exists
            const totalAllowances = Allowances && Allowances.length > 0
                ? Allowances.reduce((total, allowance) => {
                    const amount = parseInt(allowance.amount) || 0;
                    console.log(`Allowance type: ${allowance.type}, amount: ${amount}`);
                    return total + amount;
                }, 0)
                : 0;

            // Check if deductions array exists
            const totalDeductions = deductions && deductions.length > 0
                ? deductions.reduce((total, deduction) => total + parseInt(deduction.deductionAmount) || 0, 0)
                : 0;

            // Convert bonus amount to integer and handle null values
            const bonusAmount = bonus ? parseInt(bonus.bonusAmount) || 0 : 0;

            // Calculate total pay after converting all values to integers
            const totalPay = parsedSalary + bonusAmount + totalAllowances - totalDeductions;

            // Extract types and amounts of allowances
            const allowanceDetails = Allowances && Allowances.length > 0
                ? Allowances.map(allowance => ({ type: allowance.type, amount: parseInt(allowance.amount) || 0 }))
                : [];

            // Extract types of deductions
            const deductionTypes = deductions && deductions.length > 0
                ? deductions.map(deduction => deduction.deductionType)
                : [];

            // Extract types of bonuses
            const bonusTypes = bonuses && bonuses.length > 0
                ? bonuses.map(bonus => bonus.bonusType)
                : [];

            const payrollEntry = {
                organizationId,
                organizationName, // Store organization name in payroll
                employeeId: _id,
                employeeName: name,
                email,
                employeeType: userType === 'business_owner' ? 'HR' : 'Employee',
                salary: parsedSalary,
                month,
                year,
                totalPay,
                bonus: bonusAmount,
                allowances: {
                    total: totalAllowances,
                    details: allowanceDetails, // Include allowance details
                },
                deductions: {
                    total: totalDeductions,
                    types: deductionTypes,
                },
                bonuses: {
                    types: bonusTypes,
                },
                attendance: monthlyAttendance, // Include attendance data
            };

            return payrollEntry;
        });

        // Wait for all emails to be sent and all entries to be calculated before proceeding
        const payroll = await Promise.all(payrollPromises);

        // Store the entire payrollEntry in the database
        await payrollCollection.insertMany(payroll);

        const message = `Payroll calculation and email sending completed for ${year}-${month}`;

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

// Example function to calculate total work hours from attendance data
function calculateTotalWorkHours(attendance) {
    return attendance.reduce((total, day) => {
        const checkIn = new Date(`1970-01-01T${day.checkInTime}:00Z`);
        const checkOut = new Date(`1970-01-01T${day.checkOutTime}:00Z`);
        const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60);
        return total + (day.attendanceStatus === 'present' ? hoursWorked : 0);
    }, 0);
}

module.exports = {
    calculatePayroll,
};
