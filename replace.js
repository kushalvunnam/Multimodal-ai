const fs = require('fs');
const file = 'backend/controllers/analysisController.js';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `          const images = analysis.inputs.filter(i => i.type === 'image');
            const imageFindings = [];
            for (const [index, image] of images.entries()) {
              const fileData = await uploadService.getFile(image.storageReference);
              const finding = await aiService.processInput('image', fileData.buffer, fileData.mimeType);
              imageFindings.push({
                ...finding,
                source: image.originalName || image.fileName || image.name || \`Image ${index + 1}\`
              });
            }
            results.imageAnalysis = imageFindings.length === 1 ? imageFindings[0] : imageFindings;`;

const newLogic = `          const images = analysis.inputs.filter(i => i.type === 'image');
            const imageFindings = [];
            let allDamage = [];
            
            for (const [index, image] of images.entries()) {
              try {
                const fileData = await uploadService.getFile(image.storageReference);
                const finding = await aiService.processInput('image', fileData.buffer, fileData.mimeType);
                
                if (finding && !finding.error) {
                  const currentDamage = Array.isArray(finding.damage) ? finding.damage : [];
                  allDamage = [...allDamage, ...currentDamage];
                  
                  imageFindings.push({
                    imageId: image.id,
                    filename: image.originalName || image.fileName || image.name || \`Image ${index + 1}\`,
                    status: "completed",
                    damage: currentDamage,
                    vehicle: finding.vehicle,
                    imageQuality: finding.imageQuality,
                    confidence: finding.confidence
                  });
                } else {
                  imageFindings.push({
                    imageId: image.id,
                    filename: image.originalName || image.fileName || image.name || \`Image ${index + 1}\`,
                    status: "failed",
                    error: finding?.details || "Failed to process image",
                    damage: []
                  });
                }
              } catch (err) {
                imageFindings.push({
                  imageId: image.id,
                  filename: image.originalName || image.fileName || image.name || \`Image ${index + 1}\`,
                  status: "failed",
                  error: err.message,
                  damage: []
                });
              }
            }
            
            results.imageAnalysis = {
              images: imageFindings,
              damage: allDamage,
              vehicle: imageFindings.find(img => img.vehicle)?.vehicle || null,
              confidence: Math.max(...imageFindings.map(img => img.confidence || 0), 0)
            };`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content);
