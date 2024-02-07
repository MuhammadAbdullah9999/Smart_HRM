const argon2 = require("argon2");

const authenticateUser = async (email, password) => {
  try {
    const db = await connectToMongoDB();

    // Check if the email exists in the Organizations collection
    const orgCollection = db.collection("Organizations");
    const orgUser = await orgCollection.findOne({ email: email });

    if (orgUser && (await argon2.verify(orgUser.password, password))) {
      const hrData = await getUserData("HR", orgUser._id.toString());
      return { userType: "business_owner", user: orgUser, hrData: hrData };
    }

    // Check if the email exists in the HRs collection
    const hrCollection = db.collection("HR");
    const hrUser = await hrCollection.findOne({ email: email });

    if (hrUser && (await argon2.verify(hrUser.password, password))) {
      return ({
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
      } = await getHrAndEmployee(hrUser.email, hrUser.organizationId));
    }

    // Check if the email exists in the Employees collection
    const empCollection = db.collection("Employees");
    const empUser = await empCollection.findOne({ email: email });

    if (empUser && (await argon2.verify(empUser.password, password))) {
      return { userType: "employee", user: empUser };
    }

    // Password does not match
    return { userType: "error", user: null, error: "Password does not match." };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      userType: "error",
      user: null,
      error: "An error occurred while authenticating user.",
    };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = { authenticateUser };
