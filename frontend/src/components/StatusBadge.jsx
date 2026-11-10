export default function StatusBadge({ status }) {
  const styles = { Present: 'status-present', Late: 'status-late', Absent: 'status-absent', Pending: 'status-pending' }
  return <span className={`status-pill ${styles[status] || 'status-pending'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>
}
