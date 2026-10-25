interface SectionHeadingProps {
  id: string
  title: string
}

export function SectionHeading({ id, title }: SectionHeadingProps) {
  return (
    <h2 className='text-title mb-5 scroll-mt-6 text-[22px] leading-[1.3] font-medium' id={id}>
      <span className='border-accent border-b pb-1'>{title}</span>
    </h2>
  )
}
