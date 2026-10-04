import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'kp6s20e6',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  // Keep deployed Studio versions aligned with the validated lockfile.
  deployment: {autoUpdates: false},
})
