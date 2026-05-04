import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge, Skeleton } from '@/components/ui';
import { listUsers, setUserEnabled, type UserRow } from '@/api/superadmin';

export default function SuperAdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => { listUsers().then(setUsers).catch(() => setUsers([])); }, []);

  const toggle = async (u: UserRow) => {
    if (busy) return;
    if (!u.enabled || confirm(t('superAdmin.confirmDisable'))) {
      setBusy(u.id);
      try {
        const updated = await setUserEnabled(u.id, !u.enabled);
        setUsers((arr) => arr ? arr.map((x) => (x.id === u.id ? updated : x)) : arr);
      } finally {
        setBusy(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('superAdmin.tabUsers')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-subtle">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">{t('common.role')}</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">{t('common.status')}</th>
                <th className="px-4 py-3 font-medium text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!users && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-5 w-2/3" /></td></tr>
              ))}
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-fg/[0.02]">
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3 text-subtle">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === 'SUPER_ADMIN' ? 'red' : u.role === 'CANDIDATE' ? 'blue' : 'violet'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-subtle">{u.companyId ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.enabled ? 'green' : 'gray'}>
                      {u.enabled ? t('common.enabled') : t('common.disabled')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'SUPER_ADMIN' && (
                      <Button
                        size="sm"
                        variant={u.enabled ? 'outline' : 'primary'}
                        loading={busy === u.id}
                        onClick={() => toggle(u)}
                      >
                        {u.enabled ? t('superAdmin.disableUser') : t('superAdmin.enableUser')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
