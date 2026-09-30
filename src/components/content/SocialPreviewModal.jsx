import { BatteryMedium, Bookmark, BriefcaseBusiness, Camera, ChevronDown, ChevronLeft, ChevronRight, Heart, Home, MessageCircle, MoreHorizontal, Music2, Play, Plus, Repeat2, Search, Send, Signal, Smartphone, ThumbsUp, UserRound, Wifi, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const networks = [
  { value: 'instagram', label: 'Instagram Feed', icon: Camera },
  { value: 'stories', label: 'Stories', icon: Smartphone },
  { value: 'tiktok', label: 'TikTok', icon: Play },
  { value: 'linkedin', label: 'LinkedIn', icon: BriefcaseBusiness },
]

const Profile = () => <span className="social-avatar">SV</span>

function PhoneStatus() {
  return <div className="phone-status"><strong>9:41</strong><span><Signal size={12} /><Wifi size={12} /><BatteryMedium size={15} /></span></div>
}

function MediaCarousel({ assets, assetIndex, onAssetChange, variant }) {
  const swipeStart = useRef(null)
  const changeBy = (direction) => onAssetChange((assetIndex + direction + assets.length) % assets.length)
  const finishSwipe = (event) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) >= 35) changeBy(distance < 0 ? 1 : -1)
  }

  return (
    <div
      className={`social-media-window ${variant} social-media-carousel`}
      onPointerDown={(event) => { swipeStart.current = event.clientX }}
      onPointerUp={finishSwipe}
      onPointerCancel={() => { swipeStart.current = null }}
    >
      <img className="social-preview-image" src={assets[assetIndex].url} alt={assets[assetIndex].alt_text} draggable="false" />
      {assets.length > 1 && <>
        <button className="carousel-arrow previous" onClick={() => changeBy(-1)} aria-label="Imagem anterior"><ChevronLeft /></button>
        <button className="carousel-arrow next" onClick={() => changeBy(1)} aria-label="Próxima imagem"><ChevronRight /></button>
        <span className="carousel-position">{assetIndex + 1}/{assets.length}</span>
      </>}
    </div>
  )
}

function InstagramFeed({ content, assets, assetIndex, onAssetChange }) {
  return <div className="social-screen instagram-screen"><PhoneStatus /><div className="instagram-brand"><strong>Instagram</strong><div><Heart size={21} /><MessageCircle size={20} /></div></div><div className="social-post-author"><Profile /><div><strong>sabor.davila</strong><small>São Paulo, Brasil</small></div><MoreHorizontal size={18} /></div><MediaCarousel assets={assets} assetIndex={assetIndex} onAssetChange={onAssetChange} variant="square" /><div className="instagram-actions"><span><Heart /><MessageCircle /><Send /></span><span className="social-dots" aria-label="Imagens do carrossel">{assets.map((item, index) => <button className={index === assetIndex ? 'active' : ''} onClick={() => onAssetChange(index)} aria-label={`Ver imagem ${index + 1}`} key={item.id} />)}</span><Bookmark /></div><div className="instagram-copy"><strong>1.248 curtidas</strong><p><b>sabor.davila</b> {content.caption?.split('\n')[0]}</p><small>Ver todos os 18 comentários</small><time>HÁ 2 MINUTOS</time></div><div className="phone-nav"><Home fill="currentColor" /><Search /><Plus /><Play /><UserRound /></div></div>
}

function Stories({ content, asset, assets, assetIndex }) {
  return <div className="social-screen stories-screen"><img className="social-preview-image" src={asset.url} alt={asset.alt_text} /><div className="story-shade" /><div className="story-progress">{assets.map((item, index) => <i className={index === assetIndex ? 'active' : ''} key={item.id} />)}</div><PhoneStatus /><div className="story-author"><Profile /><strong>sabor.davila</strong><small>2 min</small><MoreHorizontal /><X /></div><div className="story-copy"><small>SABOR DA VILA</small><strong>{content.title}</strong><span>Toque para reservar ↑</span></div><div className="story-reply"><span>Enviar mensagem</span><Heart /><Send /></div></div>
}

