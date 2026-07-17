import * as React from 'react'
import { framerCodeFiles, getFramerCodeFileByName } from './code-files'
import {
  FramerExecutableCodeFilePreview,
  getFramerExecutableCodeFileByName,
} from './code-file-executables'

export function FramerCodeFilePreview(props: {
  name: string
  fallback?: React.ReactNode
}) {
  const file = getFramerCodeFileByName(props.name)
  if (!file) return <>{props.fallback ?? null}</>
  const executable = getFramerExecutableCodeFileByName(file.name)

  return (
    <article
      data-framer-code-file={file.name}
      style={{
        display: 'grid',
        gap: '0.5rem',
        border: '1px solid rgb(24 24 27 / 0.1)',
        borderRadius: '1rem',
        background: 'white',
        padding: '1rem',
      }}
    >
      <header style={{ display: 'grid', gap: '0.25rem' }}>
        <strong>{file.name}</strong>
        <code style={{ color: '#71717a', fontSize: '0.8rem' }}>
          {file.path ?? file.source ?? 'code-file'}
        </code>
        {file.versionId ? (
          <div style={{ color: '#52525b', fontSize: '0.75rem' }}>
            Version: {file.versionId}
          </div>
        ) : null}
        {file.compatibility ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span
              data-framer-code-file-compatibility={file.compatibility}
              style={{
                border: '1px solid rgb(24 24 27 / 0.08)',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                background:
                  file.compatibility === 'unsupported'
                    ? 'rgb(254 226 226)'
                    : file.compatibility === 'runtime-fallback-required'
                      ? 'rgb(254 249 195)'
                      : 'rgb(244 244 245)',
                color:
                  file.compatibility === 'unsupported'
                    ? '#991b1b'
                    : file.compatibility === 'runtime-fallback-required'
                      ? '#854d0e'
                      : '#3f3f46',
              }}
            >
              {file.compatibility}
            </span>
            {Array.isArray(file.dependencyNames) &&
            file.dependencyNames.length > 0 ? (
              <span style={{ color: '#52525b', fontSize: '0.75rem' }}>
                Dependencies: {file.dependencyNames.join(', ')}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>
      {file.compatibility === 'unsupported' ||
      file.compatibility === 'runtime-fallback-required' ? (
        <div
          data-framer-code-file-fallback={file.name}
          style={{
            display: 'grid',
            gap: '0.35rem',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background:
              file.compatibility === 'unsupported'
                ? 'rgb(254 242 242)'
                : 'rgb(254 252 232)',
            color: file.compatibility === 'unsupported' ? '#7f1d1d' : '#713f12',
            fontSize: '0.8rem',
          }}
        >
          <strong>
            {file.compatibility === 'unsupported'
              ? 'This Framer code file could not be adapted automatically.'
              : 'This Framer code file requires runtime fallback.'}
          </strong>
          {Array.isArray(file.compatibilityReasons) &&
          file.compatibilityReasons.length > 0 ? (
            <div>Reasons: {file.compatibilityReasons.join(', ')}</div>
          ) : null}
          {file.unadaptedComponentPath ? (
            <div
              data-framer-code-file-fallback-path={file.unadaptedComponentPath}
            >
              Preserved source: <code>{file.unadaptedComponentPath}</code>
            </div>
          ) : null}
          {file.unadaptedMetadataPath ? (
            <div>
              Metadata: <code>{file.unadaptedMetadataPath}</code>
            </div>
          ) : null}
        </div>
      ) : null}
      {executable ? (
        <div
          data-framer-code-file-executable-preview={file.name}
          style={{
            display: 'grid',
            gap: '0.5rem',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            background: 'rgb(24 24 27 / 0.04)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#3f3f46' }}>
            Executable preview: <code>{executable.exportName}</code>
          </div>
          <FramerExecutableCodeFilePreview
            name={file.name}
            fallback={<div style={{ opacity: 0.72 }}>Preview unavailable.</div>}
          />
        </div>
      ) : null}
      {Array.isArray(file.exports) && file.exports.length > 0 ? (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: 0,
            margin: 0,
            listStyle: 'none',
          }}
        >
          {file.exports.map((entry) => (
            <li
              key={entry}
              style={{
                border: '1px solid rgb(24 24 27 / 0.08)',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.8rem',
              }}
            >
              {entry}
            </li>
          ))}
        </ul>
      ) : null}
      {typeof file.content === 'string' && file.content.length > 0 ? (
        <pre
          style={{
            margin: 0,
            maxHeight: '10rem',
            overflow: 'auto',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            background: 'rgb(24 24 27 / 0.04)',
            fontSize: '0.7rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {file.content.slice(0, 1200)}
          {file.content.length > 1200 ? '\n…' : ''}
        </pre>
      ) : null}
    </article>
  )
}

export function FramerCodeFileList() {
  if (framerCodeFiles.length === 0) {
    return <div style={{ opacity: 0.64 }}>No Framer code files detected.</div>
  }

  return (
    <section
      data-framer-code-files="true"
      style={{ display: 'grid', gap: '1rem' }}
    >
      {framerCodeFiles.map((file) => (
        <FramerCodeFilePreview key={file.name} name={file.name} />
      ))}
    </section>
  )
}

export const hasFramerCodeFiles = false as const
