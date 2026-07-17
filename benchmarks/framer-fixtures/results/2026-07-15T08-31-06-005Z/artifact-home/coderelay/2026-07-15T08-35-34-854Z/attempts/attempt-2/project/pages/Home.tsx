import type * as React from 'react'
import styles from './Home.module.css'

function SectionHero({
  children,
  style,
}: {
  children: React.ReactNode
  style: React.CSSProperties
}) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="hero">
        {children}
      </div>
    </section>
  )
}

function SectionContent({
  children,
  style,
}: {
  children: React.ReactNode
  style: React.CSSProperties
}) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="content">
        {children}
      </div>
    </section>
  )
}

function SectionMediaGrid({
  children,
  style,
}: {
  children: React.ReactNode
  style: React.CSSProperties
}) {
  return (
    <section className={styles.section} style={style}>
      <div className={styles.inner} data-layout="media-grid">
        {children}
      </div>
    </section>
  )
}

export type HomeProps = {}

export function Home(props: HomeProps) {
  return (
    <main
      className={styles.page}
      data-coderelay-source="https://artifact.framer.ai/"
    >
      <div
        className={[styles.surface, styles.nodeBodyNthChild2DivNthChild2].join(
          ' ',
        )}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild2DivNthChild2,
            'framer-RUlux framer-fia3el',
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1,
              'framer-zulxy6-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                'framer-l0JOv framer-g6c6at framer-v-g6c6at',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                  'framer-bg5xta',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                    'framer-bdftkh',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1ilkfg8-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                        'framer-ZKqTr framer-1s7bozk framer-v-1s7bozk framer-yze0ki',
                      ].join(' ')}
                      href="/"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                          'framer-i2u9n0',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                          ].join(' ')}
                        >
                          <img
                            className={[
                              styles.image,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                            ].join(' ')}
                            src="https://framerusercontent.com/images/AUWaY8BzdSrZTEmGcQvEissyc1E.jpeg"
                            alt=""
                          />
                        </div>
                      </div>
                    </a>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                      'framer-1q4tei5',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        'framer-irjwf1-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                          'framer-cLggr framer-1q6ebco framer-v-1q6ebco',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                            'framer-nzr3p9-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                              'framer-3T8OU framer-3fxwo5 framer-v-3fxwo5 framer-1egufao',
                            ].join(' ')}
                            href="/works"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                'framer-5q84vn',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Works'}
                              </p>
                            </div>
                          </a>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1k7jdot-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2ANthChild1,
                              'framer-3T8OU framer-3fxwo5 framer-v-3fxwo5 framer-1egufao',
                            ].join(' ')}
                            href="/services"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1,
                                'framer-5q84vn',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Services'}
                              </p>
                            </div>
                          </a>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3,
                            'framer-yrewr0-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3ANthChild1,
                              'framer-3T8OU framer-3fxwo5 framer-v-3fxwo5 framer-1egufao',
                            ].join(' ')}
                            href="/products"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1,
                                'framer-5q84vn',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Products'}
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                        'framer-1lzzv0c-container',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                          'framer-NxaYr framer-1kyd5vw framer-v-1kyd5vw',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                            'framer-djcpyl',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1cwo4v2',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                              'framer-xbctye',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3,
                              'framer-146wne4',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                    'framer-9cvtyu-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                      'framer-ohaXb framer-1ds1wqc framer-v-1ds1wqc',
                    ].join(' ')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        'framer-1h27i6',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          'svgContainer',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                        'framer-xt335v',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'E-Mail'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3,
                        'framer-1jynaww-container',
                      ].join(' ')}
                    >
                      <button
                        className={[
                          styles.button,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3ButtonNthChild1,
                        ].join(' ')}
                        type="button"
                      >
                        {'Copy email'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
              'framer-18spxid',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                'framer-1g5a5hf-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                  'framer-OM3gS framer-hpNXt framer-pwf34b framer-v-pwf34b',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                    'framer-1ckh69h',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1v7v8xv',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-wk6ylp',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-a6u6dk',
                        ].join(' ')}
                      >
                        <h1
                          className={[
                            styles.heading,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1,
                            'framer-text framer-styles-preset-9geskp',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              {'B'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild2,
                              ].join(' ')}
                            >
                              {'l'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild3,
                              ].join(' ')}
                            >
                              {'e'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild4,
                              ].join(' ')}
                            >
                              {'n'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild5,
                              ].join(' ')}
                            >
                              {'d'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild6,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild7,
                              ].join(' ')}
                            >
                              {'n'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild1SpanNthChild8,
                              ].join(' ')}
                            >
                              {'g'}
                            </span>
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild1,
                              ].join(' ')}
                            >
                              {'V'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild2,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild3,
                              ].join(' ')}
                            >
                              {'s'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild4,
                              ].join(' ')}
                            >
                              {'u'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild5,
                              ].join(' ')}
                            >
                              {'a'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild2SpanNthChild6,
                              ].join(' ')}
                            >
                              {'l'}
                            </span>
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild1,
                              ].join(' ')}
                            >
                              {'D'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild2,
                              ].join(' ')}
                            >
                              {'e'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild3,
                              ].join(' ')}
                            >
                              {'s'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild4,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild5,
                              ].join(' ')}
                            >
                              {'g'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild3SpanNthChild6,
                              ].join(' ')}
                            >
                              {'n'}
                            </span>
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild4,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild4SpanNthChild1,
                              ].join(' ')}
                            >
                              {'W'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild4SpanNthChild2,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild4SpanNthChild3,
                              ].join(' ')}
                            >
                              {'t'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild4SpanNthChild4,
                              ].join(' ')}
                            >
                              {'h'}
                            </span>
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild1,
                              ].join(' ')}
                            >
                              {'A'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild2,
                              ].join(' ')}
                            >
                              {'r'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild3,
                              ].join(' ')}
                            >
                              {'t'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild4,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild5,
                              ].join(' ')}
                            >
                              {'f'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild6,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild7,
                              ].join(' ')}
                            >
                              {'c'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild8,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild9,
                              ].join(' ')}
                            >
                              {'a'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild5SpanNthChild10,
                              ].join(' ')}
                            >
                              {'l'}
                            </span>
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild1,
                              ].join(' ')}
                            >
                              {'I'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild2,
                              ].join(' ')}
                            >
                              {'n'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild3,
                              ].join(' ')}
                            >
                              {'t'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild4,
                              ].join(' ')}
                            >
                              {'e'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild5,
                              ].join(' ')}
                            >
                              {'l'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild6,
                              ].join(' ')}
                            >
                              {'l'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild7,
                              ].join(' ')}
                            >
                              {'i'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild8,
                              ].join(' ')}
                            >
                              {'g'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild9,
                              ].join(' ')}
                            >
                              {'e'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild10,
                              ].join(' ')}
                            >
                              {'n'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild11,
                              ].join(' ')}
                            >
                              {'c'}
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H1NthChild1SpanNthChild6SpanNthChild12,
                              ].join(' ')}
                            >
                              {'e'}
                            </span>
                          </span>
                        </h1>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-1hk2z5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-16vxsft-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1,
                            'framer-Nuywb framer-17k7r4j framer-v-17k7r4j framer-9vkzed',
                          ].join(' ')}
                          href="https://www.cal.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-1g1va3z',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                                'framer-1w7ipfj',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Available'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-1474g3u',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                'framer-18q9q0x',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Schedule a call'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild3,
                              'framer-psudzp-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild1,
                                'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild1DivNthChild1,
                                  'framer-108m9ci',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild1DivNthChild2,
                                  'framer-1k5wekl',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                          'framer-jvjeb6-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1,
                            'framer-Nuywb framer-17k7r4j framer-v-17k7r4j framer-9vkzed',
                          ].join(' ')}
                          href="/products"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-1g1va3z',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1,
                                'framer-1w7ipfj',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Supply'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-1474g3u',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                                'framer-18q9q0x',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Discover my products'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild3,
                              'framer-psudzp-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild3DivNthChild1,
                                'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild3DivNthChild1DivNthChild1,
                                  'framer-108m9ci',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild3DivNthChild1DivNthChild2,
                                  'framer-1k5wekl',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                          'framer-1m8mmg3-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1,
                            'framer-Nuywb framer-17k7r4j framer-v-17k7r4j framer-9vkzed',
                          ].join(' ')}
                          href="/contact"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                              'framer-1g1va3z',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                                'framer-1w7ipfj',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Contact'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                              'framer-1474g3u',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                                'framer-18q9q0x',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Get in touch'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild3,
                              'framer-psudzp-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild3DivNthChild1,
                                'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild3DivNthChild1DivNthChild1,
                                  'framer-108m9ci',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild3DivNthChild1DivNthChild2,
                                  'framer-1k5wekl',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2,
                'framer-q5rzrj-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                  'framer-EVXfs framer-1gmmdxx framer-v-1gmmdxx',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                    'framer-1pprlpa',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1ylk3dl-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-h0fhU framer-GKEgR framer-1o7iahk framer-v-1o7iahk',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-auvbj3',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-15tuu1z-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-5suEO framer-1zce68 framer-v-1zce68',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1kgnkq7-container',
                              ].join(' ')}
                            >
                              <section
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1,
                                    ].join(' ')}
                                    style={{ cursor: 'grab' }}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1,
                                        'framer-1ps0c7r',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/bWEzpl2D8PozgekT3emRcLSZAiM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1,
                                        'framer-q12wf1',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/1WpiHUvej0omfFIlhXJ4mGeXuM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1,
                                        'framer-1qvhrvv',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/sYyqni83lk3R0H3Rv8sKYc8cjZY.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1,
                                        'framer-1ps0c7r',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/bWEzpl2D8PozgekT3emRcLSZAiM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1,
                                        'framer-q12wf1',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/1WpiHUvej0omfFIlhXJ4mGeXuM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1,
                                        'framer-1qvhrvv',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/sYyqni83lk3R0H3Rv8sKYc8cjZY.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1,
                                        'framer-1ps0c7r',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/bWEzpl2D8PozgekT3emRcLSZAiM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1,
                                        'framer-q12wf1',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/1WpiHUvej0omfFIlhXJ4mGeXuM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1,
                                        'framer-1qvhrvv',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/sYyqni83lk3R0H3Rv8sKYc8cjZY.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1,
                                        'framer-1ps0c7r',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/bWEzpl2D8PozgekT3emRcLSZAiM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1,
                                        'framer-q12wf1',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/1WpiHUvej0omfFIlhXJ4mGeXuM.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1,
                                        'framer-1qvhrvv',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1,
                                        ].join(' ')}
                                      >
                                        <img
                                          className={[
                                            styles.image,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1ImgNthChild1,
                                          ].join(' ')}
                                          src="https://framerusercontent.com/images/sYyqni83lk3R0H3Rv8sKYc8cjZY.jpg"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2,
                                    'framer--slideshow-controls',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild1,
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2,
                                    ].join(' ')}
                                  >
                                    <button
                                      className={[
                                        styles.button,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild1,
                                      ].join(' ')}
                                      type="button"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild1DivNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </button>
                                    <button
                                      className={[
                                        styles.button,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild2,
                                      ].join(' ')}
                                      type="button"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild2DivNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </button>
                                    <button
                                      className={[
                                        styles.button,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild3,
                                      ].join(' ')}
                                      type="button"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild3DivNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </button>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1keus7n',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-hyt16h',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-ij6grx-container',
                              ].join(' ')}
                            >
                              <a
                                className={[
                                  styles.link,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1,
                                  'framer-qiqgG framer-141pwjg framer-v-9lf0oi framer-1ust51i',
                                ].join(' ')}
                                href="/products"
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                    'framer-1iexp0b',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                      'framer-text',
                                    ].join(' ')}
                                  >
                                    {'Upcoming Drop'}
                                  </p>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                    'framer-1xl0b6j',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                      'framer-1rfasy7',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                        'svgContainer',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                        ].join(' ')}
                                      >
                                        <div
                                          className={[
                                            styles.surface,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                          ].join(' ')}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                                'framer-33q9xf',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1,
                                  'framer-7smois',
                                ].join(' ')}
                              >
                                <h2
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1H2NthChild1,
                                    'framer-text framer-styles-preset-1t1sl32',
                                  ].join(' ')}
                                >
                                  {'Surreal Homes made in Midjourney'}
                                </h2>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild2,
                                  'framer-1j0xq4f',
                                ].join(' ')}
                              >
                                <h2
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild2H2NthChild1,
                                    'framer-text framer-styles-preset-1t1sl32',
                                  ].join(' ')}
                                >
                                  {'Subscribe & get notified'}
                                </h2>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3,
                                'framer-w7gz2d',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1,
                                  'framer-dbjwoy-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                                    'framer-JFf8P framer-15ziyzm framer-v-15ziyzm',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-11u20gk-container',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1FormNthChild1,
                                        ].join(' ')}
                                      >
                                        <div
                                          className={[
                                            styles.surface,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1FormNthChild1InputNthChild1,
                                            'v1 framer-custom-input',
                                          ].join(' ')}
                                          style={{ cursor: 'text' }}
                                        ></div>
                                        <div
                                          className={[
                                            styles.surface,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1FormNthChild1DivNthChild2,
                                          ].join(' ')}
                                        >
                                          <div
                                            className={[
                                              styles.surface,
                                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1FormNthChild1DivNthChild2InputNthChild1,
                                            ].join(' ')}
                                            style={{ cursor: 'pointer' }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                              'framer-eq53q1',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                                'framer-1odxx55-container',
                              ].join(' ')}
                            >
                              <a
                                className={[
                                  styles.link,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                                  'framer-qiqgG framer-141pwjg framer-v-141pwjg framer-1ust51i',
                                ].join(' ')}
                                href="/blog"
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                                    'framer-1iexp0b',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                      'framer-text',
                                    ].join(' ')}
                                  >
                                    {'Latest Scoop'}
                                  </p>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                                    'framer-1xl0b6j',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                      'framer-1rfasy7',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                        'svgContainer',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                        ].join(' ')}
                                      >
                                        <div
                                          className={[
                                            styles.surface,
                                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                          ].join(' ')}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                                'framer-wplu5v',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                                  'framer-bal2ct-container',
                                ].join(' ')}
                              >
                                <a
                                  className={[
                                    styles.link,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                                    'framer-eVvza framer-10i6jes framer-v-10i6jes framer-13qsfzb',
                                  ].join(' ')}
                                  href="/blog/top-10-mj-tips"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                                      'framer-1hd5o7',
                                    ].join(' ')}
                                  >
                                    <p
                                      className={[
                                        styles.body,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                        'framer-text',
                                      ].join(' ')}
                                    >
                                      {'Top 10 MJ Tips'}
                                    </p>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                                      'framer-1n72ls3-container',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                        'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                          'framer-108m9ci',
                                        ].join(' ')}
                                      ></div>
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                          'framer-1k5wekl',
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2,
                                  'framer-bal2ct-container',
                                ].join(' ')}
                              >
                                <a
                                  className={[
                                    styles.link,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1,
                                    'framer-eVvza framer-10i6jes framer-v-10i6jes framer-13qsfzb',
                                  ].join(' ')}
                                  href="/blog/my-creative-process"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                                      'framer-1hd5o7',
                                    ].join(' ')}
                                  >
                                    <p
                                      className={[
                                        styles.body,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                        'framer-text',
                                      ].join(' ')}
                                    >
                                      {'My Creative Process'}
                                    </p>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                                      'framer-1n72ls3-container',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                                        'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                          'framer-108m9ci',
                                        ].join(' ')}
                                      ></div>
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                          'framer-1k5wekl',
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3,
                                  'framer-bal2ct-container',
                                ].join(' ')}
                              >
                                <a
                                  className={[
                                    styles.link,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1,
                                    'framer-eVvza framer-10i6jes framer-v-10i6jes framer-13qsfzb',
                                  ].join(' ')}
                                  href="/blog/new-era-of-image-creation"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                                      'framer-1hd5o7',
                                    ].join(' ')}
                                  >
                                    <p
                                      className={[
                                        styles.body,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild1PNthChild1,
                                        'framer-text',
                                      ].join(' ')}
                                    >
                                      {'New Era of Image Creation'}
                                    </p>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                                      'framer-1n72ls3-container',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                                        'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                          'framer-108m9ci',
                                        ].join(' ')}
                                      ></div>
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                          'framer-1k5wekl',
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1,
                'framer-1ohy7tp-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                  'framer-koj4g framer-u8ts04 framer-v-u8ts04',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                    'framer-s9ptqh',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1w1tyh',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-3ow82k',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-na6qso',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1nfh3su-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                              'framer-xIPv9 framer-3IbRC framer-1byn7cv framer-v-1byn7cv framer-1oba1e7',
                            ].join(' ')}
                            href="/works"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                'framer-s188oc',
                              ].join(' ')}
                            >
                              <h2
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1H2NthChild1,
                                  'framer-text framer-styles-preset-iavmrg',
                                ].join(' ')}
                              >
                                {'New Work'}
                              </h2>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                'framer-1yy70z5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                  'framer-12cl6xh',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                      ].join(' ')}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-1bum1ek',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-1llrhmh-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1,
                            'framer-dGmIB framer-10rinp6 framer-v-10rinp6 framer-xxptye',
                          ].join(' ')}
                          href="/works/skyline"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-15wqi7f',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/W8SOIzaQATXg2YiTQy2yZVWbs.jpeg?scale-down-to=1024"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-3vdpyp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                'framer-1te4s3a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1onue81-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild2,
                                'framer-wurac3',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Skyline'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild3,
                                'framer-6qr6fj',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild3DivNthChild1,
                                  'framer-1dzik38',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Generative'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                          'framer-1llrhmh-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1,
                            'framer-dGmIB framer-10rinp6 framer-v-10rinp6 framer-xxptye',
                          ].join(' ')}
                          href="/works/meridian"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-15wqi7f',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/LTmuFWK7o7hkFqPex8Jnrobz5c.jpeg?scale-down-to=512"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-3vdpyp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                                'framer-1te4s3a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1onue81-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild2,
                                'framer-wurac3',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Meridian'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild3,
                                'framer-6qr6fj',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild3DivNthChild1,
                                  'framer-1dzik38',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Generative'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                          'framer-1llrhmh-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1,
                            'framer-dGmIB framer-10rinp6 framer-v-10rinp6 framer-xxptye',
                          ].join(' ')}
                          href="/works/apex"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                              'framer-15wqi7f',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/iAx1VBnbZZryCk7TI3JHZUKQ.jpeg?scale-down-to=512"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                              'framer-3vdpyp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                                'framer-1te4s3a',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1onue81-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild2,
                                'framer-wurac3',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Apex'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild3,
                                'framer-6qr6fj',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild3DivNthChild1,
                                  'framer-1dzik38',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Visualization'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1,
                'framer-1bdufjj-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                  'framer-26kcQ framer-3u2tyc framer-v-3u2tyc',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                    'framer-exy891',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-l646y0',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1luj2t7-container',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1,
                        ].join(' ')}
                      >
                        {
                          "I'm , a designer merging design with to create new experiences. I craft and regularily share my learnings as by writing about my discoveries in AI."
                        }
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1,
                              'framer-f8y80p framer-6kwei4',
                            ].join(' ')}
                            href="/about"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild1,
                                'framer-c00ary',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild1DivNthChild1,
                                ].join(' ')}
                              >
                                <img
                                  className={[
                                    styles.image,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                  ].join(' ')}
                                  src="https://framerusercontent.com/images/AUWaY8BzdSrZTEmGcQvEissyc1E.jpeg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild2,
                                'framer-z1rw50',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild2DivNthChild1,
                                  'framer-1jc3hez',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1SpanNthChild1,
                                      'framer-text',
                                    ].join(' ')}
                                  >
                                    {'Jenna'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </a>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1,
                              'framer-1qse4ss-container',
                            ].join(' ')}
                          >
                            <a
                              className={[
                                styles.link,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1,
                                'framer-RmieJ framer-sb7tpt framer-v-sb7tpt framer-1umjhmf',
                              ].join(' ')}
                              href="/works"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild1,
                                  'framer-1ey057n',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Generative AI'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild2,
                                  'framer-1h4j808-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1,
                              'framer-wsjs8-container',
                            ].join(' ')}
                          >
                            <a
                              className={[
                                styles.link,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1,
                                'framer-RmieJ framer-sb7tpt framer-v-sb7tpt framer-1umjhmf',
                              ].join(' ')}
                              href="/products"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild1,
                                  'framer-1ey057n',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Products'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild2,
                                  'framer-1h4j808-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild3DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1,
                              'framer-1epcvts-container',
                            ].join(' ')}
                          >
                            <a
                              className={[
                                styles.link,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1,
                                'framer-RmieJ framer-sb7tpt framer-v-sb7tpt framer-1umjhmf',
                              ].join(' ')}
                              href="/blog"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild1,
                                  'framer-1ey057n',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Insights'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild2,
                                  'framer-1h4j808-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                    'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                      'framer-108m9ci',
                                    ].join(' ')}
                                  ></div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1SpanNthChild4DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild2,
                                      'framer-1k5wekl',
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </span>
                      </h2>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-1vam55g-container',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1,
                        ].join(' ')}
                      >
                        {
                          'You can find me on where share daily thoughts, and on about my visual experiements.'
                        }
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1ANthChild1,
                              'framer-pe1wrx framer-6kwei4',
                            ].join(' ')}
                            href="https://x.com/"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1ANthChild1DivNthChild1,
                                'framer-14x37xo',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1ANthChild1DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1ANthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild1ANthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2ANthChild1,
                              'framer-nu0r5s framer-6kwei4',
                            ].join(' ')}
                            href="https://threads.com/"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2ANthChild1DivNthChild1,
                                'framer-1t18jkv',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2ANthChild1DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2ANthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H2NthChild1SpanNthChild2ANthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1,
                'framer-dm7g9d-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                  'framer-tznAc framer-4nz8r6 framer-v-4nz8r6',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                    'framer-qfxzvq',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1uihjig',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-zq5quc',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-wssw24',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1xyg9xe-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                              'framer-xIPv9 framer-3IbRC framer-1byn7cv framer-v-1byn7cv framer-1oba1e7',
                            ].join(' ')}
                            href="/products"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                'framer-s188oc',
                              ].join(' ')}
                            >
                              <h2
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1H2NthChild1,
                                  'framer-text framer-styles-preset-iavmrg',
                                ].join(' ')}
                              >
                                {'Product Drops'}
                              </h2>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                'framer-1yy70z5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                  'framer-12cl6xh',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                      ].join(' ')}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-13kyhad',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-125oolz',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                            'framer-1y8kz1b-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1,
                              'framer-OTiZC framer-1mgxgo framer-v-1mgxgo framer-n3md5v',
                            ].join(' ')}
                            href="/products/interiorvision-studio"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                'framer-1myd98e',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                                  'framer-7217aj',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-phsmpm',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'svgContainer',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                                  'framer-91mfpc',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'App'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                'framer-10l662z',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                ].join(' ')}
                              >
                                <img
                                  className={[
                                    styles.image,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1ImgNthChild1,
                                  ].join(' ')}
                                  src="https://framerusercontent.com/images/fifYiMr975aAcL81yS2Q8Valolw.jpeg?scale-down-to=512"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild3,
                                'framer-7vlotl',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild3DivNthChild1,
                                  'framer-tlkijd',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'InteriorVision Studio'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild3DivNthChild2,
                                  'framer-g1vcyr',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild3DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'$39'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild4,
                                'framer-1gmezo0-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild4DivNthChild1,
                                  'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                    'framer-108m9ci',
                                  ].join(' ')}
                                ></div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild2,
                                    'framer-1k5wekl',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                          'framer-125oolz',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                            'framer-1y8kz1b-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                              'framer-OTiZC framer-1mgxgo framer-v-1mgxgo framer-n3md5v',
                            ].join(' ')}
                            href="/products/contemporary-objects"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                                'framer-1myd98e',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                                  'framer-7217aj',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-phsmpm',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'svgContainer',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                                  'framer-91mfpc',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Mockup'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                                'framer-10l662z',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                ].join(' ')}
                              >
                                <img
                                  className={[
                                    styles.image,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1ImgNthChild1,
                                  ].join(' ')}
                                  src="https://framerusercontent.com/images/JEHF7Z8EwE2fVoabzV1o7dhGdlM.jpeg?scale-down-to=512"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild3,
                                'framer-7vlotl',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild1,
                                  'framer-tlkijd',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Contemporary Objects'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild2,
                                  'framer-g1vcyr',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild3DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'$24'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild4,
                                'framer-1gmezo0-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1,
                                  'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                    'framer-108m9ci',
                                  ].join(' ')}
                                ></div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild2,
                                    'framer-1k5wekl',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                          'framer-125oolz',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1,
                            'framer-1y8kz1b-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1,
                              'framer-OTiZC framer-1mgxgo framer-v-1mgxgo framer-n3md5v',
                            ].join(' ')}
                            href="/products/promptcraft-pro"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1,
                                'framer-1myd98e',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                                  'framer-7217aj',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-phsmpm',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'svgContainer',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                                  'framer-91mfpc',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Guide'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild2,
                                'framer-10l662z',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                ].join(' ')}
                              >
                                <img
                                  className={[
                                    styles.image,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild2DivNthChild1ImgNthChild1,
                                  ].join(' ')}
                                  src="https://framerusercontent.com/images/Lcov1yQ7u2EobWVDFPp9qU0eNc.jpeg?scale-down-to=512"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild3,
                                'framer-7vlotl',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild3DivNthChild1,
                                  'framer-tlkijd',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild3DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'PromptCraft Pro'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild3DivNthChild2,
                                  'framer-g1vcyr',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild3DivNthChild2PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'$149'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild4,
                                'framer-1gmezo0-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild4DivNthChild1,
                                  'framer-HZfA6 framer-ottb0a framer-v-ottb0a',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                    'framer-108m9ci',
                                  ].join(' ')}
                                ></div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild2,
                                    'framer-1k5wekl',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6,
                'framer-m5nhc8-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1,
                  'framer-xoEGy framer-15s8ths framer-v-15s8ths',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                    'framer-ofv3b',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-9c5vec',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-znuupy',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-cx26ir',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1k8wwfe-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                              'framer-xIPv9 framer-3IbRC framer-1byn7cv framer-v-1byn7cv framer-1oba1e7',
                            ].join(' ')}
                            href="/stack"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                'framer-s188oc',
                              ].join(' ')}
                            >
                              <h2
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1H2NthChild1,
                                  'framer-text framer-styles-preset-iavmrg',
                                ].join(' ')}
                              >
                                {'Software Stack'}
                              </h2>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                'framer-1yy70z5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                  'framer-12cl6xh',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                      ].join(' ')}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-4fkof3',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://www.midjourney.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/gWM4JStXVN3CJeRoBZ5FjPm10.png"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Midjourney'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'AI'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://framer.link/cedric_design"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/ZmOuFXkoGoEpOrAIJdOqFqdcs0.png"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Framer'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Website Builder'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://www.lemonsqueezy.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/SOG6zVvs7YHeoByIT2vCBngfAcM.webp"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Lemon Squeezy'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Payment Platform'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://www.figma.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/cvValximiTCYGyctug38cu5vMU.png"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Figma'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Design Tool'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild4ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://typefully.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/wPpzmgsCNjJtl12gvb9asnOm0c.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Typefully'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Writer & Scheduler for Twitter/X'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild5ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://iconic.app/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/wCYUJecEDcxVjDNiA5dsJszhU0.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Iconic'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Icon Library'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild6ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://www.linear.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/CQSyM2flIboH8syDCScLWEL7mgY.webp"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Linear'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Project Management'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild7ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8,
                          'framer-1v6ivpi-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1,
                            'framer-0T3Ya framer-1bftho7 framer-v-1bftho7 framer-hrs33l',
                          ].join(' ')}
                          href="https://www.webflow.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild1,
                              'framer-1j6gxcd',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="https://framerusercontent.com/images/UPkjR5UQGzIvkr5SJ7WBpGso4o.webp"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild2,
                              'framer-q04qib',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild2DivNthChild1,
                                'framer-t4yfht',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Webflow'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild2DivNthChild2,
                                'framer-gt3348',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text',
                                ].join(' ')}
                              >
                                {'Visual Development Tool'}
                              </p>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild3,
                              'framer-hjy556',
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild4,
                              'framer-1adeykh',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild4DivNthChild1,
                                'framer-1023jm5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild4DivNthChild1DivNthChild1,
                                  'svgContainer',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild8ANthChild1DivNthChild4DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2,
              'framer-h98wp7-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1,
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild2,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild3,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild4,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild5,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild6,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild7,
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild8,
                ].join(' ')}
              ></div>
            </div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3,
              'framer-1xkcp7b-container',
            ].join(' ')}
          >
            <a
              className={[
                styles.link,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3ANthChild1,
                'framer-OlS2G framer-ti9o13 framer-v-ti9o13 framer-dszcgl',
              ].join(' ')}
              href="https://buy.polar.sh/polar_cl_0slVKny7mgzD9R8Q1o8OxRfHj3wdRKI8LjZwK1dfjdb"
              style={{ cursor: 'pointer' }}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3ANthChild1DivNthChild1,
                  'framer-1lk7vph',
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3ANthChild1DivNthChild2,
                  'framer-t1sgsf',
                ].join(' ')}
              >
                <p
                  className={[
                    styles.body,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3ANthChild1DivNthChild2PNthChild1,
                    'framer-text',
                  ].join(' ')}
                >
                  {'Buy Template'}
                </p>
              </div>
            </a>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6,
              'framer-g4sjby-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1,
                'framer-GK1CS framer-Gldyu framer-wg83lh framer-v-wg83lh',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                  'framer-p0feiz',
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2,
                  'framer-m7g7dg',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                    'framer-1juz4ku',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                      'framer-xo40jf',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-rnaf8j',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-9lhyji',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1n69fd5',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-text',
                            ].join(' ')}
                          ></div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1limtbm',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-text',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-12rjvx3-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-JFf8P framer-15ziyzm framer-v-15ziyzm',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-11u20gk-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1FormNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1FormNthChild1InputNthChild1,
                                    'v1 framer-custom-input',
                                  ].join(' ')}
                                  style={{ cursor: 'text' }}
                                ></div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1FormNthChild1DivNthChild2,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1FormNthChild1DivNthChild2InputNthChild1,
                                    ].join(' ')}
                                    style={{ cursor: 'pointer' }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                      'framer-12998yu',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1,
                        'framer-1oe0gww',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                          'framer-1jdacj7-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                            'framer-F16Ka framer-Gldyu framer-1gbzlgn framer-v-1ofvmme',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-n8s5v0',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-ax1iaa',
                              ].join(' ')}
                            >
                              {'Sleeping 💤'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild2,
                        'framer-m6fc8z',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                          'framer-text framer-styles-preset-ax1iaa',
                        ].join(' ')}
                      >
                        {'·'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild3,
                        'framer-14jxfkk',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild3DivNthChild1,
                          'framer-1sicouz',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild3DivNthChild1PNthChild1,
                            'framer-text framer-styles-preset-ax1iaa',
                          ].join(' ')}
                        >
                          {'NYC'}
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild3DivNthChild2,
                          'framer-1lmafcd-container',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild3DivNthChild2SpanNthChild1,
                          ].join(' ')}
                        >
                          {'04:35 AM'}
                        </span>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild4,
                        'framer-kgiy',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild4PNthChild1,
                          'framer-text framer-styles-preset-ax1iaa',
                        ].join(' ')}
                      >
                        {'·'}
                      </p>
                    </div>
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild5,
                        'framer-q49sm7 framer-113rrgr',
                      ].join(' ')}
                      href="https://buy.polar.sh/polar_cl_0slVKny7mgzD9R8Q1o8OxRfHj3wdRKI8LjZwK1dfjdb"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild5DivNthChild1,
                          'framer-ur4vev',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild5DivNthChild1PNthChild1,
                            'framer-text framer-styles-preset-ax1iaa',
                          ].join(' ')}
                        >
                          {'Buy this template'}
                        </p>
                      </div>
                    </a>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild6,
                        'framer-1cerqxu',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2DivNthChild6PNthChild1,
                          'framer-text framer-styles-preset-ax1iaa',
                        ].join(' ')}
                      >
                        {'·'}
                      </p>
                    </div>
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild7,
                        'framer-11j8iq8 framer-113rrgr',
                      ].join(' ')}
                      href="https://framer.link/cedric_design"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild7DivNthChild1,
                          'framer-1pfggc',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild7DivNthChild1PNthChild1,
                            'framer-text framer-styles-preset-ax1iaa',
                          ].join(' ')}
                        >
                          {'Made in Framer'}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={[styles.surface, styles.nodeBodyNthChild2DivNthChild6].join(
          ' ',
        )}
      >
        <a
          className={[
            styles.link,
            styles.nodeBodyNthChild2DivNthChild6ANthChild1,
            'framer-6jWyo framer-n0ccwk framer-v-n0ccwk framer-bmpgw8 __framer-badge',
          ].join(' ')}
          href="https://www.framer.com/"
          style={{ cursor: 'pointer' }}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild1,
              'framer-13yxzio',
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild2,
              'framer-19yaanm',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild1,
                'framer-1kflzx5',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                  'framer-hcsc7 framer-e50co',
                ].join(' ')}
              ></div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild2DivNthChild3,
                'framer-g7oZR framer-1um7t9d',
              ].join(' ')}
            ></div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild3,
              'framer-j4ugry',
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild6ANthChild1DivNthChild4,
              'framer-jnuwbw',
            ].join(' ')}
          ></div>
        </a>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild1PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild1PathNthChild2,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild2PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild3PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild4PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild5PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild6PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild7PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild8PathNthChild1,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild8PathNthChild2,
        ].join(' ')}
      ></div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild38SvgNthChild9PathNthChild1,
        ].join(' ')}
      ></div>
    </main>
  )
}
