const Scheme = require('../models/Scheme');
const { answerCitizenQuery } = require('../services/aiService');

exports.chatWithAssistant = async (req, res) => {
  try {
    const { message, profile } = req.body;
    const userProfile = profile || req.user?.profile || {};

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Retrieve active schemes from database for grounded RAG context
    const schemes = await Scheme.find({ isActive: true });

    // Generate grounded response from Gemini model
    const aiReply = await answerCitizenQuery(message, userProfile, schemes);

    res.json({
      success: true,
      data: {
        reply: aiReply,
        groundedSchemesCount: schemes.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};