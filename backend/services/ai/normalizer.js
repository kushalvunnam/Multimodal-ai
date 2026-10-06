const extractJson = (text) => {
  if (typeof text !== 'string') return text;
  let parsed = null;
  try {
    parsed = JSON.parse(text);
    return parsed;
  } catch (e) {}

  // Remove markdown fences
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {}
  }
  
  // Find first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch (err) {}
  }
  
  throw new Error('MALFORMED_JSON');
};

const normalizeConfidence = (val) => {
  if (typeof val === 'number') {
    return val <= 1.0 ? Math.round(val * 100) : val;
  }
  if (typeof val === 'string') {
    const num = parseFloat(val);
    if (!isNaN(num)) return num <= 1.0 ? Math.round(num * 100) : num;
  }
  return null;
};

const normalizeResponse = (rawResponse, type) => {
  try {
    const data = extractJson(rawResponse);
    
    if (type === 'image') {
      const damages = data.damage || data.damages || data.findings || data.detected_damage || [];
      
      const normalizedDamages = Array.isArray(damages) ? damages.map(d => ({
        area: d.area || d.location || 'Unknown area',
        severity: d.severity || 'Medium',
        description: d.description || d.details || 'No description provided',
        confidence: normalizeConfidence(d.confidence)
      })) : [];

      return {
        vehicle: data.vehicle || { type: null, make: null, model: null },
        damage: normalizedDamages,
        imageQuality: data.imageQuality || 'unknown',
        confidence: normalizeConfidence(data.confidence)
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
        confidence: normalizeConfidence(data.confidence)
      };
    }
    
    if (type === 'audio') {
      return {
        transcript: data.transcript || null,
        language: data.language || null,
        importantStatements: Array.isArray(data.importantStatements) ? data.importantStatements : [],
        entities: Array.isArray(data.entities) ? data.entities : [],
        confidence: normalizeConfidence(data.confidence)
      };
    }
    
    if (type === 'text') {
      return {
        incidentDescription: data.incidentDescription || null,
        entities: Array.isArray(data.entities) ? data.entities : [],
        dates: Array.isArray(data.dates) ? data.dates : [],
        locations: Array.isArray(data.locations) ? data.locations : [],
        confidence: normalizeConfidence(data.confidence)
      };
    }
    
    return data;
  } catch (error) {
    return {
      error: 'PARSING_FAILED',
      raw: rawResponse,
      details: error.message
    };
  }
};

module.exports = { normalizeResponse, extractJson, normalizeConfidence };

