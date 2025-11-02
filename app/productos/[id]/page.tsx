import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({ params }: { params: any }) {
  // `params` can be a Promise in some Next.js routing cases; await to be safe
  const p = await params
  const id = p?.id
  return <ProductDetailClient id={id} />
}
