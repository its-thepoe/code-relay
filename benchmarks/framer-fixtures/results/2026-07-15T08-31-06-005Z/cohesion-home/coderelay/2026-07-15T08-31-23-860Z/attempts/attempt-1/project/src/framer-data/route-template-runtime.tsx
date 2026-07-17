import * as React from 'react'
import { FramerComponentFamilyStateMachine } from './component-families-runtime'

type RouteTemplateNode = {
  id?: string
  classKey?: string
  tag?: string
  text?: string
  kind?: string
  componentFamilyId?: string
  componentFamilyName?: string
  componentFamilyInitialVariantId?: string
  attributes?: Record<string, unknown>
  inlineStyle?: Record<string, unknown>
  children?: RouteTemplateNode[]
}

type RuntimeProps = {
  tree: ReadonlyArray<Record<string, unknown>>
  styles: Record<string, string>
}

const textTags = new Set([
  'p',
  'span',
  'li',
  'label',
  'strong',
  'em',
  'small',
  'blockquote',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNode(value: Record<string, unknown>): RouteTemplateNode {
  return {
    id: typeof value.id === 'string' ? value.id : undefined,
    classKey: typeof value.classKey === 'string' ? value.classKey : undefined,
    tag: typeof value.tag === 'string' ? value.tag : 'div',
    text: typeof value.text === 'string' ? value.text : undefined,
    kind: typeof value.kind === 'string' ? value.kind : undefined,
    componentFamilyId:
      typeof value.componentFamilyId === 'string'
        ? value.componentFamilyId
        : undefined,
    componentFamilyName:
      typeof value.componentFamilyName === 'string'
        ? value.componentFamilyName
        : undefined,
    componentFamilyInitialVariantId:
      typeof value.componentFamilyInitialVariantId === 'string'
        ? value.componentFamilyInitialVariantId
        : undefined,
    attributes: isRecord(value.attributes) ? value.attributes : {},
    inlineStyle: isRecord(value.inlineStyle) ? value.inlineStyle : {},
    children: Array.isArray(value.children)
      ? value.children.filter(isRecord).map(asNode)
      : [],
  }
}

function baseClassForTag(node: RouteTemplateNode) {
  if (node.tag === 'img') return 'image'
  if (node.tag === 'h1') return 'heading'
  if (node.tag === 'h2' || node.tag === 'h3') return 'subheading'
  if (node.tag === 'a') return 'link'
  if (node.tag === 'button') return 'button'
  if (node.kind === 'text' || textTags.has(node.tag ?? '')) return 'body'
  return 'surface'
}

function tagForNode(node: RouteTemplateNode, depth: number) {
  if (node.tag && /^h[1-6]$/.test(node.tag)) return node.tag
  if (node.tag === 'a' || node.tag === 'button' || node.tag === 'img')
    return node.tag
  if (textTags.has(node.tag ?? '')) return node.tag ?? 'span'
  if (depth === 0 && node.kind === 'component') return 'section'
  if (node.tag === 'section' || node.tag === 'main' || node.tag === 'article') {
    return node.tag
  }
  return 'div'
}

function toStyleObject(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) => typeof entry === 'string' && entry.length > 0,
    ),
  ) as React.CSSProperties
}

function classNameForNode(
  node: RouteTemplateNode,
  styles: Record<string, string>,
) {
  const classes = [styles[baseClassForTag(node)]]
  if (node.classKey && styles[node.classKey])
    classes.push(styles[node.classKey])
  const extra =
    typeof node.attributes?.className === 'string'
      ? node.attributes.className
      : ''
  if (extra) classes.push(extra)
  return classes.filter(Boolean).join(' ')
}

function renderNode(
  node: RouteTemplateNode,
  styles: Record<string, string>,
  depth: number,
): React.ReactNode {
  if (node.componentFamilyId) {
    return (
      <FramerComponentFamilyStateMachine
        key={node.id ?? node.componentFamilyId}
        familyId={node.componentFamilyId}
        initialVariantId={node.componentFamilyInitialVariantId}
        placement="route"
        familyName={node.componentFamilyName}
      />
    )
  }

  const tag = tagForNode(node, depth)
  const children = (node.children ?? []).map(
    (child, index) =>
      renderNode(child, styles, depth + 1) ?? <React.Fragment key={index} />,
  )
  const style = toStyleObject(
    isRecord(node.inlineStyle) ? node.inlineStyle : {},
  )
  const className = classNameForNode(node, styles)
  const key = node.id ?? node.classKey ?? `node-${depth}`

  if (tag === 'img' && typeof node.attributes?.src === 'string') {
    return React.createElement('img', {
      key,
      className,
      style,
      src: node.attributes.src,
      alt: typeof node.attributes.alt === 'string' ? node.attributes.alt : '',
    })
  }

  const props: Record<string, unknown> = {
    key,
    className,
    style,
  }

  if (tag === 'a') {
    props.href =
      typeof node.attributes?.href === 'string' ? node.attributes.href : '#'
  }
  if (tag === 'button') {
    props.type = 'button'
  }

  return React.createElement(tag, props, node.text, ...children)
}

export function FramerRouteTemplateRuntime({ tree, styles }: RuntimeProps) {
  const nodes = Array.isArray(tree) ? tree.filter(isRecord).map(asNode) : []
  return <>{nodes.map((node, index) => renderNode(node, styles, index))}</>
}
