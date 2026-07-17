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
      data-coderelay-source="https://cohesion.framer.ai/"
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
            'framer-IJN5J framer-4xk2sl',
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1,
              'framer-131nhti-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1,
                'framer-dcHhA framer-1wrp70r framer-v-1wrp70r',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1,
                  'framer-1g6z2lj',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild1,
                    'framer-kzho2e',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2,
                    'framer-1v86gbv-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1qzeroc framer-9bxnm3',
                    ].join(' ')}
                    href="/#home"
                    style={{ cursor: 'pointer' }}
                  >
                    {'Home Home'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3,
                    'framer-190e5pj-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1obz251 framer-9bxnm3',
                    ].join(' ')}
                    href="/#about"
                    style={{ cursor: 'pointer' }}
                  >
                    {'About About'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4,
                    'framer-1jsf4sj-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1obz251 framer-9bxnm3',
                    ].join(' ')}
                    href="/#stack"
                    style={{ cursor: 'pointer' }}
                  >
                    {'Stack Stack'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5,
                    'framer-w4wtw3-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1obz251 framer-9bxnm3',
                    ].join(' ')}
                    href="/#services"
                    style={{ cursor: 'pointer' }}
                  >
                    {'Services Services'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6,
                    'framer-1rqmck0-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1obz251 framer-9bxnm3',
                    ].join(' ')}
                    href="/#projects"
                    style={{ cursor: 'pointer' }}
                  >
                    {'Projects Projects'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7,
                    'framer-vt0iqw-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7ANthChild1,
                      'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1obz251 framer-9bxnm3',
                    ].join(' ')}
                    href="/#contact"
                    style={{ cursor: 'pointer' }}
                  >
                    {'Contact Contact'}
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7ANthChild1DivNthChild1,
                        'framer-mgdf4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7ANthChild1DivNthChild1DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7ANthChild1DivNthChild2,
                        'framer-15mvj5a',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1NavNthChild1DivNthChild1DivNthChild7ANthChild1DivNthChild2DivNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      ></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <main
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2,
              'framer-11yezan',
            ].join(' ')}
          >
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1,
                'framer-dewjtt',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild1,
                  'framer-qymg3e',
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2,
                  'framer-1tu7b0v',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1,
                    'framer-rr25gv-container hidden-1bcn5ap',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1,
                      'framer-jIMkv framer-icrq48 framer-v-icrq48',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1qxjjep-container',
                      ].join(' ')}
                    >
                      <section
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1,
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1,
                          ].join(' ')}
                        >
                          <li
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild1DivNthChild1,
                                'framer-1hcpstp',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1,
                                  'framer-1wvgu72',
                                ].join(' ')}
                              >
                                <h1
                                  className={[
                                    styles.heading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1H1NthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'LARRY BRONX'}
                                </h1>
                              </div>
                            </div>
                          </li>
                          <li
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild2,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild2DivNthChild1,
                                'framer-1hcpstp',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1,
                                  'framer-1wvgu72',
                                ].join(' ')}
                              >
                                <h1
                                  className={[
                                    styles.heading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1H1NthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'LARRY BRONX'}
                                </h1>
                              </div>
                            </div>
                          </li>
                          <li
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild3,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild3DivNthChild1,
                                'framer-1hcpstp',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1,
                                  'framer-1wvgu72',
                                ].join(' ')}
                              >
                                <h1
                                  className={[
                                    styles.heading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1H1NthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'LARRY BRONX'}
                                </h1>
                              </div>
                            </div>
                          </li>
                          <li
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild4,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild4DivNthChild1,
                                'framer-1hcpstp',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1,
                                  'framer-1wvgu72',
                                ].join(' ')}
                              >
                                <h1
                                  className={[
                                    styles.heading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1H1NthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'LARRY BRONX'}
                                </h1>
                              </div>
                            </div>
                          </li>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2,
                    'framer-7pinbo',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-1b59nf9',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1y0u9zb-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-Rl6bU framer-19okerg framer-v-19okerg',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1esthy9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <img
                              className={[
                                styles.image,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                              ].join(' ')}
                              src="/runtime-assets/caf86e93a6fad1dd972109ba.svg"
                              alt="Person 1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                        'framer-46ck4z-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-Rl6bU framer-19okerg framer-v-19okerg',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                            'framer-1esthy9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <img
                              className={[
                                styles.image,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                              ].join(' ')}
                              src="/runtime-assets/0785aa4dff830e85c33ec49a.svg"
                              alt="Person 2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3,
                        'framer-id6fne-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                          'framer-Rl6bU framer-19okerg framer-v-19okerg',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                            'framer-1esthy9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <img
                              className={[
                                styles.image,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                              ].join(' ')}
                              src="/runtime-assets/9cd6bfcc735c07aa824396bb.svg"
                              alt="Person 3"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild4,
                        'framer-f99up4',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild4PNthChild1,
                          'framer-text framer-styles-preset-wgv8vw',
                        ].join(' ')}
                      >
                        {'80+ Happy Clients'}
                      </p>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-njno9a',
                    ].join(' ')}
                  >
                    <h1
                      className={[
                        styles.heading,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1H1NthChild1,
                        'framer-text',
                      ].join(' ')}
                    >
                      {"Hi, I'm !"}
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1H1NthChild1SpanNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Larry'}
                      </span>
                    </h1>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
                      'framer-13cm7vp-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                        'framer-Qk9V0 framer-1sxvlsi framer-v-1sxvlsi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                          'framer-stvqs4',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1q3fgtw-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-AMx4a framer-Ds1Ep framer-1pu9ulj framer-v-1pu9ulj',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-7n36g7',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'UX/UI Expertise'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-gtbp3e-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-AMx4a framer-Ds1Ep framer-1pu9ulj framer-v-1pu9ulj',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-7n36g7',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'HTML5/CSS3 Mastery'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                            'framer-1m2pwun-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                              'framer-AMx4a framer-Ds1Ep framer-1pu9ulj framer-v-1pu9ulj',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                                'framer-7n36g7',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'Product Design'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                            'framer-15dl5gr-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1,
                              'framer-AMx4a framer-Ds1Ep framer-1pu9ulj framer-v-1pu9ulj',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1DivNthChild1,
                                'framer-7n36g7',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'Branding'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild5,
                            'framer-y6x0pk-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1,
                              'framer-AMx4a framer-Ds1Ep framer-1pu9ulj framer-v-1pu9ulj',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1,
                                'framer-7n36g7',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'Collaborative Team Player'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1,
                      'framer-1x8uxzw-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                        'framer-7yFNy framer-1wlt1e2 framer-v-1wlt1e2',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-pc6wc8',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-9fj8ys',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-ehm4kp',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                            'framer-1u6q9uj-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1SvgNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1SvgNthChild1PathNthChild1,
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1SvgNthChild1TextNthChild2,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1SvgNthChild1TextNthChild2TextpathNthChild1,
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                            'framer-1q31q8y-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1SvgNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1SvgNthChild1GNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1twc9fk',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1wo7n7w',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <img
                              className={[
                                styles.image,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1ImgNthChild1,
                              ].join(' ')}
                              src="/runtime-assets/97dad8b45d18fde388787f05.png"
                              alt="Profile Picture"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1,
                      'framer-savbv9-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1,
                        'framer-ha7lu framer-5UinU framer-1krwpc6 framer-v-1krwpc6 framer-1jvgwp4',
                      ].join(' ')}
                      href="/#pricing"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1,
                          'framer-91ex9m',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                            'framer-zmfqcu',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text',
                            ].join(' ')}
                          >
                            {"Let's Work Together!"}
                          </p>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                            'framer-o3hmp0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-qib4ye-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild2DivNthChild5DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3,
                    'framer-1chkqma',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                      'framer-1rbiqmn',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/3e55522768395012015a3c51.png"
                        alt="Orange Pyramid"
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild2DivNthChild1,
                      'framer-2qne85',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/39cf3391ed33a1c87541eb6b.png"
                        alt="Purple Sphere"
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild3DivNthChild1,
                      'framer-cwtr1j',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/ca2b70514b67740df3f29ab1.png"
                        alt="Blue Cylinder"
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild4DivNthChild1,
                      'framer-gfruwm',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild4DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild4DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/26db46cdc952fb6297e6c27c.png"
                        alt="Turquoise Star"
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild5DivNthChild1,
                      'framer-z3ohu7',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild5DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild5DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/b3360bf6c0a502112a9faf4d.png"
                        alt="Lime Green Object"
                      />
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild6DivNthChild1,
                      'framer-13k02wq',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild6DivNthChild1DivNthChild1,
                      ].join(' ')}
                    >
                      <img
                        className={[
                          styles.image,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild1DivNthChild2DivNthChild3DivNthChild6DivNthChild1DivNthChild1ImgNthChild1,
                        ].join(' ')}
                        src="/runtime-assets/14602f31a42a8eb69dc35884.png"
                        alt="Yellow Cube"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2,
                'framer-1t98zrv',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild1,
                  'framer-j9yo38',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild1DivNthChild1,
                    'framer-1y5qqoz',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild1DivNthChild2,
                    'framer-1vaeyyw',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild1DivNthChild3,
                    'framer-mvibsp',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2,
                  'framer-m276ll',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild1DivNthChild1,
                    'framer-5t5cko',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                    ].join(' ')}
                  >
                    <img
                      className={[
                        styles.image,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                      ].join(' ')}
                      src="/runtime-assets/4916883659a193a0c6dea3d1.png"
                      alt="Purple Cube"
                    />
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild2DivNthChild1,
                    'framer-3dcuce',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                    ].join(' ')}
                  >
                    <img
                      className={[
                        styles.image,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1ImgNthChild1,
                      ].join(' ')}
                      src="/runtime-assets/c6c4f1a37a084cacbf111716.png"
                      alt="Blue Pyramid"
                    />
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild3,
                    'framer-ss6pia',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild2DivNthChild3H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'About Me'}
                  </h2>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3,
                  'framer-1u0pjka',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1,
                    'framer-huvfll',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-xa0mm2-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-kHNbB framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-r8qnc framer-MVRAN framer-ULzk7 framer-rmcxko framer-v-rmcxko',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-da0p51',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1ybgdin',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-r7m3fp',
                            ].join(' ')}
                          >
                            {
                              "Greetings! I'm Larry, and I navigate the exciting world of web design, where every pixel serves a purpose. Combining a deep understanding of user experience with a knack for transforming ideas into visually stunning interfaces, I approach each project with a burning passion to craft something truly remarkable."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2,
                    'framer-1a2dup1',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                      'framer-10flm93-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-kHNbB framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-r8qnc framer-MVRAN framer-ULzk7 framer-rmcxko framer-v-rmcxko',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-da0p51',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1ybgdin',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-r7m3fp',
                            ].join(' ')}
                          >
                            {
                              'My web design journey began with a solid foundation in design principles, meticulously honed through years of formal education. I hold a degree in Graphic Design from XYZ University, where I not only acquired technical expertise but also developed a profound appreciation for the beautiful union of aesthetics and functionality.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3,
                    'framer-4rbx2f',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1,
                      'framer-1fkqt69-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1,
                        'framer-ha7lu framer-5UinU framer-1krwpc6 framer-v-2ijm01 framer-1jvgwp4',
                      ].join(' ')}
                      href="https://twitter.com/CristianMielu"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1,
                          'framer-91ex9m',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                            'framer-zmfqcu',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text',
                            ].join(' ')}
                          >
                            {'Read My CV'}
                          </p>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                            'framer-o3hmp0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-qib4ye-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                      'framer-1cpj5m4-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-kHNbB framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-r8qnc framer-MVRAN framer-ULzk7 framer-rmcxko framer-v-rmcxko',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-da0p51',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1ybgdin',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild2DivNthChild3DivNthChild3DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-r7m3fp',
                            ].join(' ')}
                          >
                            {
                              'My tech stack mirrors the vibrant diversity of the web itself. From the core languages of HTML5, CSS3, and JavaScript to an arsenal of design tools like Adobe Creative Suite and Sketch, I stay well-equipped. However, I believe in constantly pushing the boundaries, exploring emerging technologies and design trends to ensure my work remains both timeless and cutting-edge.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3,
                'framer-1p2zycd',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1,
                  'framer-1h6mjf2',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild1DivNthChild1,
                    'framer-9zevq2',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild1DivNthChild1H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'Kind words from Clients'}
                  </h2>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1,
                    'framer-l2w53i-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                      'framer-1nb11 framer-5amg54 framer-v-5amg54',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1fft0cr-container',
                      ].join(' ')}
                    >
                      <section
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1,
                          'framer-slideshow framer-slideshow-axis-x',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1,
                            ].join(' ')}
                            style={{ cursor: 'grab' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1,
                                'framer-1xt1cqr-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/876b52102451c505e7164f7a.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Sarah Jones'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Marketing Manager, Green Earth Solar'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      "\"Larry's design transformed our website! It's not just gorgeous, but it's incredibly user-friendly too. We've seen a huge jump in leads since launch, and customers love the easy navigation. Larry truly exceeded our expectations!\""
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1,
                                'framer-kgt6su-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/bfd24526e22b4c3ac0a66309.png"
                                        alt="David Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'David Lee'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'CEO, Technovation Inc.'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild2DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry\'s ongoing support also gives us peace of mind, knowing our website is always running smoothly."'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1,
                                'framer-rqndxw-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/732dfb4c038e6082581fddc4.png"
                                        alt="Emily Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Emily Garcia'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Founder, The Painted Palette'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild3DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"As a small business owner, I was nervous about a professional website. But Larry made the process affordable and stress-free. He guided me through everything and delivered a beautiful website that showcases my artwork perfectly. Now I can focus on my passion, knowing my online presence is in good hands thanks to Larry!"'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1,
                                'framer-1xt1cqr-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/876b52102451c505e7164f7a.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Sarah Jones'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Marketing Manager, Green Earth Solar'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild4DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      "\"Larry's design transformed our website! It's not just gorgeous, but it's incredibly user-friendly too. We've seen a huge jump in leads since launch, and customers love the easy navigation. Larry truly exceeded our expectations!\""
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1,
                                'framer-kgt6su-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/bfd24526e22b4c3ac0a66309.png"
                                        alt="David Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'David Lee'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'CEO, Technovation Inc.'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild5DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry\'s ongoing support also gives us peace of mind, knowing our website is always running smoothly."'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1,
                                'framer-rqndxw-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/732dfb4c038e6082581fddc4.png"
                                        alt="Emily Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Emily Garcia'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Founder, The Painted Palette'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild6DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"As a small business owner, I was nervous about a professional website. But Larry made the process affordable and stress-free. He guided me through everything and delivered a beautiful website that showcases my artwork perfectly. Now I can focus on my passion, knowing my online presence is in good hands thanks to Larry!"'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1,
                                'framer-1xt1cqr-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/876b52102451c505e7164f7a.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Sarah Jones'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Marketing Manager, Green Earth Solar'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild7DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      "\"Larry's design transformed our website! It's not just gorgeous, but it's incredibly user-friendly too. We've seen a huge jump in leads since launch, and customers love the easy navigation. Larry truly exceeded our expectations!\""
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1,
                                'framer-kgt6su-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/bfd24526e22b4c3ac0a66309.png"
                                        alt="David Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'David Lee'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'CEO, Technovation Inc.'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild8DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry\'s ongoing support also gives us peace of mind, knowing our website is always running smoothly."'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1,
                                'framer-rqndxw-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/732dfb4c038e6082581fddc4.png"
                                        alt="Emily Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Emily Garcia'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Founder, The Painted Palette'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild9DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"As a small business owner, I was nervous about a professional website. But Larry made the process affordable and stress-free. He guided me through everything and delivered a beautiful website that showcases my artwork perfectly. Now I can focus on my passion, knowing my online presence is in good hands thanks to Larry!"'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1,
                                'framer-1xt1cqr-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/876b52102451c505e7164f7a.png"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Sarah Jones'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Marketing Manager, Green Earth Solar'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild10DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      "\"Larry's design transformed our website! It's not just gorgeous, but it's incredibly user-friendly too. We've seen a huge jump in leads since launch, and customers love the easy navigation. Larry truly exceeded our expectations!\""
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1,
                                'framer-kgt6su-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/bfd24526e22b4c3ac0a66309.png"
                                        alt="David Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'David Lee'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'CEO, Technovation Inc.'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild11DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry\'s ongoing support also gives us peace of mind, knowing our website is always running smoothly."'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1,
                                'framer-rqndxw-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1,
                                  'framer-WDtij framer-9wI2i framer-5UinU framer-W8FY1 framer-bDL2M framer-haXsu framer-QiCi9 framer-MVRAN framer-ULzk7 framer-hyby1 framer-v-hyby1',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-tejona',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      'framer-1y2uqau',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                      ].join(' ')}
                                    >
                                      <img
                                        className={[
                                          styles.image,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                        ].join(' ')}
                                        src="/runtime-assets/732dfb4c038e6082581fddc4.png"
                                        alt="Emily Memoji Photo"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                      'framer-ds1vr1',
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                        'framer-npd45s',
                                      ].join(' ')}
                                    >
                                      <h3
                                        className={[
                                          styles.subheading,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                          'framer-text framer-styles-preset-83172e',
                                        ].join(' ')}
                                      >
                                        {'Emily Garcia'}
                                      </h3>
                                    </div>
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                        'framer-mf1rve',
                                      ].join(' ')}
                                    >
                                      <p
                                        className={[
                                          styles.body,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                          'framer-text framer-styles-preset-wgv8vw',
                                        ].join(' ')}
                                      >
                                        {'Founder, The Painted Palette'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild2,
                                    'framer-mmee4m',
                                  ].join(' ')}
                                >
                                  <p
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1DivNthChild1UlNthChild1LiNthChild12DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                      'framer-text framer-styles-preset-1bu20u5',
                                    ].join(' ')}
                                  >
                                    {
                                      '"As a small business owner, I was nervous about a professional website. But Larry made the process affordable and stress-free. He guided me through everything and delivered a beautiful website that showcases my artwork perfectly. Now I can focus on my passion, knowing my online presence is in good hands thanks to Larry!"'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2,
                            'framer--slideshow-controls',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild1,
                            ].join(' ')}
                          ></div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2,
                            ].join(' ')}
                          >
                            <button
                              className={[
                                styles.button,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild1,
                              ].join(' ')}
                              type="button"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild1DivNthChild1,
                                ].join(' ')}
                              ></div>
                            </button>
                            <button
                              className={[
                                styles.button,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild2,
                              ].join(' ')}
                              type="button"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild2DivNthChild1,
                                ].join(' ')}
                              ></div>
                            </button>
                            <button
                              className={[
                                styles.button,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild3,
                              ].join(' ')}
                              type="button"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild3DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1SectionNthChild1FieldsetNthChild2DivNthChild2ButtonNthChild3DivNthChild1,
                                ].join(' ')}
                              ></div>
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4,
                'framer-wvkvs1',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild1,
                  'framer-1pvdr9c',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild1DivNthChild1,
                    'framer-1cciwpj',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2,
                  'framer-qkzqqr',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild1,
                    'framer-ms1di8',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild1H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'My Stack'}
                  </h2>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2,
                    'framer-10iu1of',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild1,
                      'framer-xdgsxt hidden-1bcn5ap',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-7s2ife',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/dfaa96eda40a43e1cf6a2a65.png"
                          alt="Turquoise Cube"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-18xds7x-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Framer revolutionizes my web design workflow. It goes beyond a simple website builder, offering a visual playground where I can craft stunning and interactive websites without getting bogged down in complex code.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-aryam1',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-d27we',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Framer'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
                      'framer-azz0t8-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Figma is my collaborative design platform of choice. I utilize it to work seamlessly with team members and clients, facilitating real-time feedback and design iterations. Its cloud-based approach streamlines the design process.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-1pmk0td',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-tebhhg',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Figma'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1,
                      'framer-199v01q-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to project timelines is in one place.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-l85y99',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-kqopsq',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Notion'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1,
                      'framer-1e84gbx-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Airtable is my go-to solution for robust data organization. I harness its power to create structured databases, making information easily accessible and ensuring a systematic approach to handling complex datasets.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-x82bv6',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-uf4h35',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Airtable'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1,
                      'framer-bsx1o-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                "Framer serves as my go-to tool for creating interactive prototypes. I use it to bring designs to life, allowing stakeholders to experience the user flow and interactions before development begins. It's invaluable for refining the user experience."
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-1wpwlu4',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1c8csae',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Zapier'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1,
                      'framer-11lzwhy-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'LemonSqueezy stands as my comprehensive solution for managing every aspect of my SaaS business. From seamless payment processing and subscription management to global tax compliance and fraud prevention, this all-in-one platform simplifies the complexities of running a SaaS operation.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-1k3nxtk',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-8mclxw',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Lemon Squeezy'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1,
                      'framer-11560wc-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Mailchimp is my go-to for elevating outreach strategies. I utilize its features to craft engaging email campaigns, manage subscriber lists, and analyze performance data, ensuring effective and targeted communication.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-m46byg',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-12be6uj',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Mailchimp'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1,
                      'framer-1u44ys1-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Slack is the cornerstone of my collaborative workflow. It fosters a dynamic environment where teams can seamlessly exchange ideas, share files, and provide real-time feedback.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-18o21n',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-2u8zx8',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild9DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Slack'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1,
                      'framer-8iwag3-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'Adobe Creative Cloud is my comprehensive toolkit for unleashing creative potential. It offers a powerful suite of applications like Photoshop, Illustrator, and After Effects, each designed to excel in specific design tasks.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-ut9aj5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1xiwc6a',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild10DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Creative Cloud'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1,
                      'framer-1c99j63-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'ChatGPT is my content generation and assistance tool. I leverage it for content ideas, copywriting, and problem-solving. It provides invaluable insights and suggestions that enhance the quality of my projects.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-1zvqpq',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-h4be0t',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild11DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'Chat GPT'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1,
                      'framer-l1r0wx-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                'HTML5 is the backbone of my web design work. I use it to structure content, ensuring that websites are semantically meaningful and accessible. It forms the foundation upon which the visual elements of a site are built.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-2rimsv',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1q7n1qj',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild12DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'HTML'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1,
                      'framer-mv6g26-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1,
                        'framer-a7sMv framer-W8FY1 framer-bDL2M framer-9wI2i framer-haXsu framer-Ds1Ep framer-ULzk7 framer-MVRAN framer-5UinU framer-10df59w framer-v-10df59w',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1tflksa',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1efahs0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1ve8pux',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1k9uixy',
                              ].join(' ')}
                            >
                              {
                                "CSS3 is my styling and layout powerhouse. It's instrumental in creating visually appealing websites by controlling everything from fonts and colors to the responsive design that adapts to various screen sizes."
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2,
                          'framer-cedhtq',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1j9k7ha',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1v1pl5a-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                'framer-24ann framer-aryam1 framer-v-llznf',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-12hilwf',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'svgContainer',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1SvgNthChild1UseNthChild1,
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
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1caw2gc',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild4DivNthChild2DivNthChild2DivNthChild13DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                'framer-text framer-styles-preset-83172e',
                              ].join(' ')}
                            >
                              {'CSS'}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5,
                'framer-1mxi429',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild1,
                  'framer-c9gqc7',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild1DivNthChild1,
                    'framer-17a93ev',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2,
                  'framer-i9etg6',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild1,
                    'framer-3yt83f',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild1H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'Services'}
                  </h2>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2,
                    'framer-1dqwdy7',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1,
                      'framer-iu19zg hidden-1bcn5ap',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-ltbl08-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-PZXIC framer-9wI2i framer-g5aayk framer-v-g5aayk',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-wj9u1',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-1khapy0',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H3NthChild1,
                                'framer-text',
                              ].join(' ')}
                            >
                              {'01'}
                            </h3>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-9596vl',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2H3NthChild1,
                              'framer-text framer-styles-preset-83172e',
                            ].join(' ')}
                          >
                            {'Website Design & Development'}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2,
                      'framer-1m6104i',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                        'framer-e0jeob',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                          'framer-54p2cv',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                          'framer-1c0ewje',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Transform your vision into a reality. This service encompasses crafting beautiful and user-friendly websites that not only captivate visitors but also guide them towards specific actions, whether it's making a purchase, signing up for a newsletter, or contacting you. Our process involves in-depth understanding of your target audience, user experience (UX) design to ensure intuitive navigation and clear calls to action, and front-end development utilizing the latest web technologies to create a v"
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild3DivNthChild1,
                          'framer-1medp2g-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/5853b8fc75482431c573f9b6.png"
                                alt="Red Pyramid"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2,
                        'framer-cwceab',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                          'framer-tfs66r',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild2,
                          'framer-dzrd7c',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Landing pages are laser-focused on specific marketing goals. We design high-impact landing pages that grab attention, communicate your value proposition clearly, and seamlessly convert visitors into leads or paying customers. From crafting compelling headlines and captivating visuals to optimizing conversion elements like CTAs (calls to action) and lead capture forms, we ensure your landing page delivers a powerful first impression and drives results.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
                          'framer-1lmbz4b-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/5bcab767ce2e23f4000d5a54.png"
                                alt="Blue Cube"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3,
                        'framer-1lj0y2m',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
                          'framer-y5vmbb',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2,
                          'framer-1lype57',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Your online store should be a seamless shopping experience. We create user-friendly and visually appealing e-commerce websites that not only showcase your products beautifully but also make it easy for customers to browse, find what they're looking for, and complete their purchases effortlessly. We incorporate clear product information, intuitive navigation, secure payment gateways, and a streamlined checkout process to maximize sales conversions."
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3DivNthChild1,
                          'framer-xs6oek-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/0911297430ff82934aa91eb1.png"
                                alt="Green Cylinder"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4,
                        'framer-4j0p2h',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild1,
                          'framer-1s6y65y',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild2,
                          'framer-1393tzt',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Don't wait until development begins to see your website come to life. We utilize advanced prototyping tools like Framer to build interactive prototypes that simulate the final user experience. These prototypes allow you to test user flow, visualize interactions, and gather valuable feedback before any code is written. This iterative process ensures your website is on the right track from the very beginning."
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild3DivNthChild1,
                          'framer-ffuadh-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild4DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/9524af6748c9ba31170a22a7.png"
                                alt="Orange Sphere"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5,
                        'framer-1lquz1p',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1,
                          'framer-1fquskq',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild2,
                          'framer-2x3hit',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Your website needs to look great and function flawlessly across all devices, from desktop computers to tablets and smartphones. Our responsive design approach ensures your website adapts automatically to different screen sizes, delivering an optimal user experience for all visitors, regardless of their device.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild3DivNthChild1,
                          'framer-19hauiz-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/4be7c2289b56e2513a5bef8d.png"
                                alt="Purple Circle"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6,
                        'framer-1j3sc5x',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1,
                          'framer-1yvom51',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild2,
                          'framer-uwd414',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Empower yourself to easily manage your website content. We seamlessly integrate popular CMS platforms like WordPress into your website, allowing you to update content, add new pages, and manage images without needing any coding knowledge. This puts you in control of your website's content and keeps it fresh and engaging."
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild3DivNthChild1,
                          'framer-1idjgpa-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/2ae339df456c100509509479.png"
                                alt="Yellow Heart"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7,
                        'framer-1f1mc7v',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1,
                          'framer-1d2sci5',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild2,
                          'framer-xefe37',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Your website is an ongoing investment. We provide ongoing website maintenance and support services to ensure your website stays up-to-date, secure against potential threats, and functions smoothly. This includes regular software updates, security scans, performance monitoring, and troubleshooting any technical issues that may arise.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild3DivNthChild1,
                          'framer-78sci1-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/4ed5288555e7b89bf02abba2.png"
                                alt="Orange Star"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8,
                        'framer-al4pnj',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild1,
                          'framer-sm3ksp',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild2,
                          'framer-1ieadu8',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Your website should be a seamless extension of your brand. We develop a cohesive brand identity that goes beyond the website, encompassing elements like logos, color palettes, fonts, and design styles. This creates a consistent and memorable brand image across all your digital platforms, strengthening brand recognition and trust with your audience.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild3DivNthChild1,
                          'framer-1kkm8uz-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild8DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/7005524dcad896ff9952866f.png"
                                alt="Blue Gem"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9,
                        'framer-1q4glo',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild1,
                          'framer-8gu6er',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild2,
                          'framer-1nprhlz',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Get found by your target audience in search results. We incorporate basic SEO (Search Engine Optimization) best practices to improve your website's ranking in search engine results pages (SERPs) for relevant keywords. This helps potential customers discover your website organically, increasing website traffic and generating leads."
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild3DivNthChild1,
                          'framer-wbmpo2-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild9DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/c12749d52d48e718e25ea27b.png"
                                alt="Lime Green Cube"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10,
                        'framer-c8j4f6',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild1,
                          'framer-7uw7io',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild2,
                          'framer-1fphfjt',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Websites should be accessible to everyone. We conduct website accessibility audits to ensure your website adheres to WCAG (Web Content Accessibility Guidelines) standards. This makes your website usable by people with disabilities, promoting inclusivity and potentially expanding your audience reach.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild3DivNthChild1,
                          'framer-1dqf18e-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild10DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/ba9cb404234f30e2c6d2db96.png"
                                alt="Yellow Pill"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11,
                        'framer-kdrb37',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild1,
                          'framer-pyna20',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild2,
                          'framer-1vliokx',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            'Ensure design consistency across all digital platforms. We develop a design system that provides a collection of reusable components, including UI elements, design patterns, and code snippets. This streamlines the design and development process, promotes brand consistency, and empowers your team to create future digital assets that seamlessly integrate with your existing website.'
                          }
                        </p>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild3DivNthChild1,
                          'framer-1vccsr9-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild3DivNthChild1DivNthChild1,
                            'framer-VBR1P framer-v4mkyo framer-v-v4mkyo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                              'framer-18re7xq',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            >
                              <img
                                className={[
                                  styles.image,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild11DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                ].join(' ')}
                                src="/runtime-assets/85d9f323e5097a98bf158bd6.png"
                                alt="Pink Gem"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild12,
                        'framer-jj5vmw',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild12DivNthChild1,
                          'framer-31ufm2',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild12DivNthChild2,
                          'framer-unlzmn',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild12DivNthChild2PNthChild1,
                            'framer-text framer-styles-preset-r7m3fp',
                          ].join(' ')}
                        >
                          {
                            "Put your users at the center of the design process. We conduct user research and usability testing to understand your target audience's needs, preferences, and pain points. This valuable data is then used to optimize the user experience (UX) of your website, ensuring it is intuitive, user-friendly, and ultimately helps users achieve their goals."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6,
                'framer-1epcun4',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild1,
                  'framer-1qjpdtt',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild1DivNthChild1,
                    'framer-11ynaov',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2,
                  'framer-v04x93',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild1,
                    'framer-199zeuq',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild1H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'Subscription Plans'}
                  </h2>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2,
                    'framer-1p4u90a',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-1lk0cot-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-MCVDH framer-9wI2i framer-5UinU framer-Ds1Ep framer-1yoy890 framer-v-1yoy890',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-9119px',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-556uix',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H3NthChild1,
                              'framer-text framer-styles-preset-83172e',
                            ].join(' ')}
                          >
                            {'Essential Plan'}
                          </h3>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-10f2241',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-wgv8vw',
                            ].join(' ')}
                          >
                            {
                              'Perfect for simple websites, blogs, or landing pages'
                            }
                          </p>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                            'framer-62n3c1',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                              'framer-19qei8w',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1H3NthChild1,
                                'framer-text',
                              ].join(' ')}
                            >
                              {'$750'}
                            </h3>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                              'framer-1sjtyl8',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                                'framer-qlv7zo',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'/month'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                            'framer-1w0hizg-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1,
                              'framer-ha7lu framer-5UinU framer-1krwpc6 framer-v-1j9e81k framer-1jvgwp4',
                            ].join(' ')}
                            href="https://www.framer.com/pricing?via=u9kavnv&amp;dub_id=XfGQ1apyWviE8U0U"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1,
                                'framer-91ex9m',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1,
                                  'framer-zmfqcu',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Purchase Plan'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2,
                                  'framer-o3hmp0',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                                    'framer-qib4ye-container',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5,
                            'framer-1acscg4',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1,
                              'framer-ouip7t-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {
                                    'Website Design & Development (up to 5 pages)'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2,
                              'framer-16sw6sm-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Mobile-responsive design'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3,
                              'framer-59sijs-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Stock photo integration'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4,
                              'framer-s1wh3k-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Basic SEO optimization'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5,
                              'framer-12oohk0-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Contact form integration'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6,
                              'framer-1ngpqmn-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Limited content updates (1 per month)'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7,
                              'framer-xn218j-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Basic website security monitoring'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8,
                              'framer-b9dghd-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Ongoing bug fixes and maintenance'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9,
                              'framer-17x3qkg-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'24/7 email support'}
                                </p>
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-lhhn3j-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                        'framer-MCVDH framer-9wI2i framer-5UinU framer-Ds1Ep framer-1yoy890 framer-v-1yoy890',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          'framer-9119px',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-556uix',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1H3NthChild1,
                              'framer-text framer-styles-preset-83172e',
                            ].join(' ')}
                          >
                            {'Growth Plan'}
                          </h3>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-10f2241',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-wgv8vw',
                            ].join(' ')}
                          >
                            {
                              'Ideal for growing businesses and e-commerce websites'
                            }
                          </p>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                            'framer-62n3c1',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                              'framer-19qei8w',
                            ].join(' ')}
                          >
                            <h3
                              className={[
                                styles.subheading,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1H3NthChild1,
                                'framer-text',
                              ].join(' ')}
                            >
                              {'$1,200'}
                            </h3>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                              'framer-1sjtyl8',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                                'framer-qlv7zo',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1k9uixy',
                                ].join(' ')}
                              >
                                {'/month'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                            'framer-1w0hizg-container',
                          ].join(' ')}
                        >
                          <a
                            className={[
                              styles.link,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1,
                              'framer-ha7lu framer-5UinU framer-1krwpc6 framer-v-1j9e81k framer-1jvgwp4',
                            ].join(' ')}
                            href="https://www.framer.com/pricing?via=u9kavnv&amp;dub_id=XfGQ1apyWviE8U0U"
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1,
                                'framer-91ex9m',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1,
                                  'framer-zmfqcu',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text',
                                  ].join(' ')}
                                >
                                  {'Purchase Plan'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2,
                                  'framer-o3hmp0',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                                    'framer-qib4ye-container',
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                    ].join(' ')}
                                  >
                                    <div
                                      className={[
                                        styles.surface,
                                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                      ].join(' ')}
                                    >
                                      <div
                                        className={[
                                          styles.surface,
                                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                        ].join(' ')}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5,
                            'framer-1acscg4',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1,
                              'framer-ouip7t-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Everything in the Essential Plan'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2,
                              'framer-16sw6sm-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {
                                    'Website Design & Development (up to 5 pages)'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3,
                              'framer-59sijs-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild3DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Custom graphic design elements'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4,
                              'framer-s1wh3k-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild4DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {
                                    'Content Management System (CMS) access for basic content updates'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5,
                              'framer-12oohk0-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild5DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'E-commerce functionality (optional add-on)'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6,
                              'framer-1ngpqmn-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild6DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Advanced SEO optimization (ongoing)'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7,
                              'framer-xn218j-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild7DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Google Analytics integration and reporting'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8,
                              'framer-b9dghd-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild8DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {
                                    'Unlimited content updates within a monthly allowance'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9,
                              'framer-17x3qkg-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1,
                                'framer-SFNrg framer-nSBJJ framer-am0v2b framer-v-am0v2b',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild1,
                                  'framer-14y3z1w',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-9sky9i',
                                  ].join(' ')}
                                ></div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild2,
                                  'framer-1ceb3ns',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5DivNthChild9DivNthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-7uxmog',
                                  ].join(' ')}
                                >
                                  {'Priority email and phone support'}
                                </p>
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
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3,
                    'framer-5o3dd0',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild1,
                      'framer-1ro8itf',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                        'framer-sd06nc',
                      ].join(' ')}
                    >
                      <h3
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1H3NthChild1,
                          'framer-text framer-styles-preset-83172e',
                        ].join(' ')}
                      >
                        {'Need something more?'}
                      </h3>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1,
                        'framer-awn4br',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild1DivNthChild2DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-r7m3fp',
                        ].join(' ')}
                      >
                        {
                          "We craft custom plans to fit your website's specific needs. Contact us for a quote!"
                        }
                      </p>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1,
                      'framer-191qwsx-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1,
                        'framer-ha7lu framer-5UinU framer-1krwpc6 framer-v-2ijm01 framer-1jvgwp4',
                      ].join(' ')}
                      href="https://calendly.com/"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                          'framer-91ex9m',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                            'framer-zmfqcu',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text',
                            ].join(' ')}
                          >
                            {'Book a Call'}
                          </p>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                            'framer-o3hmp0',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-qib4ye-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild6DivNthChild2DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7,
                'framer-9ban57',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild1,
                  'framer-17ny4dd',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild1DivNthChild1,
                    'framer-l2b38i',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2,
                  'framer-1ixasel',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild1,
                    'framer-1peg05k',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild1H2NthChild1,
                      'framer-text framer-styles-preset-q2ybry',
                    ].join(' ')}
                  >
                    {'Projects'}
                  </h2>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1,
                    'framer-83qiao-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-zQAR2 framer-gk4f16 framer-v-gk4f16',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-regu0z',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/vitalo-personal-training-coaching-framer-template"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/6c820c2de2b1a36575b4993c.png"
                                    alt="Vitalo Framer template"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {
                                  'Vitalo - Personal training & coaching Framer template'
                                }
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/artikle-membership-framer-template"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/986c3356b19c76ff7fc1c6f7.png"
                                    alt="Artikle screen"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {'Artikle - Membership Framer Template'}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/flowpath-ai-automation-template"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/61d4e1303de824c88c2d8c56.png"
                                    alt="Flowpath screen"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {'Flowpath - AI Automation Template'}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/kudos-design-agency-website"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/7dd3de5154355ea3089f1fa0.png"
                                    alt="Kudos screen"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {'Kudos - Design Agency Website'}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/neozen-portfolio-framer-template"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/09436dc12aa30dd71f81aa74.png"
                                    alt="Neozen"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild5ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {'Neozen - Portfolio Framer Template'}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6,
                          'framer-16dzdnl-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1,
                            'framer-McYut framer-5UinU framer-9wI2i framer-1sbzqzw framer-v-1sbzqzw framer-1wub1od',
                          ].join(' ')}
                          href="/aerosound-e-commerce-website"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1,
                              'framer-10700vr',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1,
                                'framer-4cm9l2',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-x53s9d',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/7086f6ed58620971629d3081.png"
                                    alt="Aerosound 01"
                                  />
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1rhnpn',
                                ].join(' ')}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2,
                              'framer-5u8gwp',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild1,
                                'framer-ozxvie',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1u340sx',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-wgv8vw',
                                  ].join(' ')}
                                >
                                  {'Web Design'}
                                </p>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild2,
                                'framer-u33cma',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild6ANthChild1DivNthChild2DivNthChild2H3NthChild1,
                                  'framer-text framer-styles-preset-83172e',
                                ].join(' ')}
                              >
                                {'Aerosound - E-Commerce Website'}
                              </h3>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                        'framer-tl3qz6-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-LBHoj framer-82etxf framer-v-82etxf',
                        ].join(' ')}
                        style={{ cursor: 'pointer' }}
                      >
                        <button
                          className={[
                            styles.button,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1,
                            'framer-1td5z4j',
                          ].join(' ')}
                          type="button"
                          style={{ cursor: 'default' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild1,
                              'framer-niw3ox',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild1PNthChild1,
                                'framer-text',
                              ].join(' ')}
                            >
                              {'View More'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild2,
                              'framer-16p78wo',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild2DivNthChild1,
                                'framer-1ff87g3-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1,
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3MainNthChild2SectionNthChild7DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ButtonNthChild1DivNthChild2DivNthChild1DivNthChild1SvgNthChild1GNthChild1PathNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild3DivNthChild3,
              'framer-1qugcr0',
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6,
              'framer-1pziv5h',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild1,
                'framer-1hnaowi',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild1DivNthChild1,
                  'framer-128ejp2',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild1DivNthChild1SvgNthChild1,
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild1DivNthChild1SvgNthChild1ForeignobjectNthChild1,
                    ].join(' ')}
                  >
                    <p
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild1DivNthChild1SvgNthChild1ForeignobjectNthChild1PNthChild1,
                        'framer-text',
                      ].join(' ')}
                    >
                      {'COHESION'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1,
                'framer-nieymo-container',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1,
                  'framer-9gGNb framer-MVRAN framer-tw0xmm framer-v-tw0xmm',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                    'framer-pswye5',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-1aincug',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1tiq13s',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1H2NthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Contact Me'}
                      </h2>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-cy1eby',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-1gispp9-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1kpnxgi framer-9bxnm3',
                          ].join(' ')}
                          href="https://calendly.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Book a Call'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Book a Call'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                          'framer-f5skij-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1kpnxgi framer-9bxnm3',
                          ].join(' ')}
                          href="mailto: mielucristian@gmail.com"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'mielucristian@gmail.com'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'mielucristian@gmail.com'}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                      'framer-ye9sj2',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        'framer-1fo7mmq',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H2NthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Useful Links'}
                      </h2>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                        'framer-x4xb7y',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                          'framer-1w8wbr5-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                          ].join(' ')}
                          href="/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Home'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Home'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                          'framer-3iz47r-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                          ].join(' ')}
                          href="/404"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'404 Page'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'404 Page'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3,
                          'framer-1gxc3u1-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                          ].join(' ')}
                          href="/licensing"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Licensing'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Licensing'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4,
                          'framer-3pzbu5-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                          ].join(' ')}
                          href="https://github.com/mielucristian/cohesion-documentation"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Documentation'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Documentation'}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                      'framer-zrbqpn',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                        'framer-j9o27a',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1H2NthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Social'}
                      </h2>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                        'framer-1qfua7i',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                          'framer-1kokprq-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1kpnxgi framer-9bxnm3',
                          ].join(' ')}
                          href="https://framer.link/UdEP7eA"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Framer'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'Framer'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2,
                          'framer-81rt20-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1kpnxgi framer-9bxnm3',
                          ].join(' ')}
                          href="https://twitter.com/CristianMielu"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'X (Twitter)'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild2ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'X (Twitter)'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3,
                          'framer-1m45p39-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3ANthChild1,
                            'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1kpnxgi framer-9bxnm3',
                          ].join(' ')}
                          href="https://www.linkedin.com/in/cristian-mielu-a8b2b3b5/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3ANthChild1DivNthChild1,
                              'framer-mgdf4g',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'LinkedIn'}
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3ANthChild1DivNthChild2,
                              'framer-15mvj5a',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild3ANthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-1xu6iaq',
                              ].join(' ')}
                            >
                              {'LinkedIn'}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4,
                      'framer-10fz5i',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1,
                        'framer-2libwh',
                      ].join(' ')}
                    >
                      <h2
                        className={[
                          styles.subheading,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild1H2NthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Legal'}
                      </h2>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2,
                        'framer-167dbcj',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1,
                          'framer-wd6inn',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1,
                            'framer-1hrzhvk',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                              'framer-nmy99u-container',
                            ].join(' ')}
                          >
                            <a
                              className={[
                                styles.link,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1,
                                'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                              ].join(' ')}
                              href="/legal/privacy-policy"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                                  'framer-mgdf4g',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-1xu6iaq',
                                  ].join(' ')}
                                >
                                  {'Privacy Policy'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2,
                                  'framer-15mvj5a',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild1DivNthChild1ANthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-1xu6iaq',
                                  ].join(' ')}
                                >
                                  {'Privacy Policy'}
                                </p>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2,
                            'framer-1hrzhvk',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1,
                              'framer-nmy99u-container',
                            ].join(' ')}
                          >
                            <a
                              className={[
                                styles.link,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1ANthChild1,
                                'framer-XCEYT framer-5UinU framer-NAtbd framer-1obz251 framer-v-1yeqc4 framer-9bxnm3',
                              ].join(' ')}
                              href="/legal/cookie-policy"
                              style={{ cursor: 'pointer' }}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                                  'framer-mgdf4g',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-1xu6iaq',
                                  ].join(' ')}
                                >
                                  {'Cookie Policy'}
                                </p>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                                  'framer-15mvj5a',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild4DivNthChild2DivNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild2PNthChild1,
                                    'framer-text framer-styles-preset-1xu6iaq',
                                  ].join(' ')}
                                >
                                  {'Cookie Policy'}
                                </p>
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
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                    'framer-yf4jb4',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                      'framer-1nk1eeh',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        'framer-d069js',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'© Copyright'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                        'framer-1frwdaa-container',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                        ].join(' ')}
                      >
                        {'2026'}
                      </p>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                      'framer-1ea21wl',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                        'framer-w83gm1',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Made by'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                        'framer-1w6j9of',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2PNthChild1ANthChild1,
                            'framer-text framer-styles-preset-9oicj0',
                          ].join(' ')}
                          href="https://www.uihub.design/"
                          style={{ cursor: 'pointer' }}
                        >
                          {'UIhub.design'}
                        </a>
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3,
                        'framer-1fcdgtk',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild3PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'in'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4,
                        'framer-196oxkm',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2FooterNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild4PNthChild1ANthChild1,
                            'framer-text framer-styles-preset-9oicj0',
                          ].join(' ')}
                          href="https://framer.link/cristianmielu"
                          style={{ cursor: 'pointer' }}
                        >
                          {'Framer'}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7,
              'framer-1swg9it-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1,
                'framer-mwe28 framer-3jonek framer-v-3jonek',
              ].join(' ')}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1,
                  'framer-h5sihb',
                ].join(' ')}
              >
                <img
                  className={[
                    styles.image,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild1ImgNthChild1,
                    'framer-VDD6G framer-1mgalnh',
                  ].join(' ')}
                  src='data:image/svg+xml,&lt;svg display="block" role="presentation" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"&gt;&lt;path d="M 24.635 22.866 C 25.123 23.355 25.123 24.147 24.635 24.635 C 24.147 25.123 23.355 25.123 22.866 24.635 L 12.501 14.268 L 2.135 24.635 C 1.647 25.123 0.855 25.123 0.366 24.635 C -0.122 24.147 -0.122 23.355 0.366 22.866 L 10.734 12.501 L 0.366 2.135 C -0.122 1.647 -0.122 0.855 0.366 0.366 C 0.855 -0.122 1.647 -0.122 2.135 0.366 L 12.501 10.734 L 22.866 0.366 C 23.355 -0.122 24.147 -0.122 24.635 0.366 C 25.123 0.855 25.123 1.647 24.635 2.135 L 14.268 12.501 Z" fill="rgb(0, 0, 0)" height="25.00139023844741px" id="jBymG44fK" transform="translate(7.499 7.499)" width="25.001390238447406px"/&gt;&lt;/svg&gt;'
                  alt=""
                />
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1DivNthChild2,
                  'framer-owke0e',
                ].join(' ')}
              ></div>
              <button
                className={[
                  styles.button,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3,
                  'framer-1bk6z3r',
                ].join(' ')}
                type="button"
                style={{ cursor: 'default' }}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild1,
                    'framer-vhd1ra',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild2,
                    'framer-4viib6',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild2DivNthChild1,
                    ].join(' ')}
                  >
                    <img
                      className={[
                        styles.image,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild2DivNthChild1ImgNthChild1,
                      ].join(' ')}
                      src="/runtime-assets/5f78b9e34e5ffff03c5cd6b8.png"
                      alt="Quomi Screen on a desktop"
                    />
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3,
                    'framer-ha25vu-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1,
                      'framer-CGnl2 framer-17hbuz3 framer-v-17hbuz3 framer-77v7ut',
                    ].join(' ')}
                    href="https://framer.link/SW15EBF"
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1DivNthChild1,
                        'framer-a0dpa3',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1DivNthChild1PNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        {'Free Remix'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1DivNthChild2,
                        'framer-8rr2m1',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                          'framer-z6d1fl',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild7DivNthChild1ButtonNthChild3DivNthChild3ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                            'framer-Berk6 framer-18o3ac6',
                          ].join(' ')}
                        ></div>
                      </div>
                    </div>
                  </a>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={[styles.surface, styles.nodeBodyNthChild2DivNthChild5].join(
          ' ',
        )}
      >
        <a
          className={[
            styles.link,
            styles.nodeBodyNthChild2DivNthChild5ANthChild1,
            'framer-6jWyo framer-n0ccwk framer-v-n0ccwk framer-bmpgw8 __framer-badge',
          ].join(' ')}
          href="https://www.framer.com/"
          style={{ cursor: 'pointer' }}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild1,
              'framer-13yxzio',
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild2,
              'framer-19yaanm',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild1,
                'framer-1kflzx5',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild1DivNthChild1,
                  'framer-hcsc7 framer-e50co',
                ].join(' ')}
              ></div>
            </div>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild2DivNthChild3,
                'framer-g7oZR framer-1um7t9d',
              ].join(' ')}
            ></div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild3,
              'framer-j4ugry',
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild5ANthChild1DivNthChild4,
              'framer-jnuwbw',
            ].join(' ')}
          ></div>
        </a>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild1,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild1PathNthChild1,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild2,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild2PathNthChild1,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild2PathNthChild2,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild2PathNthChild3,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild2PathNthChild4,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild2PathNthChild5,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild3,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild3PathNthChild1,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild4,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild4GNthChild1,
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild4GNthChild1PathNthChild1,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild4GNthChild1PathNthChild2,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild4GNthChild1PathNthChild3,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild4GNthChild1PathNthChild4,
            ].join(' ')}
          ></div>
        </div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild5,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild5PathNthChild1,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild6,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild6RectNthChild1,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild6PathNthChild2,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild7,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild7GNthChild1,
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild7GNthChild1PathNthChild1,
            ].join(' ')}
          ></div>
        </div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild8,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild8GNthChild1,
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild8GNthChild1PathNthChild1,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild8GNthChild1PathNthChild2,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild8GNthChild1PathNthChild3,
            ].join(' ')}
          ></div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild8GNthChild1PathNthChild4,
            ].join(' ')}
          ></div>
        </div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild9,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild9GNthChild1,
          ].join(' ')}
        >
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild28SvgNthChild9GNthChild1GNthChild2,
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild28SvgNthChild9GNthChild1GNthChild2PathNthChild1,
              ].join(' ')}
            ></div>
          </div>
        </div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild10,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild10PathNthChild1,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild11,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild11PathNthChild1,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild11PathNthChild2,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild11PathNthChild3,
          ].join(' ')}
        ></div>
      </div>
      <div
        className={[
          styles.surface,
          styles.nodeBodyNthChild2DivNthChild28SvgNthChild12,
        ].join(' ')}
      >
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild1,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild2,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild3,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild4,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild5,
          ].join(' ')}
        ></div>
        <div
          className={[
            styles.surface,
            styles.nodeBodyNthChild2DivNthChild28SvgNthChild12PathNthChild6,
          ].join(' ')}
        ></div>
      </div>
    </main>
  )
}
