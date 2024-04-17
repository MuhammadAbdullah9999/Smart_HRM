const express = require('express');
const { addToDoList} = require('../../Database/ToDoList/addToDoList');

const {getToDoList} = require('../../Database/ToDoList/getToDoList');
const {deleteToDoList} = require('../../Database/ToDoList/deleteToDoList');

const router = express.Router();

router.post('/addToDoList', async (req, res) => {
    try {
        // Get the todo list item from the request body
        const { userType,email,task } = req.body;
        // console.log(userType,email,task);

        await addToDoList(userType,email,task);
        const toDoList=await getToDoList(userType,email);
        // console.log(toDoList);

        // Send a success response
        res.status(200).json({ message: 'Todo list item added successfully', toDoList});
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the todo list item' });
    }
});
router.get('/getToDoList/:userType/:email', async (req, res) => {
    try {
        // Extract userType and email from query parameters
        const { userType, email } = req.params;
        console.log(userType,email)

        // Call the database function to get the to-do list for the specified user
        const toDoList = await getToDoList(userType, email);

        // Send a success response with the retrieved to-do list
        res.status(200).json({ message: 'Todo list retrieved successfully', toDoList });
    } catch (error) {
        // Handle any errors that occur during the retrieval process
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the todo list' });
    }
});
router.post('/deleteToDoList', async (req, res) => {
    try {
        // Get the todo list item from the request body
        const { userType,email,task } = req.body;
        // console.log(userType,email,task);

        await deleteToDoList(userType,email,task);
        const toDoList=await getToDoList(userType,email);
        // console.log(toDoList);

        // Send a success response
        res.status(200).json({ message: 'Todo list item added successfully', toDoList});
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the todo list item' });
    }
});


// router.post('/getToDoList', async (req, res) => {
//     try {
//         const { userType,email} = req.body;

//         const toDoList=await getToDoList(userType,email);
//         console.log(toDoList);

//         // Send a success response
//         res.status(200).json({ message: 'Todo list item added successfully',toDoList });
//     } catch (error) {
//         // Handle any errors
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while adding the todo list item' });
//     }
// });

module.exports = router;