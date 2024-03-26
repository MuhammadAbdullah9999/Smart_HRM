const express = require('express');
const {addAnnouncement,getAnnouncements,deleteAnnouncement}=require('../../Database/Announcements/Announcements')
const router = express.Router();

// POST /announcements
router.post('/AddAnnouncement', async (req, res) => {
    try {
        const {organizationId,title,date} = req.body; // Assuming the announcement data is sent in the request body
        const {message,error} = await addAnnouncement(organizationId,title,date);
        if(message){
            const announcement=await getAnnouncements(organizationId);
            res.status(200).json({message,announcement})
        }
        else if(error){
            res.status(500).json(error)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the announcement.' });
    }
});
router.get('/GetAnnouncements/:organizationId', async (req, res) => {
   
    try {
        const { organizationId } = req.params; // Assuming the organization ID is passed as a parameter
        const announcement=await getAnnouncements(organizationId);
        if (announcement) {
            res.status(200).json({announcement });
        } else if (error) {
            res.status(500).json({message:'An error occurred while getting announcements.'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while getting announcements.' });
    }
});

router.delete('/DeleteAnnouncement/:announcementId/:organizationId', async (req, res) => {
    try {
        const { announcementId,organizationId } = req.params; // Assuming the announcement ID is passed as a parameter
       console.log(announcementId, organizationId);
        const result = await deleteAnnouncement(announcementId,organizationId);
        console.log(result)
        if (result) {
            const announcement=await getAnnouncements(organizationId);
            res.status(200).json({ message: 'Announcement deleted successfully.',announcement });
        } else {
            res.status(404).json({ message: 'Announcement not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the announcement.' });
    }
});
module.exports = router;