const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require('dotenv').config();

const uri = process.env.DB_URI;
const dbName = 'Smart_HRM';

const authenticateUser = async (email, password) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);

        // Check if the email exists in the Organizations collection
        const orgCollection = db.collection("Organizations");
        const orgUser = await orgCollection.findOne({ "email": email });

        if (orgUser && await bcrypt.compare(password, orgUser.password)) {
            return { userType: "business_owner", user: orgUser };
        }

        // Check if the email exists in the HRs collection
        const hrCollection = db.collection("HR");
        const hrUser = await hrCollection.findOne({ "email": email });

        if (hrUser && await bcrypt.compare(password, hrUser.password)) {
            return { userType: "hr", user: hrUser };
        }

        // Check if the email exists in the Employees collection
        const empCollection = db.collection("Employees");
        const empUser = await empCollection.findOne({ "email": email });

        if (empUser && await bcrypt.compare(password, empUser.password)) {
            return { userType: "employee", user: empUser };
        }

        // Password does not match
        return { userType: "error", user: null, error: "Password does not match." };
    } catch (error) {
        console.error("Error authenticating user:", error);
        return { userType: "error", user: null, error: "An error occurred while authenticating user." };
    } finally {
        await client.close();
    }
};

module.exports = { authenticateUser };
