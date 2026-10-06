const fs = require('fs');
let workspace = fs.readFileSync('frontend/src/pages/AnalysisWorkspace.jsx', 'utf8');

const updatedLogic = `
  useEffect(() => {
    let intervalId;
    let mounted = true;
    let isProcessingStarted = false;

    const startProcessing = async () => {
      if (!id) return;
      try {
        // Fetch current analysis
        const { getAnalysis } = require('../services/api');
        const res = await getAnalysis(id);
        
        if (!mounted) return;

        if (res.success && res.data) {
          const currentStatus = res.data.status;
          setStatus(currentStatus);
          if (res.data.processingStatus && res.data.processingStatus.steps) {
            setSteps(res.data.processingStatus.steps);
          }

          if (currentStatus === 'processed') {
            navigate(\`/analysis/\${id}/results\`);
            return;
          }

          if (currentStatus === 'draft' || currentStatus === 'ready_for_processing') {
            // Only call process if not already processing
            await processAnalysis(id);
            isProcessingStarted = true;
          }
        }

        intervalId = setInterval(async () => {
          if (!mounted) return;
          try {
            const statusRes = await getAnalysisStatus(id);
            if (statusRes.success) {
              setStatus(statusRes.data.status);
              setSteps(statusRes.data.steps || []);
              if (statusRes.data.status === 'processed' || statusRes.data.status === 'failed') {
                clearInterval(intervalId);
                if (statusRes.data.status === 'processed') {
                  setTimeout(() => navigate(\`/analysis/\${id}/results\`), 1000);
                }
              }
            }
          } catch (err) {
            console.error(err);
          }
        }, 1500);

      } catch (error) {
        console.error('Error starting workspace:', error);
      }
    };
    startProcessing();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, navigate]);
`;

workspace = workspace.replace(
  /useEffect\(\(\) => \{[\s\S]*?\}, \[id, navigate\]\);/m,
  updatedLogic
);

// We need to import getAnalysis
if (!workspace.includes('getAnalysis,')) {
  workspace = workspace.replace(
    "import { processAnalysis, getAnalysisStatus }",
    "import { processAnalysis, getAnalysisStatus, getAnalysis }"
  );
}

fs.writeFileSync('frontend/src/pages/AnalysisWorkspace.jsx', workspace);
