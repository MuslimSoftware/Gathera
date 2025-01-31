import express from 'express';
import {
    getAllConversationsForUser,
    createConversation,
    getConversationById,
    addUsersToConversation,
    leaveConversation,
    getMessages,
    sendMessage,
    updateConversation,
    hideAuthedUserFromConversation,
} from '@controllers/conversationController';

const router = express.Router();

router.get('/', getAllConversationsForUser);
router.get('/get/:conversation_id', getConversationById);
router.post('/create', createConversation);

router.patch('/update/:conversation_id', updateConversation);
router.post('/add-users/:conversation_id', addUsersToConversation);
router.post('/leave/:conversation_id', leaveConversation);
router.post('/send-message/:conversation_id', sendMessage);
router.get('/messages/:conversation_id', getMessages);
router.post('/hide/:conversation_id', hideAuthedUserFromConversation);

export default router;
