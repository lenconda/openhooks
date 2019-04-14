const env = process.env.NODE_ENV || 'development'

const config = {
  env: env,
  isProduction: env.toLowerCase() === 'production',
  isDev: env.toLowerCase() === 'development',
  isTest: env.toLowerCase() === 'test',
}

export default config