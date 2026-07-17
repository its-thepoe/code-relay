import * as React from 'react'
import {
  framerCmsCollections,
  getFramerCmsCollectionById,
  getFramerCmsCollectionByName,
} from './cms'

export type FramerCmsCollectionName = string
export type FramerCmsFieldEntry =
  | { type?: 'string'; value?: string }
  | { type?: 'number'; value?: number }
  | { type?: 'boolean'; value?: boolean }
  | { type?: 'date'; value?: string }
  | { type?: 'link'; value?: string }
  | { type?: 'image'; value?: string | null }
  | { type?: 'file'; value?: string | null }
  | { type?: 'color'; value?: string | null }
  | { type?: 'formattedText'; value?: string; contentType?: string }
  | { type?: 'enum'; value?: string }
  | { type?: 'collectionReference'; value?: string }
  | { type?: 'multiCollectionReference'; value?: string[] }
  | {
      type?: 'array'
      value?: Array<{ id?: string; fieldData?: Record<string, unknown> }>
    }
  | { type?: string; value?: unknown; contentType?: string }

export function getFramerCmsItems(input: { id?: string; name?: string }) {
  const collection = input.id
    ? getFramerCmsCollectionById(input.id)
    : input.name
      ? getFramerCmsCollectionByName(input.name)
      : undefined

  return collection?.items ?? []
}

export function getFramerCmsItemFieldValue(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  if (!item?.fieldData) return undefined
  return item.fieldData[fieldKey]
}

export function resolveFramerCmsFieldEntry(entry: unknown) {
  if (!entry || typeof entry !== 'object') return entry
  const record = entry as FramerCmsFieldEntry
  if (!('value' in record)) return entry
  return record.value
}

export function getFramerCmsFieldType(entry: unknown) {
  if (!entry || typeof entry !== 'object') return undefined
  const record = entry as { type?: string }
  return typeof record.type === 'string' ? record.type : undefined
}

export function getFramerCmsPlainText(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const value = resolveFramerCmsFieldEntry(entry)
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return undefined
}

export function getFramerCmsImageUrl(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const value = resolveFramerCmsFieldEntry(
    getFramerCmsItemFieldValue(item, fieldKey),
  )
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsLinkHref(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const value = resolveFramerCmsFieldEntry(
    getFramerCmsItemFieldValue(item, fieldKey),
  )
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsFormattedHtml(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const value = resolveFramerCmsFieldEntry(entry)
  return typeof value === 'string' ? value : undefined
}

export function getFramerCmsDisplayValue(
  item: { fieldData?: Record<string, unknown> } | undefined,
  fieldKey: string,
) {
  const entry = getFramerCmsItemFieldValue(item, fieldKey)
  const type = getFramerCmsFieldType(entry)
  const value = resolveFramerCmsFieldEntry(entry)

  if (value == null) return undefined
  if (type === 'formattedText' && typeof value === 'string') return value
  if (type === 'date' && typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString()
  }
  if (type === 'multiCollectionReference' && Array.isArray(value)) {
    return value.join(', ')
  }
  if (type === 'array' && Array.isArray(value)) {
    return value
  }
  if (type === 'boolean' && typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }
  return value
}

export function mapFramerCmsItems<T>(
  input: { id?: string; name?: string },
  mapper: (
    item: (typeof framerCmsCollections)[number]['items'] extends readonly (infer Item)[]
      ? Item
      : never,
    index: number,
  ) => T,
) {
  return getFramerCmsItems(input).map((item, index) =>
    mapper(item as never, index),
  )
}

export function useFramerCmsCollection(input: { id?: string; name?: string }) {
  return React.useMemo(() => {
    const collection = input.id
      ? getFramerCmsCollectionById(input.id)
      : input.name
        ? getFramerCmsCollectionByName(input.name)
        : undefined

    return {
      collection,
      items: collection?.items ?? [],
      fields: collection?.fields ?? [],
    }
  }, [input.id, input.name])
}

export function FramerCmsCollectionList(props: {
  id?: string
  name?: string
  children: (
    item: (typeof framerCmsCollections)[number]['items'] extends readonly (infer Item)[]
      ? Item
      : never,
    index: number,
  ) => React.ReactNode
  empty?: React.ReactNode
}) {
  const { items } = useFramerCmsCollection({ id: props.id, name: props.name })

  if (items.length === 0) {
    return <>{props.empty ?? null}</>
  }

  return <>{items.map((item, index) => props.children(item as never, index))}</>
}

export function FramerCmsText(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  fallback?: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}) {
  const text = getFramerCmsPlainText(props.item, props.field)
  if (!text) return <>{props.fallback ?? null}</>
  const Tag = (props.as ?? 'span') as keyof React.JSX.IntrinsicElements
  return <Tag>{text}</Tag>
}

export function FramerCmsRichText(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  fallback?: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}) {
  const html = getFramerCmsFormattedHtml(props.item, props.field)
  if (!html) return <>{props.fallback ?? null}</>
  const Tag = (props.as ?? 'div') as keyof React.JSX.IntrinsicElements
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />
}

