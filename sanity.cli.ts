import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'de303cs3', // ID proyek kamu
    dataset: 'production'
  },
  // TAMBAHKAN INI:
  deployment: {
    appId: 'e1dfrvve04b7xho012talcfj',
  }
})