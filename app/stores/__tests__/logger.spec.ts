import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { logLevelConsole, useLogger } from '../logger'

describe('logger.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('handles all logging levels correctly', () => {
    const logger = useLogger()
    logger.settings.level = 'DEBUG'
    const errorSpy = vi.spyOn(logLevelConsole, 'ERROR')
    expect(logger.logs.length).toEqual(0)
    logger.error('test')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.level).toEqual('ERROR')
    expect(logger.logs[0]?.message).toEqual('test')
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'))
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('test'))
    logger.reset()
    logger.settings.level = 'DEBUG'
    const warnSpy = vi.spyOn(logLevelConsole, 'WARN')
    expect(logger.logs.length).toEqual(0)
    logger.warn('test')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.level).toEqual('WARN')
    expect(logger.logs[0]?.message).toEqual('test')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'))
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('test'))
    logger.reset()
    logger.settings.level = 'DEBUG'
    const infoSpy = vi.spyOn(logLevelConsole, 'INFO')
    expect(logger.logs.length).toEqual(0)
    logger.info('test')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.level).toEqual('INFO')
    expect(logger.logs[0]?.message).toEqual('test')
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'))
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('test'))
    logger.reset()
    logger.settings.level = 'DEBUG'
    const debugSpy = vi.spyOn(logLevelConsole, 'DEBUG')
    expect(logger.logs.length).toEqual(0)
    logger.debug('test')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.level).toEqual('DEBUG')
    expect(logger.logs[0]?.message).toEqual('test')
    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'))
    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('test'))
    logger.reset()
  })

  it('calls console methods for ERROR and WARN levels no matter the settings', () => {
    const logger = useLogger()
    logger.settings.level = 'OFF'
    const errorSpy = vi.spyOn(logLevelConsole, 'ERROR')
    logger.error('test')
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'))
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('test'))
    const warnSpy = vi.spyOn(logLevelConsole, 'WARN')
    logger.warn('test2')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARN'))
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('test2'))
    const infoSpy = vi.spyOn(logLevelConsole, 'INFO')
    logger.info('test3')
    expect(infoSpy).toHaveBeenCalledTimes(0)
  })

  it('properly stores logs based on the log level settings', () => {
    const logger = useLogger()
    logger.settings.level = 'INFO'
    logger.error('test')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.level).toEqual('ERROR')
    expect(logger.logs[0]?.message).toEqual('test')
    logger.warn('test2')
    expect(logger.logs.length).toEqual(2)
    expect(logger.logs[0]?.level).toEqual('WARN')
    expect(logger.logs[0]?.message).toEqual('test2')
    logger.info('test3')
    expect(logger.logs.length).toEqual(3)
    expect(logger.logs[0]?.level).toEqual('INFO')
    expect(logger.logs[0]?.message).toEqual('test3')
    logger.debug('test4')
    expect(logger.logs.length).toEqual(3)
    expect(logger.logs[0]?.level).toEqual('INFO')
  })

  it('clears logs when the limit is reached', () => {
    const logger = useLogger()
    logger.settings.limit = 1
    logger.error('test')
    expect(logger.logs.length).toEqual(1)
    logger.error('test2')
    expect(logger.logs.length).toEqual(1)
    expect(logger.logs[0]?.message).toEqual('test2')
  })

  it('clears logs when the reset method is called', () => {
    const logger = useLogger()
    logger.error('test')
    expect(logger.logs.length).toEqual(1)
    logger.reset()
    expect(logger.logs.length).toEqual(0)
  })
})
