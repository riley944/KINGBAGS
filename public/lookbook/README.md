# Lookbook image drop

One folder per concept, named by slug (see app/gallery/page.tsx):

  public/lookbook/<slug>/front.webp     <- required; card image
  public/lookbook/<slug>/three-q.webp   <- optional, for future detail pages
  public/lookbook/<slug>/side.webp
  public/lookbook/<slug>/detail.webp

Image spec (match the Somos photography so everything sits together):
- Square, 1200x1200 or larger
- Pure white background (#FFFFFF), soft natural floor shadow only
- One bag, centered, base sitting at ~88% of frame height
- Same camera height across all shots (slightly above bag midline)
- No text or props outside the bag artwork itself
- Export PNG, convert to WebP (or drop PNGs and ask Claude to convert)

The gallery card auto-falls back to line art until front.webp exists.
