import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getPythonRuntime,
  getOpenWebUICommand,
  getPythonCompatibilityEnv
} from '../src/main/utils/pythonRuntime.ts'

test('Windows ARM uses x64 wheel ABI and isolates both environment and archive', () => {
  const arm = getPythonRuntime('win32', 'arm64')
  assert.deepEqual(arm, {
    compatibilityMode: true,
    downloadArchitecture: 'x86_64',
    directoryName: 'python-x64',
    archiveName: 'python-x64.tar.gz'
  })
  // A previously downloaded native archive must not be reused for x64 setup.
  const native = getPythonRuntime('win32', 'x64')
  assert.notEqual(arm.directoryName, native.directoryName)
  assert.notEqual(arm.archiveName, native.archiveName)
})

for (const [platform, architecture, expected] of [
  ['win32', 'x64', 'x86_64'],
  ['win32', 'ia32', 'i686'],
  ['darwin', 'arm64', 'aarch64'],
  ['linux', 'arm64', 'aarch64'],
  ['linux', 'x64', 'x86_64']
]) {
  test(`${platform}/${architecture} keeps its native Python and existing paths`, () => {
    assert.deepEqual(getPythonRuntime(platform, architecture), {
      compatibilityMode: false,
      downloadArchitecture: expected,
      directoryName: 'python',
      archiveName: 'python.tar.gz'
    })
  })
}

test('Windows ARM preloads native metrics before starting the CLI with separate arguments', () => {
  const args = getOpenWebUICommand('win32', 'arm64', '127.0.0.1')
  assert.deepEqual(args.slice(0, 2), [
    '-c', 'import sklearn.metrics; from open_webui import app; app()'
  ])
  assert.deepEqual(args.slice(2), ['serve', '--host', '127.0.0.1'])
  assert.deepEqual(getOpenWebUICommand('linux', 'arm64', '0.0.0.0'), [
    '-m', 'uv', 'run', 'open-webui', 'serve', '--host', '0.0.0.0'
  ])
})

test('compatibility thread defaults preserve explicit user configuration', () => {
  assert.deepEqual(getPythonCompatibilityEnv('win32', 'arm64', {}), {
    OPENBLAS_NUM_THREADS: '1', OMP_NUM_THREADS: '1'
  })
  assert.deepEqual(getPythonCompatibilityEnv('win32', 'arm64', {
    OPENBLAS_NUM_THREADS: '4', OMP_NUM_THREADS: '2'
  }), { OPENBLAS_NUM_THREADS: '4', OMP_NUM_THREADS: '2' })
  assert.deepEqual(getPythonCompatibilityEnv('win32', 'x64', {}), {})
})
