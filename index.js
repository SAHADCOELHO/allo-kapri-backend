const express=require("express");const cors=require("cors");const path=require("path");const fs=require("fs");const xlsx=require("xlsx");
const app=express();app.use(cors());const PORT=process.env.PORT||5050;const EXCEL_PATH=process.env.EXCEL_PATH||path.join(__dirname,"public","allo-kapri-catalog.xlsx");
app.get("/healthz",(_req,res)=>res.status(200).json({ok:true}));
function readCatalog(filePath){if(!fs.existsSync(filePath))throw new Error(`Excel não encontrado em ${filePath}`);const wb=xlsx.readFile(filePath);const ws=wb.Sheets[wb.SheetNames[0]];const rows=xlsx.utils.sheet_to_json(ws,{defval:""});const items=rows.map((r,idx)=>({sku:r.sku||r.SKU||r.id||`item-${idx+1}`,name:r.name||r.model||r.Model||r["Nome"]||"Produto",price:r.price||r.Price||r["Preço"]||r["Preco"]||"",...r}));return{items,count:items.length};}
app.get("/api/catalog",(_req,res)=>{try{const data=readCatalog(EXCEL_PATH);res.json(data);}catch(err){console.error("[catalog error]",err.message);res.status(500).json({error:"failed_to_build_catalog",detail:err.message});}});
app.listen(PORT,()=>console.log(`[server] listening on http://0.0.0.0:${PORT}\n[server] EXCEL_PATH=${EXCEL_PATH}`));
