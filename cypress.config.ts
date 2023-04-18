import { defineConfig } from 'cypress'

export default defineConfig({

  e2e: {
    'baseUrl': 'https://172.19.0.50/',
    //watchForFileChanges: false,
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }

})
