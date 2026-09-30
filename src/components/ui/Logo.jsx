export default function Logo({ compact = false }) {
  return (
    <div className="logo" aria-label="Clarifi">
      <span className="logo-mark"><span /><span /><span /></span>
      {!compact && <span>clarifi<span className="logo-dot">.</span></span>}
    </div>
  )
}
