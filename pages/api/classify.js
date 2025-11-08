export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const spamKeywords = [
      'win', 'free', 'prize', 'congratulations', 'selected', 'winner',
      'claim', 'cash', 'urgent', 'click', 'offer', 'limited', 'bonus',
      'gift card', 'lottery', 'million', 'dollars', '$1000', 'won'
    ];

    const lowerMessage = message.toLowerCase();
    
    let spamScore = 0;
    spamKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        spamScore += 1;
      }
    });

    const capitalRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capitalRatio > 0.6) {
      spamScore += 2;
    }

    const urgencyWords = ['urgent', 'immediately', 'now', 'limited time', 'act now'];
    urgencyWords.forEach(word => {
      if (lowerMessage.includes(word)) {
        spamScore += 1;
      }
    });

    const isSpam = spamScore >= 2;
    const confidence = Math.min(0.3 + (spamScore * 0.15), 0.95);

    res.status(200).json({
      prediction: isSpam ? 'SPAM' : 'HAM',
      confidence: Math.round(confidence * 100) / 100,
      is_spam: isSpam,
      spam_score: spamScore,
      message: `Found ${spamScore} spam indicators`
    });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}