export default function LoadingState({ label = 'Carregando seu conteúdo…' }) {
  return <div className="loading-state"><span className="spinner" /><p>{label}</p></div>
}
