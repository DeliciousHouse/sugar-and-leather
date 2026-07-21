export default function ExperienceBackedBy({ label, companies }) {
  const items = [...companies, ...companies];

  return (
    <div className="experience-backed" aria-label={label}>
      <p className="experience-backed-label">{label}</p>
      <div className="experience-backed-strip" aria-hidden="true">
        <div className="experience-backed-track">
          {items.map((company, i) => {
            const logoClass = [
              'experience-backed-logo',
              company.compact && 'experience-backed-logo--compact',
              company.light && 'experience-backed-logo--light',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <span key={`${company.name}-${i}`} className="experience-backed-item">
                {company.mark && company.wordmark ? (
                  <>
                    <img
                      src={company.mark}
                      alt=""
                      className="experience-backed-mark"
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      src={company.wordmark}
                      alt=""
                      className="experience-backed-wordmark"
                      loading="lazy"
                      decoding="async"
                    />
                  </>
                ) : company.mark ? (
                  <>
                    <img
                      src={company.mark}
                      alt=""
                      className="experience-backed-mark"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="experience-backed-name">{company.name}</span>
                  </>
                ) : (
                  <img
                    src={company.logo}
                    alt=""
                    className={logoClass}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
