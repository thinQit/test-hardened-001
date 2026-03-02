const features = [
  { title: 'Fast setup', description: 'Get started in minutes with a clean layout.' },
  { title: 'Modern UI', description: 'Polished components with accessible patterns.' },
  { title: 'Secure inbox', description: 'Review and manage contact submissions easily.' }
];

export default function FeaturesGrid() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-semibold">Key features</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {features.map(feature => (
            <div key={feature.title} className="rounded-lg border border-border p-5">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
