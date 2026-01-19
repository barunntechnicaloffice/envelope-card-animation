/**
 * Build script that excludes admin and API routes from production build
 * These routes are development-only features
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '..')
const appDir = path.join(rootDir, 'app')
const nextDir = path.join(rootDir, '.next')
const tempDir = path.join(rootDir, '.dev-only-backup')

// Folders to exclude from production build
const excludeFolders = ['api', 'admin']

console.log('🔧 Preparing production build...')
console.log('   Temporarily excluding dev-only routes: ' + excludeFolders.join(', '))

// Clean .next cache to avoid stale builds
if (fs.existsSync(nextDir)) {
  console.log('   🗑️  Cleaning .next cache...')
  fs.rmSync(nextDir, { recursive: true, force: true })
}

// Create temp backup directory
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

// Move folders outside of app directory completely
for (const folder of excludeFolders) {
  const originalPath = path.join(appDir, folder)
  const backupPath = path.join(tempDir, folder)

  if (fs.existsSync(originalPath)) {
    // Remove existing backup if any
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }
    fs.renameSync(originalPath, backupPath)
    console.log(`   📁 app/${folder} → .dev-only-backup/${folder}`)
  }
}

try {
  console.log('\n🏗️  Running Next.js build...\n')
  execSync('next build', { stdio: 'inherit', cwd: rootDir })
  console.log('\n✅ Build completed successfully!')
} catch (error) {
  console.error('\n❌ Build failed!')
  process.exitCode = 1
} finally {
  // Restore folders
  console.log('\n🔄 Restoring dev-only routes...')
  for (const folder of excludeFolders) {
    const originalPath = path.join(appDir, folder)
    const backupPath = path.join(tempDir, folder)

    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, originalPath)
      console.log(`   📁 .dev-only-backup/${folder} → app/${folder}`)
    }
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  console.log('✨ Done!')
}
