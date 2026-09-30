export const statusMap = {
  draft: { label: 'Rascunho', tone: 'gray' },
  pending: { label: 'Pendente', tone: 'amber' }, approved: { label: 'Aprovado', tone: 'green' },
  changes_requested: { label: 'Alteração solicitada', tone: 'red' }, in_review: { label: 'Em revisão', tone: 'blue' },
  published: { label: 'Publicado', tone: 'gray' },
}

export const formatDate = (date, options = {}) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', ...options,
}).format(new Date(date)).replace('.', '')

export const formatShortDate = (date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(date)).replace('.', '')

export const formatTimeAgo = (date) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000))
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return hours < 24 ? `há ${hours}h` : formatDate(date, { year: undefined })
}
