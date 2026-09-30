const express = require("express");
const {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createConversationSchema,
  updateConversationSchema,
} = require("../validators/conversationSchemas");

const router = express.Router();

router.use(protect); // sabhi routes ke liye login zaroori

router
  .route("/")
  .post(validate(createConversationSchema), createConversation)
  .get(getConversations);

router
  .route("/:id")
  .get(getConversation)
  .patch(validate(updateConversationSchema), updateConversation)
  .delete(deleteConversation);

module.exports = router;