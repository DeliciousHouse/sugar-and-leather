import { Link } from 'react-router-dom';
import { asset } from '../../lib/asset';
import { useMagnetic } from '../../hooks/useMagnetic';

export default function Brand({ className = '' }) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic();

  return (
    <Link
      to="/"
      className={`brand ${className}`.trim()}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-magnetic
    >
      <img src={asset('/assets/logo-mark-cream-flat.webp')} alt="" />
      <span className="brand-name">
        Sugar <span className="brand-amp">&amp;</span> Leather
      </span>
    </Link>
  );
}
