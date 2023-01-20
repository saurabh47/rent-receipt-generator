module.exports = {
    apps: [
      {
        name: 'NuxtAppName',
        port: '8090',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
}