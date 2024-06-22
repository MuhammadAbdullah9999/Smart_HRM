const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { ObjectId } = require('mongodb');

async function getAttendanceData(organizationId, userType) {
    // console.log(organizationId);
    try {
        // Connect to the database
        const db = await connectToMongoDB();

        let col = '';
        if (userType === 'HR') {
            col = "Employees"
        } else {
            col = "HR"
        }
        // Access the Employees collection
        const employeesCollection = db.collection(col);

        // Find employees by organization ID
        const employees = await employeesCollection.find({ organizationId }).toArray();

        // Extract attendance arrays from each employee and filter out undefined entries
        const attendanceArrays = employees.map(employee => employee.attendance).filter(attendance => attendance !== undefined);

        // Return the extracted attendance arrays
        console.log(attendanceArrays);
        return { attendanceArrays, error: null };

    } catch (error) {
        console.log(error);
        return { attendanceArrays: null, error: error.message };
    } finally {
        await closeMongoDBConnection();
    }
}

async function getEmployeeAttendance(employeeId, attendanceType) {
    console.log(employeeId, attendanceType);
    try {
        const db = await connectToMongoDB();

        const col = attendanceType === 'HR' ? 'Employees' : attendanceType === 'hrAttendance' ? 'HR' : attendanceType === 'employee' ? 'Employees' : 'HR';
        console.log(col)

        const employeesCollection = db.collection(col);

        const employee = await employeesCollection.findOne({ _id: new ObjectId(employeeId) });

        if (!employee) {
            return { attendance: null, error: 'Employee not found' };
        }

        const attendance = employee.attendance;

        return { attendance, error: null };
    } catch (error) {
        return { attendance: null, error: error.message };
    } finally {
        await closeMongoDBConnection();
    }
}

module.exports = { getAttendanceData, getEmployeeAttendance };
