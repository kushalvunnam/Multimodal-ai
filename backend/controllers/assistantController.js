const aiService = require('../services/ai');

exports.ask = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const answer = await aiService.askAssistant(message, context);
    res.json({ success: true, data: { answer } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
