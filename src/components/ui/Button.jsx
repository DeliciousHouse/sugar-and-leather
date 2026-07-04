import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMagnetic } from '../../hooks/useMagnetic';
import { hashHref } from '../../lib/asset';

function isInternalRoute(href) {
  return href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#');
}

function isHashRoute(href) {
  return href && href.startsWith('/#');
}

export default function Button({
  href,
  variant = 'cream',
  magnetic = false,
  children,
  className = '',
  showArrow = true,
  onClick,
  ...props
}) {
  const magneticProps = useMagnetic(0.14);
  const classes = `btn btn-${variant} ${className}`.trim();
  const handlers = magnetic
    ? {
        ref: magneticProps.ref,
        onMouseMove: magneticProps.onMouseMove,
        onMouseLeave: magneticProps.onMouseLeave,
        'data-magnetic': true,
      }
    : {};

  const content = (
    <>
      <span className="lab">{children}</span>
      {showArrow && variant === 'cream' ? <ArrowRight size={16} strokeWidth={1.75} /> : null}
    </>
  );

  if (href && isInternalRoute(href)) {
    return (
      <Link to={href} className={classes} onClick={onClick} {...handlers} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    const anchorHref = isHashRoute(href) ? hashHref(href.slice(1)) : href;
    return (
      <a href={anchorHref} className={classes} onClick={onClick} {...handlers} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...handlers} {...props}>
      {content}
    </button>
  );
}

export { isHashRoute, isInternalRoute };
