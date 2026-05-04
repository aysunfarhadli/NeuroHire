import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui';

export default function Forbidden() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('common.forbiddenTitle')}</h1>
        <p className="mt-2 text-subtle">{t('common.forbiddenBody')}</p>
        <Link to="/" className="inline-block mt-6">
          <Button variant="outline" iconLeft={<ArrowLeft className="h-4 w-4" />}>{t('common.back')}</Button>
        </Link>
      </div>
    </div>
  );
}