function TikTok({ content, asset }) {
  return <div className="social-screen tiktok-screen"><img className="social-preview-image" src={asset.url} alt={asset.alt_text} /><div className="tiktok-shade" /><PhoneStatus /><div className="tiktok-top"><span>Seguindo</span><strong>Para você</strong><Search /></div><div className="tiktok-actions"><Profile /><span><Heart fill="currentColor" /><small>12,4K</small></span><span><MessageCircle fill="currentColor" /><small>328</small></span><span><Bookmark fill="currentColor" /><small>1.102</small></span><span><Send fill="currentColor" /><small>Enviar</small></span></div><div className="tiktok-copy"><strong>@sabor.davila</strong><p>{content.caption?.split('\n')[0]}</p><span><Music2 size={13} /> som original · Sabor da Vila</span></div><div className="tiktok-nav"><strong><Home fill="currentColor" />Início</strong><span><Search />Descobrir</span><i><Plus /></i><span><MessageCircle />Caixa de entrada</span><span><UserRound />Perfil</span></div></div>
}

function LinkedIn({ content, assets, assetIndex, onAssetChange }) {
  return <div className="social-screen linkedin-screen"><PhoneStatus /><div className="linkedin-top"><Profile /><div><Search size={15} />Pesquisar</div><MessageCircle /></div><div className="linkedin-card"><div className="social-post-author"><Profile /><div><strong>Restaurante Sabor da Vila</strong><small>1.486 seguidores · 2 min</small></div><MoreHorizontal /></div><p>{content.caption?.split('\n').slice(0, 2).join(' ')}</p><MediaCarousel assets={assets} assetIndex={assetIndex} onAssetChange={onAssetChange} variant="linkedin" /><div className="linkedin-reactions"><span>👍 ❤️</span><small>84 · 12 comentários</small></div><div className="linkedin-actions"><span><ThumbsUp />Gostei</span><span><MessageCircle />Comentar</span><span><Repeat2 />Compartilhar</span><span><Send />Enviar</span></div></div><div className="phone-nav linkedin-nav"><Home fill="currentColor" /><BriefcaseBusiness /><Plus /><MessageCircle /><UserRound /></div></div>
}

export default function SocialPreviewModal({ open, onClose, content, asset }) {
  const suggested = useMemo(() => content.channel.includes('Stories') ? 'stories' : 'instagram', [content.channel])
  const [network, setNetwork] = useState(suggested)
  const [assetIndex, setAssetIndex] = useState(() => Math.max(0, content.assets.findIndex((item) => item.id === asset.id)))

  useEffect(() => {
    if (!open) return
    setAssetIndex(Math.max(0, content.assets.findIndex((item) => item.id === asset.id)))
  }, [open, asset.id, content.assets])

  if (!open) return null

  const previews = { instagram: InstagramFeed, stories: Stories, tiktok: TikTok, linkedin: LinkedIn }
  const Preview = previews[network]
  const selectedAsset = content.assets[assetIndex]

  return (
    <div className="social-preview-backdrop" onMouseDown={onClose} role="presentation">
      <section className="social-preview-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Prévia no canal">
        <header><div><span className="eyebrow">SIMULAÇÃO DE PUBLICAÇÃO</span><h2>Prévia no canal</h2><p>Veja como o conteúdo aparece antes de publicar.</p></div><button className="icon-button" onClick={onClose} aria-label="Fechar prévia"><X /></button></header>
        <div className="social-preview-layout">
          <aside className="network-picker"><span>Escolha o formato</span>{networks.map(({ value, label, icon: Icon }) => <button className={network === value ? 'active' : ''} onClick={() => setNetwork(value)} key={value}><Icon size={17} /><div><strong>{label}</strong><small>{value === suggested ? 'Formato sugerido' : 'Visualizar adaptação'}</small></div>{network === value && <i>✓</i>}</button>)}<div className="preview-note"><strong>Carrossel interativo</strong><p>Arraste a imagem ou use as setas e os pontos para navegar entre as peças.</p></div></aside>
          <div className="phone-preview-area"><div className="phone-label"><span>Visualizando</span><strong>{networks.find((item) => item.value === network)?.label}</strong><ChevronDown size={14} /></div><div className="phone-frame"><div className="phone-speaker" /><Preview content={content} asset={selectedAsset} assets={content.assets} assetIndex={assetIndex} onAssetChange={setAssetIndex} /></div></div>
        </div>
      </section>
    </div>
  )
}
