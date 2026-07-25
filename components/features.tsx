import { FEATURES } from "@/lib/data";

export default function Features() {
  return (
    <section className="border-t bg-white py-24">
      <div className="container mx-auto px-4">
        <ul className="grid gap-12 md:grid-cols-3">
          {FEATURES.map(({title, text, icon: Icon}) => (
            <li className="flex flex-col" key={title}>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-black">{title}</h3>
              <p className="text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
