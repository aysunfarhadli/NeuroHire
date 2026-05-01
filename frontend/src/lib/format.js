export function formatBytes(n) {
    if (n < 1024)
        return `${n} B`;
    if (n < 1024 * 1024)
        return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
export function formatDate(iso) {
    if (!iso)
        return '—';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
}
export function relativeTime(iso) {
    if (!iso)
        return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24)
        return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    if (days < 30)
        return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}
