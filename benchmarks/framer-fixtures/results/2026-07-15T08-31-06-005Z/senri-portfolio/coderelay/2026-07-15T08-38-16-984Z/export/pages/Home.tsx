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
      data-coderelay-source="https://td-senrifolio.framer.ai/"
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
            'framer-T4TuJ framer-1v5b8uz',
          ].join(' ')}
        >
          <main
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1,
              'framer-xh12c',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild1,
                'framer-wbwiok-container',
              ].join(' ')}
            ></div>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2,
                'framer-akxvzm',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild1,
                  'framer-1eyeg3j hidden-u4nwxj',
                ].join(' ')}
              ></div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2,
                  'framer-clskef',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1,
                    'framer-1s56xdj-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-bXxo0 framer-zhl9a framer-1i2d1zb framer-v-1i2d1zb',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-152fg4y',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-1rcsw05',
                        ].join(' ')}
                      >
                        {'Florida'}
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                        'framer-45r1b7-container',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                        ].join(' ')}
                      >
                        {'9:38:23 AM'}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild2,
                    'framer-14c32by',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-q475tm',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                        'framer-XegAV framer-4v34yr',
                      ].join(' ')}
                    ></div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild2DivNthChild2,
                      'framer-3gjjwv',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                        'framer-XegAV framer-2lsvti',
                      ].join(' ')}
                    ></div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3,
                    'framer-jqfw34',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1,
                      'framer-z9gs1j',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1,
                        'framer-text framer-styles-preset-1rcsw05',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1,
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          {'O'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          {'u'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild3,
                          ].join(' ')}
                        >
                          {'t'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild4,
                          ].join(' ')}
                        >
                          {'p'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild5,
                          ].join(' ')}
                        >
                          {'u'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild1PNthChild1SpanNthChild1SpanNthChild6,
                          ].join(' ')}
                        >
                          {'t'}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2,
                      'framer-14s23mr',
                    ].join(' ')}
                  >
                    <h1
                      className={[
                        styles.heading,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1,
                        'framer-text framer-styles-preset-wt9w29',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1,
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          {'V'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          {'i'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild3,
                          ].join(' ')}
                        >
                          {'s'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild4,
                          ].join(' ')}
                        >
                          {'u'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild5,
                          ].join(' ')}
                        >
                          {'a'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild1SpanNthChild6,
                          ].join(' ')}
                        >
                          {'l'}
                        </span>
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2,
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild1,
                          ].join(' ')}
                        >
                          {'d'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild2,
                          ].join(' ')}
                        >
                          {'e'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild3,
                          ].join(' ')}
                        >
                          {'s'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild4,
                          ].join(' ')}
                        >
                          {'i'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild5,
                          ].join(' ')}
                        >
                          {'g'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild6,
                          ].join(' ')}
                        >
                          {'n'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild7,
                          ].join(' ')}
                        >
                          {'e'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild2SpanNthChild8,
                          ].join(' ')}
                        >
                          {'r'}
                        </span>
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4,
                          'framer-text',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild1,
                            ].join(' ')}
                          >
                            {'D'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild2,
                            ].join(' ')}
                          >
                            {'i'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild3,
                            ].join(' ')}
                          >
                            {'g'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild4,
                            ].join(' ')}
                          >
                            {'i'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild5,
                            ].join(' ')}
                          >
                            {'t'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild6,
                            ].join(' ')}
                          >
                            {'a'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild1SpanNthChild7,
                            ].join(' ')}
                          >
                            {'l'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild1,
                            ].join(' ')}
                          >
                            {'p'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild2,
                            ].join(' ')}
                          >
                            {'r'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild3,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild4,
                            ].join(' ')}
                          >
                            {'d'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild5,
                            ].join(' ')}
                          >
                            {'u'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild6,
                            ].join(' ')}
                          >
                            {'c'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild7,
                            ].join(' ')}
                          >
                            {'t'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild2SpanNthChild8,
                            ].join(' ')}
                          >
                            {'s'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild3,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild3SpanNthChild1,
                            ].join(' ')}
                          >
                            {'a'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild3SpanNthChild2,
                            ].join(' ')}
                          >
                            {'n'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild3SpanNthChild3,
                            ].join(' ')}
                          >
                            {'d'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild1,
                            ].join(' ')}
                          >
                            {'s'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild2,
                            ].join(' ')}
                          >
                            {'y'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild3,
                            ].join(' ')}
                          >
                            {'s'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild4,
                            ].join(' ')}
                          >
                            {'t'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild5,
                            ].join(' ')}
                          >
                            {'e'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild6,
                            ].join(' ')}
                          >
                            {'m'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild3DivNthChild2H1NthChild1SpanNthChild4SpanNthChild4SpanNthChild7,
                            ].join(' ')}
                          >
                            {'s'}
                          </span>
                        </span>
                      </span>
                    </h1>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild2DivNthChild4,
                    'framer-Pt77j framer-15m0wvv',
                  ].join(' ')}
                ></div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild3,
                  'framer-12sw7qg-container',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild3DivNthChild1DivNthChild1,
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                    ].join(' ')}
                  ></div>
                </div>
              </div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3,
                'framer-1aiekn5',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1,
                  'framer-1882cka',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1,
                    'framer-1rlsxci-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-z6KGa framer-1hoaa framer-spg0ko framer-v-spg0ko',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-ntaz9m',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-XegAV framer-1fqraql',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-e8qwxv',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'Intro'}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2,
                    'framer-1o3tve5',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1,
                      'framer-text framer-styles-preset-wt9w29',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild1,
                      ].join(' ')}
                    >
                      {'I'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild2,
                      ].join(' ')}
                    >
                      {'work'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild3,
                      ].join(' ')}
                    >
                      {'with'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild4,
                      ].join(' ')}
                    >
                      {'founders'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild5,
                      ].join(' ')}
                    >
                      {'and'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild6,
                      ].join(' ')}
                    >
                      {'teams'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild7,
                      ].join(' ')}
                    >
                      {'to'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9,
                        'framer-text',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild1,
                        ].join(' ')}
                      >
                        {'translate'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild2,
                        ].join(' ')}
                      >
                        {'complex'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild3,
                        ].join(' ')}
                      >
                        {'ideas'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild4,
                        ].join(' ')}
                      >
                        {'into'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild5,
                        ].join(' ')}
                      >
                        {'brand'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild6,
                        ].join(' ')}
                      >
                        {'systems'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild7,
                        ].join(' ')}
                      >
                        {'that'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild8,
                        ].join(' ')}
                      >
                        {'bring'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild9SpanNthChild9,
                        ].join(' ')}
                      >
                        {'clarity,'}
                      </span>
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild10,
                      ].join(' ')}
                    >
                      {'structure,'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild11,
                      ].join(' ')}
                    >
                      {'and'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild12,
                      ].join(' ')}
                    >
                      {'coherence'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild13,
                      ].join(' ')}
                    >
                      {'to'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild14,
                      ].join(' ')}
                    >
                      {'growing'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild15,
                      ].join(' ')}
                    >
                      {'products'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild16,
                      ].join(' ')}
                    >
                      {'and'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild1DivNthChild2H2NthChild1SpanNthChild17,
                      ].join(' ')}
                    >
                      {'organizations.'}
                    </span>
                  </h2>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2,
                  'framer-ndicno',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild1,
                    'framer-ejpzi9 hidden-cp7t73 hidden-u4nwxj',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2,
                    'framer-16j3foi',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-19fslzd-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-RKFsz framer-KLyLi framer-zhl9a framer-ywdgjx framer-v-ywdgjx',
                      ].join(' ')}
                      style={{ cursor: 'default' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-tcwyms',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1h9eap1-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1tzh84d',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-19mzf75',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                              'framer-text framer-styles-preset-1ilrpiv',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'S'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild8,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                            </span>
                          </h3>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-6fm5jh',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'C'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild7,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild8,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild9,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild6,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild7,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild8,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild4,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild6,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild4,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild1,
                                ].join(' ')}
                              >
                                {'I'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild1,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild3,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild4,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild4,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild1,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild3,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild4,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild5,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild6,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild1,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild2,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild4,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild5,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild6,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild7,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild8,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild9,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild10,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild1,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild2,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild3,
                                ].join(' ')}
                              >
                                {'k'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild4,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild1,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild3,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild4,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild5,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild6,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild7,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild8,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild1,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild3,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild4,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild6,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild7,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild8,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild9,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild10,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild2,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild3,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild4,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild5,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild2,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild3,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild4,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild5,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild6,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild2,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild4,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild6,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25SpanNthChild1,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25SpanNthChild3,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25SpanNthChild4,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild25SpanNthChild5,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild26,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild26SpanNthChild1,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild26SpanNthChild2,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27SpanNthChild1,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27SpanNthChild2,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27SpanNthChild3,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27SpanNthChild4,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild27SpanNthChild5,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                          'framer-1scteor',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-j26iol-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Positioning'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                            'framer-tt0ss4-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Direction'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild3,
                            'framer-g69egv-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Alignment'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild2,
                      'framer-qkebj5',
                    ].join(' ')}
                  ></div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1,
                      'framer-2vsdu8-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                        'framer-RKFsz framer-KLyLi framer-zhl9a framer-ywdgjx framer-v-ywdgjx',
                      ].join(' ')}
                      style={{ cursor: 'default' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                          'framer-tcwyms',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1h9eap1-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1tzh84d',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-19mzf75',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                              'framer-text framer-styles-preset-1ilrpiv',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'I'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild8,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                            </span>
                          </h3>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-6fm5jh',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'S'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                ].join(' ')}
                              >
                                {'k'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild6,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild4,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild5,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild7,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild5,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild6,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild7,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild4,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild6,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild7,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild8,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild9,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild10,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild11,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild12,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                ].join(' ')}
                              >
                                {'F'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild4,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild2,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild3,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild4,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild5,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild6,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild7,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild8,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild9,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild10,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild1,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild2,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild3,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild4,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild5,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild6,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild1,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild2,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild3,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild4,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild5,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild6,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild7,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild8,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild1,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild3,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild4,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild1,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild3,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild4,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild5,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild7,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild8,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild9,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild10,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild11,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild12,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild1,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild2,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild3,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild4,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild5,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild6,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild7,
                                ].join(' ')}
                              >
                                {'h'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild8,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild9,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild10,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild1,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild4,
                                ].join(' ')}
                              >
                                {'k'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild21SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild22SpanNthChild2,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23SpanNthChild1,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild23SpanNthChild3,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild2,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild3,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild6,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild24SpanNthChild7,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3,
                          'framer-1scteor',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-j26iol-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Typography'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                            'framer-tt0ss4-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Visuality'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild3,
                            'framer-g69egv-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Voice'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild4,
                            'framer-hy6emr-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Consistency'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild4,
                      'framer-1dmb25s',
                    ].join(' ')}
                  ></div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1,
                      'framer-gin4bd-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1,
                        'framer-RKFsz framer-KLyLi framer-zhl9a framer-ywdgjx framer-v-ywdgjx',
                      ].join(' ')}
                      style={{ cursor: 'default' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                          'framer-tcwyms',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1h9eap1-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1tzh84d',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-19mzf75',
                          ].join(' ')}
                        >
                          <h3
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                              'framer-text framer-styles-preset-1ilrpiv',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'D'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                            </span>
                          </h3>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-6fm5jh',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                {'D'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                {'g'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild7,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild4,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild5,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                ].join(' ')}
                              >
                                {'w'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild6,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild7,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild8,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild9,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild6,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild7,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild8,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild9,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild10,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild4,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild5,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild6,
                                ].join(' ')}
                              >
                                {'f'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild7,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild8,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild9,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild10,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild4,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild5,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild6,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild7,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild8,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild9,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild10,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild6,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild7,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild8,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                ].join(' ')}
                              >
                                {'F'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild4,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild6,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild7,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild1,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild1,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild2,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild4,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild5,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild6,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild7,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild13SpanNthChild8,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild1,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild2,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild4,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild5,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild6,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild7,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild8,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild9,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild14SpanNthChild10,
                                ].join(' ')}
                              >
                                {','}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild15SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild1,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild2,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild3,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild4,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild5,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild6,
                                ].join(' ')}
                              >
                                {'b'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild7,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild8,
                                ].join(' ')}
                              >
                                {'l'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild9,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild10,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild16SpanNthChild11,
                                ].join(' ')}
                              >
                                {'y'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild2,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild3,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild4,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild5,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild17SpanNthChild6,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild1,
                                ].join(' ')}
                              >
                                {'p'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild2,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild3,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild4,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild5,
                                ].join(' ')}
                              >
                                {'u'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild6,
                                ].join(' ')}
                              >
                                {'c'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild7,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild18SpanNthChild8,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild1,
                                ].join(' ')}
                              >
                                {'a'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild19SpanNthChild3,
                                ].join(' ')}
                              >
                                {'d'}
                              </span>
                            </span>
                            <span
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20,
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild1,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild2,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild3,
                                ].join(' ')}
                              >
                                {'v'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild4,
                                ].join(' ')}
                              >
                                {'i'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild5,
                                ].join(' ')}
                              >
                                {'r'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild6,
                                ].join(' ')}
                              >
                                {'o'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild7,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild8,
                                ].join(' ')}
                              >
                                {'m'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild9,
                                ].join(' ')}
                              >
                                {'e'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild10,
                                ].join(' ')}
                              >
                                {'n'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild11,
                                ].join(' ')}
                              >
                                {'t'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild12,
                                ].join(' ')}
                              >
                                {'s'}
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild20SpanNthChild13,
                                ].join(' ')}
                              >
                                {'.'}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3,
                          'framer-1scteor',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-j26iol-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Architecture'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                            'framer-tt0ss4-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Interaction'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild2DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild3,
                            'framer-g69egv-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Systems'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild3DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild4,
                            'framer-hy6emr-container',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1,
                              'framer-TzMEW framer-zhl9a framer-zk9yd0 framer-v-zk9yd0',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild1,
                                'framer-1dt3cmt',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild1PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                {'Performance'}
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild3DivNthChild2DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild3DivNthChild4DivNthChild1DivNthChild2,
                                'framer-1t6t4q4',
                              ].join(' ')}
                            ></div>
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
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4,
                'framer-1ibw8pb',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1,
                  'framer-1q39uu6-container',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1,
                    'framer-G2UWh framer-kSDwE framer-b15iu8 framer-v-b15iu8',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-szfrov-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-CdeHP framer-1hoaa framer-1mar70i framer-v-1mar70i',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-111j3sz',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1hl8otd',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-jth0tn',
                            ].join(' ')}
                          >
                            {'Play showreel'}
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-nh9IB framer-1k802pg',
                        ].join(' ')}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                      'framer-ylbgwa',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        'framer-5wv0zc-container',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          ].join(' ')}
                        ></div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                        'framer-mcbcdw',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/341a0be696ebec3962815e53.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                      'framer-13udeja',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                        'framer-Pt77j framer-1x74d3o',
                      ].join(' ')}
                    ></div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2,
                        'framer-kavjq5',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2PNthChild1,
                          'framer-text framer-styles-preset-1f1e98f',
                        ].join(' ')}
                      >
                        {'20'}
                      </p>
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild2PNthChild2,
                          'framer-text framer-styles-preset-1f1e98f',
                        ].join(' ')}
                      >
                        {'25'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild4DivNthChild2,
                  'framer-xauxj8',
                ].join(' ')}
              ></div>
            </section>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5,
                'framer-9g9vul',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1,
                  'framer-ubag3r',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1,
                    'framer-1vybzc1-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-z6KGa framer-1hoaa framer-spg0ko framer-v-spg0ko',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-ntaz9m',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-XegAV framer-1fqraql',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-e8qwxv',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'Projects'}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2,
                    'framer-cpbcm8',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1,
                      'framer-13jg6xr',
                    ].join(' ')}
                  >
                    <h2
                      className={[
                        styles.subheading,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1,
                        'framer-text framer-styles-preset-wt9w29',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1,
                          'framer-text',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild1SpanNthChild1,
                            ].join(' ')}
                          >
                            {'S'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild1SpanNthChild2,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild1SpanNthChild3,
                            ].join(' ')}
                          >
                            {'m'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild1SpanNthChild4,
                            ].join(' ')}
                          >
                            {'e'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild2SpanNthChild1,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild2SpanNthChild2,
                            ].join(' ')}
                          >
                            {'f'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild3,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild3SpanNthChild1,
                            ].join(' ')}
                          >
                            {'m'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild1SpanNthChild3SpanNthChild2,
                            ].join(' ')}
                          >
                            {'y'}
                          </span>
                        </span>
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3,
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild1,
                          ].join(' ')}
                        >
                          {'r'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild2,
                          ].join(' ')}
                        >
                          {'e'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild3,
                          ].join(' ')}
                        >
                          {'c'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild4,
                          ].join(' ')}
                        >
                          {'e'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild5,
                          ].join(' ')}
                        >
                          {'n'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild3SpanNthChild6,
                          ].join(' ')}
                        >
                          {'t'}
                        </span>
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild4,
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild4SpanNthChild1,
                          ].join(' ')}
                        >
                          {'w'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild4SpanNthChild2,
                          ].join(' ')}
                        >
                          {'o'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild4SpanNthChild3,
                          ].join(' ')}
                        >
                          {'r'}
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild1H2NthChild1SpanNthChild4SpanNthChild4,
                          ].join(' ')}
                        >
                          {'k'}
                        </span>
                      </span>
                    </h2>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2,
                      'framer-14k391w',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                        'framer-13npgwa',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-1rcsw05',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1SpanNthChild1,
                            ].join(' ')}
                          >
                            {'('}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1SpanNthChild2,
                            ].join(' ')}
                          >
                            {'2'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1SpanNthChild3,
                            ].join(' ')}
                          >
                            {'0'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1SpanNthChild4,
                            ].join(' ')}
                          >
                            {'2'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild1SpanNthChild5,
                            ].join(' ')}
                          >
                            {'3'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild2,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild2SpanNthChild1,
                            ].join(' ')}
                          >
                            {'—'}
                          </span>
                        </span>
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3SpanNthChild1,
                            ].join(' ')}
                          >
                            {'2'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3SpanNthChild2,
                            ].join(' ')}
                          >
                            {'0'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3SpanNthChild3,
                            ].join(' ')}
                          >
                            {'2'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3SpanNthChild4,
                            ].join(' ')}
                          >
                            {'5'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild1DivNthChild2DivNthChild2DivNthChild1PNthChild1SpanNthChild3SpanNthChild5,
                            ].join(' ')}
                          >
                            {')'}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2,
                  'framer-bj3umn',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild1,
                    'framer-z78hqx hidden-cp7t73 hidden-u4nwxj',
                  ].join(' ')}
                ></div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2,
                    'framer-k0exon',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1,
                      'framer-11ow4w1',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                        'framer-1oj48er framer-lux5qc',
                      ].join(' ')}
                      href="/work/hud"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                          'framer-u6rput-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-2EvUQ framer-1hoaa framer-zhl9a framer-jcbhed framer-v-jcbhed',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-5ltigk-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-JD1cI framer-1jnl39l framer-v-x06ua8',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1swa38h',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1q0ly1-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                                  'framer-1u4mvry',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/6648c29bf09b5e1f9b8b5100.png"
                                    alt="Adam Neumann Unsplash"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                              'framer-1cj5eol',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                'framer-pgapum',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                  'framer-text framer-styles-preset-jth0tn',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'S'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                </span>
                              </h3>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                'framer-ehxvgf',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'A'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'v'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'x'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild12,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'h'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'h'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'.'}
                                  </span>
                                </span>
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                                'framer-fa88go',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2,
                        'framer-1oj48er framer-lux5qc',
                      ].join(' ')}
                      href="/work/london"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1,
                          'framer-u6rput-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1,
                            'framer-2EvUQ framer-1hoaa framer-zhl9a framer-jcbhed framer-v-jcbhed',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-5ltigk-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-JD1cI framer-1jnl39l framer-v-x06ua8',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1swa38h',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1q0ly1-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                                  'framer-1u4mvry',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/0ddc0680f3786229939f7e54.png"
                                    alt="Dmitry Novikov Unsplash"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                              'framer-1cj5eol',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                'framer-pgapum',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                  'framer-text framer-styles-preset-jth0tn',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'A'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'™'}
                                  </span>
                                </span>
                              </h3>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                'framer-ehxvgf',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'A'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'b'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'x'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'f'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild12,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'h'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'h'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild12,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'h'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'.'}
                                  </span>
                                </span>
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                                'framer-fa88go',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3,
                        'framer-1oj48er framer-lux5qc',
                      ].join(' ')}
                      href="/work/smart-home"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1,
                          'framer-u6rput-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1,
                            'framer-2EvUQ framer-1hoaa framer-zhl9a framer-jcbhed framer-v-jcbhed',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-5ltigk-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-JD1cI framer-1jnl39l framer-v-x06ua8',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1swa38h',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1q0ly1-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                                  'framer-1u4mvry',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/24378885d07bed02a0d70044.png"
                                    alt="Bilal Mansuri Unsplash"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                              'framer-1cj5eol',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                'framer-pgapum',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                  'framer-text framer-styles-preset-jth0tn',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'K'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'.'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'C'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                </span>
                              </h3>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                'framer-ehxvgf',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'M'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'b'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'f'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'A'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'I'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'p'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'f'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'b'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild9SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'b'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild10SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild11SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild12SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'.'}
                                  </span>
                                </span>
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                                'framer-fa88go',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4,
                        'framer-1oj48er framer-lux5qc',
                      ].join(' ')}
                      href="/work/edge-runner"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1,
                          'framer-u6rput-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1,
                            'framer-2EvUQ framer-1hoaa framer-zhl9a framer-jcbhed framer-v-jcbhed',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-5ltigk-container',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                'framer-JD1cI framer-1jnl39l framer-v-x06ua8',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-1swa38h',
                                ].join(' ')}
                              ></div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                                  'framer-1q0ly1-container',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                  ].join(' ')}
                                >
                                  <div
                                    className={[
                                      styles.surface,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                    ].join(' ')}
                                  ></div>
                                </div>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                                  'framer-1u4mvry',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                                  ].join(' ')}
                                >
                                  <img
                                    className={[
                                      styles.image,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1ImgNthChild1,
                                    ].join(' ')}
                                    src="/runtime-assets/5d8a4021f9724a4aa20f70fa.png"
                                    alt="Possessed Photography Unsplash"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                              'framer-1cj5eol',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                                'framer-pgapum',
                              ].join(' ')}
                            >
                              <h3
                                className={[
                                  styles.subheading,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1,
                                  'framer-text framer-styles-preset-jth0tn',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'N'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'x'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'F'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1H3NthChild1SpanNthChild1SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'™'}
                                  </span>
                                </span>
                              </h3>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                                'framer-ehxvgf',
                              ].join(' ')}
                            >
                              <p
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                                  'framer-text framer-styles-preset-1rcsw05',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'M'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'-'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild12,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild13,
                                    ].join(' ')}
                                  >
                                    {'v'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild14,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild1SpanNthChild15,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild2SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'y'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'f'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild3SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'v'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild4SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'g'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'c'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild5SpanNthChild12,
                                    ].join(' ')}
                                  >
                                    {'e'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild6SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'d'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'s'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'r'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild7SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'l'}
                                  </span>
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8,
                                  ].join(' ')}
                                >
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild1,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild2,
                                    ].join(' ')}
                                  >
                                    {'u'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild3,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild4,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild5,
                                    ].join(' ')}
                                  >
                                    {'m'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild6,
                                    ].join(' ')}
                                  >
                                    {'a'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild7,
                                    ].join(' ')}
                                  >
                                    {'t'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild8,
                                    ].join(' ')}
                                  >
                                    {'i'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild9,
                                    ].join(' ')}
                                  >
                                    {'o'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild10,
                                    ].join(' ')}
                                  >
                                    {'n'}
                                  </span>
                                  <span
                                    className={[
                                      styles.body,
                                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1SpanNthChild8SpanNthChild11,
                                    ].join(' ')}
                                  >
                                    {'.'}
                                  </span>
                                </span>
                              </p>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild1ANthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild3,
                                'framer-fa88go',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-1czj6z3-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                        'framer-bIU4x framer-1hoaa framer-10g6rg4 framer-v-10g6rg4 framer-aux0mb',
                      ].join(' ')}
                      href="/work"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                          'framer-1ewbnft',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                            'framer-oywm6o',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-4aczR framer-7gymfw',
                            ].join(' ')}
                          ></div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                            'framer-xzbat6',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-4aczR framer-siyj84',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                          'framer-148sj8g',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                            'framer-1ahd3jh',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild5DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-jth0tn',
                            ].join(' ')}
                          >
                            {'MORE PROJECTS'}
                          </p>
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
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6,
                'framer-mz91dy',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1,
                  'framer-qtrlyr',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1,
                    'framer-iwm7s4-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-z6KGa framer-1hoaa framer-spg0ko framer-v-spg0ko',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-ntaz9m',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-XegAV framer-1fqraql',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-e8qwxv',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'Info'}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2,
                    'framer-jldhkq',
                  ].join(' ')}
                >
                  <h2
                    className={[
                      styles.subheading,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1,
                      'framer-text framer-styles-preset-wt9w29',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1,
                        'framer-text',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild1,
                        ].join(' ')}
                      >
                        {'I’ve'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild2,
                        ].join(' ')}
                      >
                        {'worked'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild3,
                        ].join(' ')}
                      >
                        {'closely'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild4,
                        ].join(' ')}
                      >
                        {'with'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild5,
                        ].join(' ')}
                      >
                        {'product'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild6,
                        ].join(' ')}
                      >
                        {'teams'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild1SpanNthChild7,
                        ].join(' ')}
                      >
                        {'on'}
                      </span>
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild2,
                      ].join(' ')}
                    >
                      {'AI-driven'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild3,
                      ].join(' ')}
                    >
                      {'features,'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild4,
                      ].join(' ')}
                    >
                      {'including'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild5,
                      ].join(' ')}
                    >
                      {'LLM'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild6,
                      ].join(' ')}
                    >
                      {'integrations'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild7,
                      ].join(' ')}
                    >
                      {'across'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild8,
                      ].join(' ')}
                    >
                      {'Web3'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild9,
                      ].join(' ')}
                    >
                      {'and'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild10,
                      ].join(' ')}
                    >
                      {'fintech,'}
                    </span>
                    <span
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11,
                        'framer-text',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild2,
                        ].join(' ')}
                      >
                        {'bringing'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild3,
                        ].join(' ')}
                      >
                        {'a'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild4,
                        ].join(' ')}
                      >
                        {'brand-led'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild5,
                        ].join(' ')}
                      >
                        {'perspective'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild6,
                        ].join(' ')}
                      >
                        {'to'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild7,
                        ].join(' ')}
                      >
                        {'complex'}
                      </span>
                      <span
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild1DivNthChild2H2NthChild1SpanNthChild11SpanNthChild8,
                        ].join(' ')}
                      >
                        {'systems.'}
                      </span>
                    </span>
                  </h2>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2,
                  'framer-jj7xqq',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1,
                    'framer-1uahdgl',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                      'framer-c6yflw-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-BM2EJ framer-KLyLi framer-1hoaa framer-zhl9a framer-1k1s2f5 framer-v-8gaunv',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-15c0kul',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1g4i8zv',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1790cwy',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-1056zti',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1w2uptg-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-Ws0FN framer-wm3xhc framer-v-wm3xhc',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-6UiKd framer-gi21w7',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                              'framer-17unova',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                                'framer-tjb1q5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1gy2qcl',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Design Lead'}
                                </h3>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-z3334d',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Google'}
                                </h3>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                                'framer-976iiw',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                                  'framer-bx0cdv',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-jth0tn',
                                  ].join(' ')}
                                >
                                  {'2024 - Current'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1t5sjqu',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-apnxi6',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-1w5vzn4',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            {
                              'Owns design direction across multiple product areas. Leads and mentors a small team of designers, sets quality standards, and reviews design output. Aligns design decisions with broader product and business priorities.'
                            }
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3,
                          'framer-z0eyeo-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-s5yr8 framer-1tb97d9 framer-v-1tb97d9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-4fkte9',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1vjyw9z',
                              ].join(' ')}
                            ></div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-fydiax',
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1,
                      'framer-1jp3ywy-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        'framer-BM2EJ framer-KLyLi framer-1hoaa framer-zhl9a framer-1k1s2f5 framer-v-8gaunv',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          'framer-15c0kul',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1g4i8zv',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1790cwy',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-1056zti',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1w2uptg-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-Ws0FN framer-wm3xhc framer-v-wm3xhc',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-6UiKd framer-gi21w7',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                              'framer-17unova',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                                'framer-tjb1q5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1gy2qcl',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Product designer'}
                                </h3>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-z3334d',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Apple'}
                                </h3>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                                'framer-976iiw',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                                  'framer-bx0cdv',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-jth0tn',
                                  ].join(' ')}
                                >
                                  {'2023 – 2024'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1t5sjqu',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-apnxi6',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-1w5vzn4',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            {
                              'Designed end to end product experiences across web and internal tools. Translated requirements into wireframes, UI, and interactive prototypes, and partnered with engineering through implementation and QA. Balanced usability, brand, and product constraints.'
                            }
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3,
                          'framer-z0eyeo-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-s5yr8 framer-1tb97d9 framer-v-1tb97d9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-4fkte9',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1vjyw9z',
                              ].join(' ')}
                            ></div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-fydiax',
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1,
                      'framer-1n6acqz-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                        'framer-BM2EJ framer-KLyLi framer-1hoaa framer-zhl9a framer-1k1s2f5 framer-v-8gaunv',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                          'framer-15c0kul',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1g4i8zv',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1790cwy',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-1056zti',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1w2uptg-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-Ws0FN framer-wm3xhc framer-v-wm3xhc',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-6UiKd framer-gi21w7',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                              'framer-17unova',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                                'framer-tjb1q5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1gy2qcl',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Sr Graphic Designer'}
                                </h3>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-z3334d',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Meta'}
                                </h3>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                                'framer-976iiw',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                                  'framer-bx0cdv',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-jth0tn',
                                  ].join(' ')}
                                >
                                  {'2021 – 2023'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1t5sjqu',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-apnxi6',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-1w5vzn4',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            {
                              'Led visual execution for larger campaigns and cross team initiatives. Took ownership of complex layouts and design systems, while reviewing work from junior designers and providing clear feedback. Worked directly with stakeholders to define scope and expectations.'
                            }
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild3,
                          'framer-z0eyeo-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-s5yr8 framer-1tb97d9 framer-v-1tb97d9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-4fkte9',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1vjyw9z',
                              ].join(' ')}
                            ></div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-fydiax',
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
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1,
                      'framer-14n9gi9-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1,
                        'framer-BM2EJ framer-KLyLi framer-1hoaa framer-zhl9a framer-1k1s2f5 framer-v-8gaunv',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                          'framer-15c0kul',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-1g4i8zv',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1790cwy',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-1056zti',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                                'framer-1w2uptg-container',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                                  'framer-Ws0FN framer-wm3xhc framer-v-wm3xhc',
                                ].join(' ')}
                              >
                                <div
                                  className={[
                                    styles.surface,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                                    'framer-6UiKd framer-gi21w7',
                                  ].join(' ')}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                              'framer-17unova',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                                'framer-tjb1q5',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                                  'framer-1gy2qcl',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Graphic Designer'}
                                </h3>
                              </div>
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                                  'framer-z3334d',
                                ].join(' ')}
                              >
                                <h3
                                  className={[
                                    styles.subheading,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2H3NthChild1,
                                    'framer-text framer-styles-preset-1ilrpiv',
                                  ].join(' ')}
                                >
                                  {'Adobe'}
                                </h3>
                              </div>
                            </div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                                'framer-976iiw',
                              ].join(' ')}
                            >
                              <div
                                className={[
                                  styles.surface,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                                  'framer-bx0cdv',
                                ].join(' ')}
                              >
                                <p
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1PNthChild1,
                                    'framer-text framer-styles-preset-jth0tn',
                                  ].join(' ')}
                                >
                                  {'2019 – 2021'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1t5sjqu',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-apnxi6',
                          ].join(' ')}
                        ></div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild2,
                            'framer-1w5vzn4',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild2PNthChild1,
                              'framer-text framer-styles-preset-1rcsw05',
                            ].join(' ')}
                          >
                            {
                              'Designed marketing and brand assets across digital and internal channels. Supported campaigns, presentations, and product communications while maintaining consistency with established brand systems. Collaborated closely with marketing and product teams on day to day deliverables.'
                            }
                          </p>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild3,
                          'framer-z0eyeo-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                            'framer-s5yr8 framer-1tb97d9 framer-v-1tb97d9',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1,
                              'framer-4fkte9',
                            ].join(' ')}
                          >
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                                'framer-1vjyw9z',
                              ].join(' ')}
                            ></div>
                            <div
                              className={[
                                styles.surface,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild1DivNthChild4DivNthChild1DivNthChild1DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                                'framer-fydiax',
                              ].join(' ')}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2,
                    'framer-1562zyu',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-6lqqdg-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-msPXG framer-zz8lb9 framer-v-zz8lb9',
                      ].join(' ')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-sbd4yy',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                            'framer-pkjd16',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-46t12 framer-1yfufry',
                            ].join(' ')}
                          ></div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                            'framer-1tixqqo',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-46t12 framer-epmm5x',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-nrok72-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2ANthChild1,
                          ].join(' ')}
                          href="https://workspace.google.com/products/drive/"
                        >
                          {'DOWNLOAD CV'}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                      'framer-dij0p2-container',
                    ].join(' ')}
                  >
                    <a
                      className={[
                        styles.link,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1,
                        'framer-bIU4x framer-1hoaa framer-10g6rg4 framer-v-10g6rg4 framer-aux0mb',
                      ].join(' ')}
                      href="https://linkedin.com/"
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                          'framer-1ewbnft',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1,
                            'framer-oywm6o',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                              'framer-4aczR framer-7gymfw',
                            ].join(' ')}
                          ></div>
                        </div>
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2,
                            'framer-xzbat6',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                              'framer-4aczR framer-siyj84',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2,
                          'framer-148sj8g',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1,
                            'framer-1ahd3jh',
                          ].join(' ')}
                        >
                          <p
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild6DivNthChild2DivNthChild2DivNthChild2DivNthChild1ANthChild1DivNthChild2DivNthChild1PNthChild1,
                              'framer-text framer-styles-preset-jth0tn',
                            ].join(' ')}
                          >
                            {'LINKEDIN'}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1,
                'framer-1yy4o7b-container',
              ].join(' ')}
            >
              <section
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1,
                  'framer-YP2yv framer-1hoaa framer-1woc47h framer-v-1woc47h',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1,
                    'framer-j2v7bv',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1,
                      'framer-r197ig',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-1a51u6e',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-rlynbx',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                          'framer-jztwi9',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                            'framer-1pn8u8n',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                              'framer-1xyak3v',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'E'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'m'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'m'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'a'}
                                </span>
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'C'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'o'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'l'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'l'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild5,
                                  ].join(' ')}
                                >
                                  {'i'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild6,
                                  ].join(' ')}
                                >
                                  {'n'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild2SpanNthChild7,
                                  ].join(' ')}
                                >
                                  {'s'}
                                </span>
                              </span>
                            </p>
                          </div>
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                              'framer-1y01mk8',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'C'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'r'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'e'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'a'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild5,
                                  ].join(' ')}
                                >
                                  {'t'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild6,
                                  ].join(' ')}
                                >
                                  {'i'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild7,
                                  ].join(' ')}
                                >
                                  {'v'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild1SpanNthChild8,
                                  ].join(' ')}
                                >
                                  {'e'}
                                </span>
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'D'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'i'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'r'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'e'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild5,
                                  ].join(' ')}
                                >
                                  {'c'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild6,
                                  ].join(' ')}
                                >
                                  {'t'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild7,
                                  ].join(' ')}
                                >
                                  {'o'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild2SpanNthChild8,
                                  ].join(' ')}
                                >
                                  {'r'}
                                </span>
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild3,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild3SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'a'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild3SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'t'}
                                </span>
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'S'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'t'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'u'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'d'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild5,
                                  ].join(' ')}
                                >
                                  {'i'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild4SpanNthChild6,
                                  ].join(' ')}
                                >
                                  {'o'}
                                </span>
                              </span>
                              <span
                                className={[
                                  styles.body,
                                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5,
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5SpanNthChild1,
                                  ].join(' ')}
                                >
                                  {'N'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5SpanNthChild2,
                                  ].join(' ')}
                                >
                                  {'o'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5SpanNthChild3,
                                  ].join(' ')}
                                >
                                  {'r'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5SpanNthChild4,
                                  ].join(' ')}
                                >
                                  {'t'}
                                </span>
                                <span
                                  className={[
                                    styles.body,
                                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2PNthChild1SpanNthChild5SpanNthChild5,
                                  ].join(' ')}
                                >
                                  {'h'}
                                </span>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-11a5s51',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-1q10jbz-container',
                        ].join(' ')}
                      >
                        <p
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1PNthChild1,
                          ].join(' ')}
                        >
                          {
                            '"Working together felt calm and intentional. Every decision was explained clearly, visuals were strong, and the final site feels thoughtful, confident, and easy to evolve over time."'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2,
                      'framer-17s2l0',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        'framer-4xazv6',
                      ].join(' ')}
                    ></div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2,
                        'framer-ha32sn',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                          'framer-1wag0jq-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                            'framer-EWS30 framer-1mvz35x framer-v-1mvz35x',
                          ].join(' ')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                              'framer-mv6fb framer-lvau1p',
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                          'framer-edcpe6-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1,
                            'framer-EWS30 framer-1mvz35x framer-v-1mvz35x',
                          ].join(' ')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                              'framer-0n1hS framer-lvau1p',
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
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2,
                    'framer-pjgtqb',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1,
                      'framer-lhvmhk-container',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        'framer-JD1cI framer-1jnl39l framer-v-1td2ma4',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                          'framer-1swa38h',
                        ].join(' ')}
                      ></div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                          'framer-1q0ly1-container',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                          ].join(' ')}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                            ].join(' ')}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3,
                          'framer-1u4mvry',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1,
                          ].join(' ')}
                        >
                          <img
                            className={[
                              styles.image,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1DivNthChild7DivNthChild1SectionNthChild1DivNthChild2DivNthChild1DivNthChild1DivNthChild3DivNthChild1ImgNthChild1,
                            ].join(' ')}
                            src="/runtime-assets/cced5105021bb4f708af5e74.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <section
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8,
                'framer-17cjw91',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1,
                  'framer-rwl36f-container',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1DivNthChild1,
                    'framer-z6KGa framer-1hoaa framer-spg0ko framer-v-spg0ko',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                      'framer-ntaz9m',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-XegAV framer-1fqraql',
                      ].join(' ')}
                    ></div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                      'framer-e8qwxv',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild2PNthChild1,
                        'framer-text framer-styles-preset-jth0tn',
                      ].join(' ')}
                    >
                      {'Clients'}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2,
                  'framer-9fbgzy',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1,
                    'framer-1k8hiev-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/af9f05f75b0870f8ce776a93.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/7cf4065b20f7175746110980.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1,
                    'framer-18qeh2e-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/8e2abcf06fe63cf28a843602.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild2DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/11e1d912b3e7d6266202bc6f.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1,
                    'framer-1bsbr67-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/cb228b5d2d25b581dd74f8d9.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild3DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/f15824c512973befdaec5554.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1,
                    'framer-1895uzp-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/82b04f30ff178bac0a90c0b4.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild4DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/edbff20015efa921ee048d9e.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1,
                    'framer-1qtb3we-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/28341a0b5048516eddefeb67.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild5DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/0a6f533a67689cd182a17284.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1,
                    'framer-t2iwoj-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/cc23ccd3abac0f574d21a6fc.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild6DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/10abc657ceb7002bd83eb925.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1,
                    'framer-1wdqnt2-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/ffb3a91fe474958d44463f0e.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild7DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/b99c49cab6850a869669728c.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1,
                    'framer-10ekq5p-container',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1,
                      'framer-hzyBL framer-y1r65f framer-v-y1r65f',
                    ].join(' ')}
                    style={{ cursor: 'default' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1,
                        'framer-154ib4g',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild1DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/c8e39d3e0beded10286e17ef.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2,
                        'framer-xe47oi',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1,
                        ].join(' ')}
                      >
                        <img
                          className={[
                            styles.image,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild2MainNthChild1SectionNthChild8DivNthChild2DivNthChild8DivNthChild1DivNthChild1DivNthChild2DivNthChild1ImgNthChild1,
                          ].join(' ')}
                          src="/runtime-assets/9e01b2af7bd7a4cf5b142809.jpg"
                          alt=""
                        />
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
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5,
              'framer-duzrcd-container hidden-o7yrpx',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1,
                'framer-u4lVi framer-yeed3n framer-v-yeed3n',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild1,
                  'framer-hk6fhr-container',
                ].join(' ')}
              >
                <a
                  className={[
                    styles.link,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild1ANthChild1,
                    'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                  ].join(' ')}
                  href="/"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild1ANthChild1DivNthChild1,
                      'framer-ap1kd5',
                    ].join(' ')}
                  >
                    <p
                      className={[
                        styles.body,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild1ANthChild1DivNthChild1PNthChild1,
                        'framer-text framer-styles-preset-jth0tn',
                      ].join(' ')}
                    >
                      {'HOME'}
                    </p>
                  </div>
                </a>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2,
                  'framer-1s5n23z',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild1,
                    'framer-14wvqz9-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild1ANthChild1,
                      'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                    ].join(' ')}
                    href="/work"
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1,
                        'framer-ap1kd5',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild1ANthChild1DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'PROJECTS'}
                      </p>
                    </div>
                  </a>
                </div>
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild2,
                    'framer-igr681-container',
                  ].join(' ')}
                >
                  <a
                    className={[
                      styles.link,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild2ANthChild1,
                      'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                    ].join(' ')}
                    href="/#info"
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                        'framer-ap1kd5',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild2DivNthChild2ANthChild1DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'INFO'}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3,
                  'framer-zej11c-container',
                ].join(' ')}
              >
                <a
                  className={[
                    styles.link,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1,
                    'framer-bIU4x framer-1hoaa framer-10g6rg4 framer-v-10g6rg4 framer-aux0mb',
                  ].join(' ')}
                  href="mailto: hello@senri.design"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild1,
                      'framer-1ewbnft',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1,
                        'framer-oywm6o',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild1DivNthChild1,
                          'framer-4aczR framer-7gymfw',
                        ].join(' ')}
                      ></div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild2,
                        'framer-xzbat6',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild1DivNthChild2DivNthChild1,
                          'framer-4aczR framer-siyj84',
                        ].join(' ')}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild2,
                      'framer-148sj8g',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1,
                        'framer-1ahd3jh',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild3ANthChild1DivNthChild2DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-jth0tn',
                        ].join(' ')}
                      >
                        {'CONNECT'}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild5DivNthChild1NavNthChild1DivNthChild4,
                  'framer-XegAV framer-64d3s7',
                ].join(' ')}
              ></div>
            </div>
          </div>
          <div
            className={[
              styles.surface,
              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6,
              'framer-1uc3lj8-container',
            ].join(' ')}
          >
            <div
              className={[
                styles.surface,
                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1,
                'framer-i70b9 framer-zhl9a framer-eimgde framer-v-eimgde',
              ].join(' ')}
            >
              <div
                className={[
                  styles.surface,
                  styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1,
                  'framer-1sjtl9t',
                ].join(' ')}
              >
                <div
                  className={[
                    styles.surface,
                    styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2,
                    'framer-nh5tk1',
                  ].join(' ')}
                >
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1,
                      'framer-t97tx9',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1,
                        'framer-1ydj91a',
                      ].join(' ')}
                    >
                      <p
                        className={[
                          styles.body,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1,
                          'framer-text framer-styles-preset-1rcsw05',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            styles.body,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1,
                          ].join(' ')}
                        >
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild1,
                            ].join(' ')}
                          >
                            {'C'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild2,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild3,
                            ].join(' ')}
                          >
                            {'l'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild4,
                            ].join(' ')}
                          >
                            {'l'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild5,
                            ].join(' ')}
                          >
                            {'a'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild6,
                            ].join(' ')}
                          >
                            {'b'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild7,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild8,
                            ].join(' ')}
                          >
                            {'r'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild9,
                            ].join(' ')}
                          >
                            {'a'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild10,
                            ].join(' ')}
                          >
                            {'t'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild11,
                            ].join(' ')}
                          >
                            {'i'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild12,
                            ].join(' ')}
                          >
                            {'o'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild13,
                            ].join(' ')}
                          >
                            {'n'}
                          </span>
                          <span
                            className={[
                              styles.body,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild1PNthChild1SpanNthChild1SpanNthChild14,
                            ].join(' ')}
                          >
                            {'s'}
                          </span>
                        </span>
                      </p>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2,
                        'framer-cuxdf9-container',
                      ].join(' ')}
                    >
                      <a
                        className={[
                          styles.link,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild1,
                          'framer-8lYZ1 framer-KbYXJ framer-5vr4ik framer-v-5vr4ik framer-aghzvy',
                        ].join(' ')}
                        href="mailto: hello@senri.design"
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild1DivNthChild1,
                            'framer-1m2xdy8',
                          ].join(' ')}
                        >
                          <h2
                            className={[
                              styles.subheading,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild1DivNthChild2ANthChild1DivNthChild1H2NthChild1,
                              'framer-text framer-styles-preset-13dq7so',
                            ].join(' ')}
                          >
                            {'hello@senri.design'}
                          </h2>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div
                    className={[
                      styles.surface,
                      styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2,
                      'framer-pryzxw',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1,
                        'framer-r5hifq',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1,
                          'framer-wundb2-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1ANthChild1,
                            'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                          ].join(' ')}
                          href="https://linkedin.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1,
                              'framer-ap1kd5',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild1ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              {'LINKEDIN'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2,
                          'framer-1nzfbmo-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2ANthChild1,
                            'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                          ].join(' ')}
                          href="https://twitter.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2ANthChild1DivNthChild1,
                              'framer-ap1kd5',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild2ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              {'TWITTER'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild3,
                          'framer-1n0m013-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild3ANthChild1,
                            'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                          ].join(' ')}
                          href="https://behance.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild3ANthChild1DivNthChild1,
                              'framer-ap1kd5',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild3ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              {'BEHANCE'}
                            </p>
                          </div>
                        </a>
                      </div>
                      <div
                        className={[
                          styles.surface,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild4,
                          'framer-8u9grw-container',
                        ].join(' ')}
                      >
                        <a
                          className={[
                            styles.link,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild4ANthChild1,
                            'framer-DJnPT framer-1hoaa framer-bxu6dm framer-v-bxu6dm framer-1ynparh',
                          ].join(' ')}
                          href="https://dribbble.com/"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={[
                              styles.surface,
                              styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild4ANthChild1DivNthChild1,
                              'framer-ap1kd5',
                            ].join(' ')}
                          >
                            <p
                              className={[
                                styles.body,
                                styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild1DivNthChild4ANthChild1DivNthChild1PNthChild1,
                                'framer-text framer-styles-preset-jth0tn',
                              ].join(' ')}
                            >
                              {'DRIBBBLE'}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div
                      className={[
                        styles.surface,
                        styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2,
                        'framer-181cn5b-container',
                      ].join(' ')}
                    >
                      <a
                        className={[
                          styles.link,
                          styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1,
                          'framer-03Qwq framer-stzggw framer-v-stzggw framer-ruxzvf',
                        ].join(' ')}
                        href="/#go-top-trigger"
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className={[
                            styles.surface,
                            styles.nodeBodyNthChild2DivNthChild2DivNthChild2DivNthChild6DivNthChild1FooterNthChild1DivNthChild1DivNthChild2DivNthChild2DivNthChild2ANthChild1DivNthChild1,
                            'framer-CfE7G framer-dppml2',
                          ].join(' ')}
                        ></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
    </main>
  )
}
