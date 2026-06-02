'use server'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'

export const serverFunction: typeof handleServerFunctions = async (args) =>
  handleServerFunctions({ ...args, config, importMap })
