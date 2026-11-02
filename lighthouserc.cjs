/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      // Serve built `dist` via LHCI's static server — avoids Windows stdout
      // buffering that makes Vite's "Local:" banner miss startServerReadyPattern.
      staticDistDir: './dist',
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
