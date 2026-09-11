'use client';
import Image from 'next/image';
import {useState} from 'react';
import {media,story} from '@/content/story';
import {Reveal} from './Shared';
export function Transit(){const items=media.filter(m=>m.category==='train_story');return <section className="transit"><div className="transit-title"><p className="eyebrow">05 / IN TRANSIT</p><h2>But the reason<br/><em>stayed the same.</em></h2></div><div className="transit-frames">{items.map((m,i)=><Reveal key={m.file}><figure><Image src={m.file} alt={m.alt} width={m.width} height={m.height} sizes="(max-width:700px) 90vw, 45vw" placeholder="blur" blurDataURL={m.blurDataURL}/><figcaption>{['Hours passed.','Stations passed.','States passed.'][i]}</figcaption></figure></Reveal>)}</div></section>}
export function BirthdayWish(){const[open,setOpen]=useState(false);return <section className="section birthday gift-birthday"><Reveal><p className="eyebrow">FOR YOU. ALWAYS.</p><h2>Happy Birthday,<br/><em>{story.herName}.</em></h2><button className="outline-button" aria-expanded={open} aria-controls="birthday-letter" onClick={()=>setOpen(!open)}>{open?'Fold the letter':'Open your birthday wish'}</button>{open&&<div id="birthday-letter" className="wish-copy opened-letter">{story.birthdayWish.map(p=><p key={p}>{p}</p>)}<p>Happy Birthday, my favourite person.</p></div>}</Reveal></section>}
