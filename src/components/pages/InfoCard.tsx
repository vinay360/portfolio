/** Static card used on the books and movies pages (mirrors shadcn Card markup). */
export function InfoCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      data-slot="card"
      data-size="default"
      className="group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl h-full w-full cursor-default border border-border bg-card"
      role="presentation"
    >
      <div data-slot="card-content" className="group-data-[size=sm]/card:px-3 flex flex-col gap-1 px-4">
        <h3 className="text-base font-semibold leading-tight text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
