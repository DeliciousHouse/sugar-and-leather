export default function ExperienceBackedBy({ label, companies }) {
  const items = [...companies, ...companies];

  return (
    <div className="experience-backed" aria-label={label}>
      <p className="experience-backed-label">{label}</p>
      <div className="experience-backed-strip" aria-hidden="true">
        <div className="experience-backed-track">
          {items.map((company, i) => (
            <span key={`${company}-${i}`} className="experience-backed-item">
              {i > 0 ? <span className="dot" /> : null}
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
