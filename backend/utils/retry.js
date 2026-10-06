const withRetry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI_TIMEOUT')), 30000); // 30s timeout per request
      });
      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      attempt++;
      const isRetryable = error.message.includes('429') || error.message.includes('503') || error.message.includes('AI_TIMEOUT') || error.message.includes('network');
      
      if (!isRetryable || attempt >= maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = { withRetry };
