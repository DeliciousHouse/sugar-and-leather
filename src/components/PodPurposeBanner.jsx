import Reveal from './ui/Reveal';

export default function PodPurposeBanner({ purpose, tone = 'light' }) {
  if (!purpose) return null;

  return (
    <section className={`section pod-purpose-banner surface-${tone}`}>
      <div className="wrap">
        <Reveal>
          <div className="pod-purpose-box">
            <p className="pod-purpose-label">Purpose</p>
            <p className="pod-purpose-text">{purpose}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
