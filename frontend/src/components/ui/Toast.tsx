import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { clearToast } from '../../store/uiSlice';

export default function Toast() {
  const dispatch = useDispatch<AppDispatch>();
  const { toastMessage, toastType } = useSelector((s: RootState) => s.ui);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toastMessage) {
      timerRef.current = setTimeout(() => dispatch(clearToast()), 3500);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toastMessage, dispatch]);

  if (!toastMessage) return null;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toastType}`}>
        <span>{icons[toastType]}</span>
        <span>{toastMessage}</span>
        <button
          onClick={() => dispatch(clearToast())}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '16px' }}
        >×</button>
      </div>
    </div>
  );
}
