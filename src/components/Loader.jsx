import { useLoader } from '../hooks/useLoader';
import { asset } from '../lib/asset';

export default function Loader({ onComplete }) {
  const { done, progress } = useLoader(onComplete);

  if (done) return null;

  return (
    <div className={`loader${done ? ' done' : ''}`} id="loader">
      <div className="loader-inner">
        <img src={asset('/assets/logo-mark-cream-flat.webp')} alt="Sugar &amp; Leather" />
        <div className="loader-bar">
          <i id="loaderFill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-word">Built. Not given.</div>
      </div>
    </div>
  );
}
