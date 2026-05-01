import { Card, CardBody, CardHeader } from '@/components/ui';
import { useAuth } from '@/store/auth';
import { useTheme } from '@/store/theme';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-subtle mt-1">Account, appearance, and integrations.</p>
      </div>

      <Card>
        <CardHeader title="Profile" />
        <CardBody className="space-y-2 text-sm">
          <Row label="Full name" value={user?.fullName} />
          <Row label="Email" value={user?.email} />
          <Row label="Role" value={user?.role} />
          <Row label="Company" value={user?.companyId ? `#${user.companyId}` : '—'} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Appearance" subtitle="Pick a theme that suits you" />
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-subtle">Currently: {theme}</div>
            </div>
            <button
              onClick={toggle}
              className="h-9 px-4 rounded-lg border border-border hover:bg-fg/[0.04] text-sm font-medium"
            >
              Switch to {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="API access" subtitle="Use these endpoints from any frontend" />
        <CardBody className="text-sm space-y-1.5">
          <Row label="Swagger UI" value={<a className="text-brand-600 dark:text-brand-400" href="/swagger-ui.html" target="_blank">/swagger-ui.html</a>} />
          <Row label="OpenAPI JSON" value={<a className="text-brand-600 dark:text-brand-400" href="/v3/api-docs" target="_blank">/v3/api-docs</a>} />
          <Row label="Health" value={<a className="text-brand-600 dark:text-brand-400" href="/api/meta/health" target="_blank">/api/meta/health</a>} />
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
