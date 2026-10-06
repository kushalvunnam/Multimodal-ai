const extractJson = (text) => {
  try {
    // If it's already a clean JSON string, parse it
    return JSON.parse(text);
  } catch (e) {
    // Attempt to extract JSON from Markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {}
    }
    // Attempt to find the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (err) {}
    }
    throw new Error('MALFORMED_JSON');
  }
};

const normalizeResponse = (rawResponse, type) => {
  try {
    const data = extractJson(rawResponse);
    
    // Ensure standard shape based on modality
    if (type === 'image') {
      return {
        vehicle: data.vehicle || { type: null, make: null, model: null },
        damage: Array.isArray(data.damage) ? data.damage : [],
        imageQuality: data.imageQuality || 'unknown',
        confidence: typeof data.confidence === 'number' ? data.confidence : null
      };
    }
    if (type === 'document') {
      return {
        claimNumber: data.claimNumber || null,
        incidentDate: data.incidentDate || null,
        vehicle: data.vehicle || {},
        damageDescription: data.damageDescription || null,
        entities: Array.isArray(data.entities) ? data.entities : [],
        potentialInconsistencies: Array.isArray(data.potentialInconsistencies) ? data.potentialInconsistencies : [],
        confidence: typeof data.confidence === 'number' ? data.confidence : null
      };
    }
    if (type === 'audio') {
      return {
        transcript: data.transcript || null,
        language: data.language || null,
        importantStatements: Array.isArray(data.importantStatements) ? data.importantStatements : [],
        entities: Array.isArray(data.entities) ? data.entities : [],
        confidence: typeof data.confidence === 'number' ? data.confidence : null
      };
    }
    if (type === 'text') {
      return {
        incidentDescription: data.incidentDescription || null,
        entities: Array.isArray(data.entities) ? data.entities : [],
        dates: Array.isArray(data.dates) ? data.dates : [],
        locations: Array.isArray(data.locations) ? data.locations : [],
        confidence: typeof data.confidence === 'number' ? data.confidence : null
      };
    }
    
    return data;
  } catch (error) {
    return {
      error: 'PARSING_FAILED',
      raw: rawResponse,
      confidence: null
    };
  }
};

module.exports = { normalizeResponse, extractJson };

