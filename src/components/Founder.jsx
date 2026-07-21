import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FOUNDERS } from '../data/siteContent';
import Eyebrow from './ui/Eyebrow';

const FOUNDER_AUTOPLAY_MS = 14000;

function FounderSlide({ founder }) {
  const paragraphs = Array.isArray(founder.body) ? founder.body : [founder.body];
  const press = founder.press;

  return (
    <div className="founder-slide-inner">
      <div className="founder-grid">
        <div className="founder-media">
          <div className="founder-portrait">
            <img src={founder.image} alt={founder.name} />
            <span className="fp-tag">{founder.tag}</span>
          </div>
        </div>
        <div className="founder-text">
          <Eyebrow>{founder.eyebrow}</Eyebrow>
          <p className="founder-quote">
            {founder.quote}
            {founder.breakBeforeHighlight ? <br /> : ' '}
            <span className="hl">{founder.quoteHighlight}</span>
            {founder.quoteEnd ? ` ${founder.quoteEnd}` : ''}
          </p>
          <div className="founder-body">
            {paragraphs.map((paragraph, i) => {
              const isLead = i === 0 && paragraph.length < 90;
              const isClose = i === paragraphs.length - 1 && paragraph.length < 120;
              const className = [
                isLead && 'founder-body-lead',
                isClose && 'founder-body-close',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <p key={paragraph} className={className || undefined}>
                  {paragraph}
                </p>
              );
            })}
          </div>
          {press ? (
            <div className="founder-press">
              <p className="founder-press-label">{press.label}</p>
              <div className="founder-press-links">
                {press.links.map((link, i) => (
                  <span key={link.href} className="founder-press-item">
                    {i > 0 ? <span className="founder-press-sep" aria-hidden="true">|</span> : null}
                    <a
                      className="founder-press-link"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read about ${founder.name} in ${link.name}`}
                    >
                      <img src={link.logo} alt={link.name} loading="lazy" decoding="async" />
                    </a>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="founder-sign">
            <span className="sig">{founder.name}</span>
            <span className="who">{founder.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Founder() {
  const [index, setIndex] = useState(0);
  const [slowEnter, setSlowEnter] = useState(false);
  const [frameHeight, setFrameHeight] = useState(undefined);
  const timerRef = useRef(null);
  const frameRef = useRef(null);
  const slideRefs = useRef([]);
  const count = FOUNDERS.length;

  const syncFrameHeight = () => {
    const slide = slideRefs.current[index];
    if (!slide) return;
    const nextHeight = Math.ceil(slide.getBoundingClientRect().height);
    if (nextHeight > 0) setFrameHeight(nextHeight);
  };

  const goTo = (nextIndex) => {
    const normalized = ((nextIndex % count) + count) % count;
    setSlowEnter(normalized === 1);
    setIndex(normalized);
  };

  const restartAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % count;
        setSlowEnter(next === 1);
        return next;
      });
    }, FOUNDER_AUTOPLAY_MS);
  };

  useLayoutEffect(() => {
    syncFrameHeight();
  }, [index]);

  useEffect(() => {
    const onResize = () => syncFrameHeight();
    window.addEventListener('resize', onResize);

    const images = frameRef.current?.querySelectorAll('img') ?? [];
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', syncFrameHeight);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      images.forEach((img) => img.removeEventListener('load', syncFrameHeight));
    };
  }, [index]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  const handleManualNav = (nextIndex) => {
    goTo(nextIndex);
    restartAutoplay();
  };

  return (
    <section
      className="section founder"
      id="founder"
      data-screen-label="Founder"
      onMouseEnter={() => {
        if (timerRef.current) clearInterval(timerRef.current);
      }}
      onMouseLeave={restartAutoplay}
    >
      <div className="wrap">
        <div className="founder-carousel">
          <div
            className="founder-car-frame"
            ref={frameRef}
            style={frameHeight ? { height: frameHeight } : undefined}
          >
            <div
              className={`founder-car-track${slowEnter ? ' founder-car-track--slow-enter' : ''}`}
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {FOUNDERS.map((founder, i) => (
                <div
                  key={founder.id}
                  className="founder-slide"
                  ref={(node) => {
                    slideRefs.current[i] = node;
                  }}
                  aria-hidden={i !== index}
                >
                  <FounderSlide founder={founder} />
                </div>
              ))}
            </div>
          </div>
          {count > 1 ? (
            <div className="founder-car-ctrl">
              <div className="founder-car-dots">
                {FOUNDERS.map((founder, i) => (
                  <button
                    key={founder.id}
                    type="button"
                    className={`founder-car-dot${i === index ? ' on' : ''}`}
                    aria-label={`Show ${founder.name}`}
                    onClick={() => handleManualNav(i)}
                  />
                ))}
              </div>
              <div className="founder-car-arrows">
                <button
                  type="button"
                  className="founder-car-arrow"
                  aria-label="Previous founder"
                  onClick={() => handleManualNav(index - 1)}
                >
                  <ArrowLeft size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  className="founder-car-arrow"
                  aria-label="Next founder"
                  onClick={() => handleManualNav(index + 1)}
                >
                  <ArrowRight size={18} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
