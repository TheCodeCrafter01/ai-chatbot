const { z } = require("zod");

const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
});

const updateConversationSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

module.exports = { createConversationSchema, updateConversationSchema };