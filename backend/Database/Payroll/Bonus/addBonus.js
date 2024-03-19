const { connectToMongoDB, closeMongoDBConnection } = require("../../connectDB");
const { ObjectId } = require("mongodb");

async function addBonus(
    employeeId,
    bonusReason,
    month,
    year,
    bonusAmount
  ) {

    try {
      const db = await connectToMongoDB();
      const collection = db.collection("Employees");
  
      // Check if the employee document exists
      const employee = await collection.findOne({
        _id: new ObjectId(employeeId),
      });
  
      if (employee) {
        // Check if the employee document has a 'bonuses' array, and create it if not
        const bonusesArray = employee.bonuses || [];
  
        // Check if the bonus reason for the given month and year already exists
        const existingBonusIndex = bonusesArray.findIndex(
          (bonus) =>bonus.month === month && bonus.year === year
        );
  
        if (existingBonusIndex !== -1) {
          // If the bonus reason already exists for the given month and year, update its bonus amount
          bonusesArray[existingBonusIndex].bonusAmount = bonusAmount;
        } else {
          // If the bonus reason does not exist for the given month and year, append the new bonus to the 'bonuses' array
          bonusesArray.push({
            bonusReason,
            month,
            year,
            bonusAmount,
          });
        }
  
        // Update the employee document with the modified 'bonuses' array
        await collection.updateOne(
          { _id: new ObjectId(employeeId) },
          { $set: { bonuses: bonusesArray } }
        );
  
        console.log(`Added bonus to employee with ID: ${employeeId}`);
        return { error: null };
      } else {
        console.log(`Employee with ID ${employeeId} not found.`);
      }
  
      await closeMongoDBConnection();
    } catch (error) {
      console.error("Error adding bonus to MongoDB Atlas:", error);
      return { error: error };
    }
  }
  
  module.exports = {
    addBonus,
  };
  