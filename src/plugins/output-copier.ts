// Copy integrations output
// It's a known problem on Astro v5, causing output-dependened integrations
// files missing on the final build.
// This plugin helps to copy the output files to the final build.
// See:
// - https://github.com/withastro/astro/issues/12663
// - https://github.com/withastro/adapters/issues/445

import { access, cp, readdir } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AstroIntegration, AstroIntegrationLogger } from 'astro'

const copierTasks = {
  sitemap: sitemapCopier,
  pagefind: pagefindCopier
}

export type OutputCopierOptions = {
  integ: Array<'sitemap' | 'pagefind'>
}

export const outputCopier = (
  opts: OutputCopierOptions = { integ: ['sitemap'] }
): AstroIntegration => ({
  name: 'output-copier',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const buildLogger = logger.fork('output-copier')
      const distDir = fileURLToPath(dir)
      const sourceDir = await resolveSourceDir(distDir)
      const vercelStaticDir = path.resolve('./.vercel/output/static')

      if (!(await pathExists(vercelStaticDir))) {
        buildLogger.info('Skipping copy because .vercel/output/static does not exist')
        return
      }

      buildLogger.info(`Copying output files from ${sourceDir} to ${vercelStaticDir}`)

      await Promise.all(
        opts.integ.map(async (integ) => {
          const copier = copierTasks[integ]
          if (copier) {
            await copier(buildLogger, sourceDir, vercelStaticDir)
          } else {
            buildLogger.warn(`No copier found for integration: ${integ}`)
          }
        })
      )
    }
  }
})

async function sitemapCopier(
  logger: AstroIntegrationLogger,
  sourceDir: string,
  destDir: string
) {
  logger.info(`[sitemap] Copying XML files from ${sourceDir}`)
  try {
    const files = await readdir(sourceDir)
    const xmlFiles = files.filter(
      (file) =>
        path.extname(file).toLowerCase() === '.xml' &&
        path.basename(file).toLowerCase().startsWith('sitemap')
    )
    if (xmlFiles.length === 0) {
      logger.info('[sitemap] No sitemap XML files found, skipping')
      return
    }
    logger.info(xmlFiles.join(', '))
    await Promise.all(
      xmlFiles.map(async (file) => {
        const sourcePath = path.join(sourceDir, file)
        const destPath = path.join(destDir, file)
        await cp(sourcePath, destPath)
      })
    )
  } catch (error) {
    logger.error(`[sitemap] Error copying files: ${error}`)
  }
}

async function pagefindCopier(
  logger: AstroIntegrationLogger,
  sourceDir: string,
  destDir: string
) {
  logger.info(`[pagefind] Copying pagefind folder from ${sourceDir}`)
  const sourcePath = path.join(sourceDir, 'pagefind')
  const destPath = path.join(destDir, 'pagefind')
  if (!(await pathExists(sourcePath))) {
    logger.info('[pagefind] No pagefind output found, skipping')
    return
  }
  try {
    await cp(sourcePath, destPath, { recursive: true })
  } catch (error) {
    logger.error(`[pagefind] Error copying folder: ${error}`)
  }
}

async function resolveSourceDir(distDir: string) {
  const clientDir = path.join(distDir, 'client')
  return (await pathExists(clientDir)) ? clientDir : distDir
}

async function pathExists(targetPath: string) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}
