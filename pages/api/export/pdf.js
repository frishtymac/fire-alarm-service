import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import sizeOf from 'image-size';
import fs from 'fs';
import xlsx from 'xlsx';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { technician, after, before, format } = req.query;
  let query = supabase.from('checklists').select('*').order('created_at', { ascending: false });

  if (technician) query = query.eq('technician', technician);
  if (after) query = query.gte('created_at', after);
  if (before) query = query.lte('created_at', before);

  const { data: checklists, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  if (format === 'excel') {
    const rows = checklists.map((item) => ({
      Technician: item.technician,
      Notes: item.notes,
      Date: item.created_at,
      File_URLs: (item.file_urls || []).join(', '),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'Checklists');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="chubb_checklists.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename="chubb_report.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  for (const item of checklists) {
    doc.addPage();
    doc.fontSize(16).text('Chubb Checklist Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Technician: ${item.technician}`);
    doc.text(`Date: ${new Date(item.created_at).toLocaleString()}`);
    doc.moveDown();
    doc.text(`Notes: ${item.notes || 'N/A'}`);
    doc.moveDown();

    if (item.file_urls?.length) {
      for (const url of item.file_urls) {
        if (url.match(/\.(jpg|jpeg|png)$/i)) {
          try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const tempPath = `/tmp/temp-${Date.now()}.jpg`;
            fs.writeFileSync(tempPath, response.data);
            const size = sizeOf(tempPath);
            const scale = Math.min(400 / size.width, 300 / size.height);
            doc.image(tempPath, { fit: [size.width * scale, size.height * scale] });
            fs.unlinkSync(tempPath);
          } catch {
            doc.text(`Error loading image: ${url}`);
          }
        } else {
          doc.fillColor('blue').text(url, { link: url, underline: true });
        }
        doc.moveDown(0.5);
      }
    }
    doc.moveDown();
  }

  doc.end();
}