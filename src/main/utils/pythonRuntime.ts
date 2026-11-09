/** Select the backend independently of Electron and native inference runtimes. */
export const getPythonRuntime = (platform: string, architecture: string) => {
  // Windows emulates x64 applications on ARM64. Several Open WebUI dependencies
  // publish win_amd64 wheels but no win_arm64 wheels, so use that Python ABI.
  const compatibilityMode = platform === 'win32' && architecture === 'arm64'
  const pythonArchitecture = compatibilityMode ? 'x64' : architecture
  const downloadArchitectures: Record<string, string> = {
    x64: 'x86_64',
    arm64: 'aarch64',
    ia32: 'i686'
  }
  return {
    compatibilityMode,
    downloadArchitecture: downloadArchitectures[pythonArchitecture] || 'x86_64',
    // Keep an existing ARM environment and archive intact. Never mix ABIs.
    directoryName: compatibilityMode ? 'python-x64' : 'python',
    archiveName: compatibilityMode ? 'python-x64.tar.gz' : 'python.tar.gz'
  }
}

export const getOpenWebUICommand = (platform: string, architecture: string, host: string) =>
  getPythonRuntime(platform, architecture).compatibilityMode
    // Loading sklearn's native extensions after PyTorch can deadlock the Windows
    // DLL loader under emulation. Load the metrics stack before the WebUI CLI.
    ? ['-c', 'import sklearn.metrics; from open_webui import app; app()', 'serve', '--host', host]
    : ['-m', 'uv', 'run', 'open-webui', 'serve', '--host', host]

export const getPythonCompatibilityEnv = (
  platform: string,
  architecture: string,
  env: Record<string, string>
): Record<string, string> =>
  getPythonRuntime(platform, architecture).compatibilityMode
    ? {
        OPENBLAS_NUM_THREADS: env.OPENBLAS_NUM_THREADS || '1',
        OMP_NUM_THREADS: env.OMP_NUM_THREADS || '1'
      }
    : {}
