// sanity/schemas/youtube.ts
export default {
  name: 'youtube',
  type: 'object',
  title: 'YouTube Video',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'Masukkan Link Video YouTube',
      description: 'Contoh: https://www.youtube.com/watch?v=xxxxxx'
    }
  ]
}