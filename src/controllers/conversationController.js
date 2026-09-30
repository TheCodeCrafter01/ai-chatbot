const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.createConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.create({
    user: req.user._id,
    title: req.body.title,
  });

  res.status(201).json({ success: true, conversation });
});

exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });

  res.status(200).json({ success: true, count: conversations.length, conversations });
});

exports.getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  const messages = await Message.find({ conversation: conversation._id }).sort({
    createdAt: 1,
  });

  res.status(200).json({ success: true, conversation, messages });
});

exports.updateConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title: req.body.title },
    { new: true, runValidators: true }
  );

  if (!conversation) throw new AppError("Conversation not found", 404);

  res.status(200).json({ success: true, conversation });
});

exports.deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) throw new AppError("Conversation not found", 404);

  // delete its messages too, otherwise they'd be orphaned
  await Message.deleteMany({ conversation: conversation._id });

  res.status(200).json({ success: true, message: "Conversation deleted" });
});