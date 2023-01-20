module.exports = {
    apps: [
      {
        name: 'ui-ssr',
        port: '8090',
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
}