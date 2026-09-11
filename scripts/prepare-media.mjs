import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const categories=['hero','train_start','train_story','journey_proof','hyderabad','charminar','charminar_portraits','bangle_reveal','bloopers','photobooth'];
const manifest=JSON.parse(await readFile('content/media.json','utf8'));
for(const category of categories){
 const dir=path.join('media-inbox',category);await mkdir(dir,{recursive:true});
 await mkdir(path.join('public/photos',category),{recursive:true});
 for(const name of await readdir(dir)){
  if(!/\.(jpe?g|png|webp|avif|heic)$/i.test(name))continue;
  const file=`/photos/${category}/${path.parse(name).name}.webp`;
  const pipeline=sharp(path.join(dir,name)).rotate().resize({width:2000,height:2400,fit:'inside',withoutEnlargement:true});
  const {data,info}=await pipeline.webp({quality:83}).toBuffer({resolveWithObject:true});
  await writeFile(path.join('public',file),data);
  const blur=await sharp(data).resize(16).webp({quality:30}).toBuffer();
  const previous=manifest.find(m=>m.file===file);
  const entry={category,file,caption:'[PHOTO CAPTION]',alt:'[DESCRIBE THIS PHOTOGRAPH]',priority:false,...previous,width:info.width,height:info.height,orientation:info.width===info.height?'square':info.width>info.height?'landscape':'portrait',blurDataURL:`data:image/webp;base64,${blur.toString('base64')}`};
  if(previous)Object.assign(previous,entry);else manifest.push(entry);
 }
}
await writeFile('content/media.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${manifest.length} media entries. Edit captions, alt text and priorities in content/media.json.`);