export function FramerCmsImage(
  props: {
    item?: { fieldData?: Record<string, unknown> }
    field: string
    altField?: string
    alt?: string
    fallback?: React.ReactNode
  } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>,
) {
  const src = getFramerCmsImageUrl(props.item, props.field)
  if (!src) return <>{props.fallback ?? null}</>
  const alt = props.altField
    ? (getFramerCmsPlainText(props.item, props.altField) ?? '')
    : (props.alt ?? '')
  return <img {...props} src={src} alt={alt} />
}

export function FramerCmsLink(
  props: {
    item?: { fieldData?: Record<string, unknown> }
    field: string
    labelField?: string
    fallback?: React.ReactNode
    children?: React.ReactNode
  } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>,
) {
  const href = getFramerCmsLinkHref(props.item, props.field)
  if (!href) return <>{props.fallback ?? null}</>
  const label =
    props.children ??
    (props.labelField
      ? getFramerCmsPlainText(props.item, props.labelField)
      : href)
  return (
    <a {...props} href={href}>
      {label}
    </a>
  )
}

export function FramerCmsField(props: {
  item?: { fieldData?: Record<string, unknown> }
  field: string
  altField?: string
  labelField?: string
  fallback?: React.ReactNode
  textAs?: keyof React.JSX.IntrinsicElements
  richTextAs?: keyof React.JSX.IntrinsicElements
}) {
  const entry = getFramerCmsItemFieldValue(props.item, props.field)
  const type = getFramerCmsFieldType(entry)

  if (type === 'image') {
    return (
      <FramerCmsImage
        item={props.item}
        field={props.field}
        altField={props.altField}
        fallback={props.fallback}
      />
    )
  }

  if (type === 'link') {
    return (
      <FramerCmsLink
        item={props.item}
        field={props.field}
        labelField={props.labelField}
        fallback={props.fallback}
      />
    )
  }

  if (type === 'formattedText') {
    return (
      <FramerCmsRichText
        item={props.item}
        field={props.field}
        fallback={props.fallback}
        as={props.richTextAs}
      />
    )
  }

  if (type === 'color') {
    const value = getFramerCmsDisplayValue(props.item, props.field)
    if (!value || typeof value !== 'string')
      return <>{props.fallback ?? null}</>
    return (
      <span
        style={{
          display: 'inline-flex',
          width: '0.875rem',
          height: '0.875rem',
          borderRadius: '999px',
          backgroundColor: value,
          border: '1px solid rgb(0 0 0 / 0.1)',
        }}
        aria-label={value}
        title={value}
      />
    )
  }

  return (
    <FramerCmsText
      item={props.item}
      field={props.field}
      fallback={props.fallback}
      as={props.textAs}
    />
  )
}

export function FramerCmsCollectionPreview(props: {
  id?: string
  name?: string
  empty?: React.ReactNode
}) {
  const { collection, items, fields } = useFramerCmsCollection({
    id: props.id,
    name: props.name,
  })

  if (!collection || items.length === 0) {
    return <>{props.empty ?? null}</>
  }

  return (
    <section data-framer-cms-preview={collection.name}>
      <header>
        <strong>{collection.name}</strong>
      </header>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '1rem 0 0',
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        {items.map((item, index) => (
          <li
            key={item.id ?? index}
            style={{
              border: '1px solid rgb(0 0 0 / 0.08)',
              borderRadius: '0.75rem',
              padding: '0.75rem',
            }}
          >
            <dl style={{ margin: 0, display: 'grid', gap: '0.5rem' }}>
              {fields.map((field) => (
                <div key={field.id} style={{ display: 'grid', gap: '0.25rem' }}>
                  <dt
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {field.name}
                  </dt>
                  <dd style={{ margin: 0 }}>
                    <FramerCmsField
                      item={item}
                      field={field.id}
                      labelField={
                        (field.type as string | undefined) === 'link'
                          ? 'title'
                          : undefined
                      }
                      fallback={<span style={{ opacity: 0.56 }}>No value</span>}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}
