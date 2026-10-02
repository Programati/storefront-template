type PageMetaProps = {
  title: string
  description?: string
  noindex?: boolean
}

export function PageMeta({ title, description, noindex }: PageMetaProps) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {noindex ? <meta name="robots" content="noindex" /> : null}
    </>
  )
}
