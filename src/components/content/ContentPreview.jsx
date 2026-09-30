import { ChevronLeft, ChevronRight, Eye, MessageSquarePlus, MousePointer2 } from 'lucide-react'
import { useMemo } from 'react'

export default function ContentPreview({ content, slide, setSlide, pinMode, setPinMode, onPin, activeComment, onPinSelect, onSocialPreview }) {
  const asset = content.assets[slide]
  const pins = useMemo(() => content.comments.filter((comment) => comment.asset_id === asset.id && comment.position_x !== null), [content.comments, asset.id])
  const clickImage = (event) => {
    if (!pinMode) return
    const rect = event.currentTarget.getBoundingClientRect()
    onPin({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100, assetId: asset.id })
  }
  return (
    <section className="preview-card panel">
      <div className="preview-toolbar"><div><span className="eyebrow">PREVIEW DA PEÇA</span><strong>{slide + 1} de {content.assets.length}</strong></div><div className="preview-toolbar-actions"><button className="button secondary channel-preview-button" aria-label="Prévia no canal" onClick={onSocialPreview}><Eye size={16} />Ver no canal</button><button className={`button ${pinMode ? 'pin-active' : 'secondary'}`} onClick={() => setPinMode(!pinMode)}><MessageSquarePlus size={16} />{pinMode ? 'Clique na imagem' : 'Comentar na peça'}</button></div></div>
      <div className={`media-stage ${pinMode ? 'placing-pin' : ''}`} onClick={clickImage}>
        <img src={asset.url} alt={asset.alt_text} />
        <div className="creative-overlay"><small>SABOR DA VILA APRESENTA</small><h2>{slide === 0 ? 'Festival de\nMassas' : slide === 1 ? 'Três receitas.\nUma experiência.' : 'Sua mesa\nestá esperando.'}</h2><span>{slide === 2 ? '03—12 OUT · RESERVE AGORA' : 'EDIÇÃO ESPECIAL · OUTUBRO'}</span></div>
        {pinMode && <div className="pin-instruction"><MousePointer2 size={16} /> Clique no ponto que deseja comentar</div>}
        {pins.map((comment, index) => <button key={comment.id} className={`comment-pin ${activeComment === comment.id ? 'active' : ''}`} style={{ left: `${comment.position_x}%`, top: `${comment.position_y}%` }} onClick={(event) => { event.stopPropagation(); onPinSelect(comment.id) }} aria-label={`Comentário ${index + 1}`}>{index + 1}</button>)}
        {content.assets.length > 1 && <><button className="carousel-arrow left" onClick={(event) => { event.stopPropagation(); setSlide((slide - 1 + content.assets.length) % content.assets.length) }}><ChevronLeft /></button><button className="carousel-arrow right" onClick={(event) => { event.stopPropagation(); setSlide((slide + 1) % content.assets.length) }}><ChevronRight /></button></>}
      </div>
      <div className="carousel-footer"><div className="slide-thumbnails">{content.assets.map((item, index) => <button className={index === slide ? 'active' : ''} key={item.id} onClick={() => setSlide(index)}><img src={item.url} alt={`Slide ${index + 1}`} /><span>{index + 1}</span></button>)}</div><div className="slide-dots">{content.assets.map((item, index) => <button className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} key={item.id} aria-label={`Slide ${index + 1}`} />)}</div></div>
    </section>
  )
}
