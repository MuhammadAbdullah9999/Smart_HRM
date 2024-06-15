const { connectToMongoDB, closeMongoDBConnection } = require('../connectDB');
const { ObjectId } = require('mongodb');

async function getAttendanceData(organizationId,userType) {
    console.log(organizationId);
    try {
        // Connect to the database
        const db = await connectToMongoDB();

        let col='';
        if(userType=='HR'){
            col="Employees"
        }
        else{
            col="HR"
        }
        // Access the Employees collection
        const employeesCollection = db.collection(col);

        // Find employees by organization ID
        const employees = await employeesCollection.find({ organizationId }).toArray();
        console.log(employees);

        // Extract attendance arrays from each employee
        const attendanceArrays = employees.map(employee => employee.attendance);

        // Return the extracted attendance arrays
        return { attendanceArrays, error: null };

    } catch (error) {
        return { attendanceArrays: null, error: error.message };
    } finally {
        await closeMongoDBConnection();
    }
}

async function getEmployeeAttendance(employeeId, userType) {
    try {
        const db = await connectToMongoDB();

        const col = userType === 'HR' ? 'HR' : 'Employees';

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
