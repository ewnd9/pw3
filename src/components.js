module.exports = {
  available: {
    path: './menu/available-menu',
    type: 'menu'
  },
  info: {
    path: './menu/info-menu',
    type: 'menu',
    args: ['query']
  },
  progress: {
    path: './menu/progress-menu',
    type: 'menu'
  },
  search: {
    path: './helpers/search-task',
    type: 'task',
    args: ['query']
  },
  subtitles: {
    path: './helpers/subtitles-task.js',
    type: 'task',
    args: ['query', 'langs']
  },
  timeline: {
    path: './helpers/timeline-task.js',
    type: 'task',
    args: ['query']
  },
  setup: {
    path: './prompts/setup-prompt.js',
    type: 'task'
  }
};
