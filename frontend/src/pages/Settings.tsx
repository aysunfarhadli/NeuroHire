import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm text-subtle mt-1">{t('settings.sub')}</p>
      </div>

      <Card>
        <CardHeader title={t('settings.profile')} />
        <CardBody className="space-y-2 text-sm">
          <Row label={t('settings.fullName')} value={user?.fullName} />
          <Row label={t('settings.email')} value={user?.email} />
          <Row label={t('settings.role')} value={user?.role} />
          <Row label={t('settings.company')} value={user?.companyId ? `#${user.companyId}` : '—'} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t('settings.appearance')} subtitle={t('settings.appearanceSub')} />
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t('settings.theme')}</div>
              <div className="text-xs text-subtle">{t('settings.currentTheme', { theme })}</div>
            </div>
            <button
              onClick={toggle}
              className="h-9 px-4 rounded-lg border border-border hover:bg-fg/[0.04] text-sm font-medium"
            >
              {theme === 'dark' ? t('settings.switchToLight') : t('settings.switchToDark')}
            </button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t('settings.apiTitle')} subtitle={t('settings.apiSub')} />
        <CardBody className="text-sm space-y-1.5">
          <Row label={t('settings.swaggerUi')} value={<a className="text-brand-600 dark:text-brand-400" href="/swagger-ui.html" target="_blank" rel="noreferrer">/swagger-ui.html</a>} />
          <Row label={t('settings.openapi')} value={<a className="text-brand-600 dark:text-brand-400" href="/v3/api-docs" target="_blank" rel="noreferrer">/v3/api-docs</a>} />
          <Row label={t('settings.health')} value={<a className="text-brand-600 dark:text-brand-400" href="/api/meta/health" target="_blank" rel="noreferrer">/api/meta/health</a>} />
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-border last:border-0 py-2">
      <span className="text-subtle">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  );
}
