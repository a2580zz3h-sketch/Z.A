// ===== Global Variables =====
let coverImage = null;
let generatedPDF = null;
let currentLang = 'ar';
const { jsPDF } = window.jspdf;

// ===== Translations =====
const i18n = {
    ar: {
        tagline: 'حوّل صورك ونصوصك إلى ملفات PDF بأناقة',
        filenameLabel: 'اسم الملف',
        textLabel: 'النص',
        coverLabel: 'صورة الغلاف الخارجي',
        coverUploadText: 'اسحب صورة الغلاف هنا أو',
        clickSelect: 'اضغط للاختيار',
        coverHint: 'هذه الصورة تظهر في صفحة الغلاف الأولى',
        generateBtn: 'توليد المستند',
        downloadBtn: 'تحميل PDF',
        processing: 'جاري المعالجة...',
        successMsg: 'تم إنشاء الملف بنجاح!',
        previewTitle: 'معاينة الملف',
        previewPlaceholder: 'المحتوى يظهر هنا',
        developer: 'المطور',
        devDesc: 'مطور برمجي خبير في بناء ملفات متعددة مثل المواقع والملفات والبوتات — تلجرام وواتساب. يحب القراءة ويحب الهدوء.',
        contactLord: 'تواصل مع LORD',
        footerBrand: 'إيثار',
        footerTag: 'صُنع بإتقان',
        notifyNoContent: 'أضف نص أو صورة غلاف أولاً',
        notifyCoverUpload: 'تم رفع صورة الغلاف بنجاح',
        notifyDownload: 'تم التحميل!',
        notifyError: 'حدث خطأ أثناء المعالجة',
        notifyFileType: 'الملف يجب أن يكون صورة',
        notifyFileSize: 'حجم الصورة يجب أن يكون أقل من 10MB',
        pdfCoverLabel: 'الغلاف',
        pdfContentLabel: 'المحتوى',
        pdfFooter: 'إيثار',
        langName: 'العربية'
    },
    en: {
        tagline: 'Convert your images and text into elegant PDF files',
        filenameLabel: 'File Name',
        textLabel: 'Text Content',
        coverLabel: 'Cover Image',
        coverUploadText: 'Drag cover image here or',
        clickSelect: 'click to select',
        coverHint: 'This image appears on the first cover page',
        generateBtn: 'Generate Document',
        downloadBtn: 'Download PDF',
        processing: 'Processing...',
        successMsg: 'File created successfully!',
        previewTitle: 'File Preview',
        previewPlaceholder: 'Content will appear here',
        developer: 'Developer',
        devDesc: 'Expert developer in building various files such as websites, documents, and bots — Telegram and WhatsApp. Loves reading and enjoys silence.',
        contactLord: 'Contact LORD',
        footerBrand: 'Eithar',
        footerTag: 'Crafted with care',
        notifyNoContent: 'Add text or a cover image first',
        notifyCoverUpload: 'Cover image uploaded successfully',
        notifyDownload: 'Downloaded!',
        notifyError: 'An error occurred during processing',
        notifyFileType: 'File must be an image',
        notifyFileSize: 'Image size must be less than 10MB',
        pdfCoverLabel: 'Cover',
        pdfContentLabel: 'Content',
        pdfFooter: 'Eithar',
        langName: 'English'
    },
    ru: {
        tagline: 'Преобразуйте изображения и текст в элегантные PDF-файлы',
        filenameLabel: 'Имя файла',
        textLabel: 'Текст',
        coverLabel: 'Изображение обложки',
        coverUploadText: 'Перетащите изображение обложки сюда или',
        clickSelect: 'нажмите для выбора',
        coverHint: 'Это изображение отображается на первой странице обложки',
        generateBtn: 'Создать документ',
        downloadBtn: 'Скачать PDF',
        processing: 'Обработка...',
        successMsg: 'Файл успешно создан!',
        previewTitle: 'Предпросмотр',
        previewPlaceholder: 'Содержимое появится здесь',
        developer: 'Разработчик',
        devDesc: 'Эксперт-разработчик по созданию различных файлов, таких как веб-сайты, документы и боты — Telegram и WhatsApp. Любит чтение и тишину.',
        contactLord: 'Связаться с LORD',
        footerBrand: 'Eithar',
        footerTag: 'Создано с заботой',
        notifyNoContent: 'Сначала добавьте текст или изображение обложки',
        notifyCoverUpload: 'Изображение обложки успешно загружено',
        notifyDownload: 'Загружено!',
        notifyError: 'Произошла ошибка во время обработки',
        notifyFileType: 'Файл должен быть изображением',
        notifyFileSize: 'Размер изображения должен быть менее 10 МБ',
        pdfCoverLabel: 'Обложка',
        pdfContentLabel: 'Содержимое',
        pdfFooter: 'Eithar',
        langName: 'Русский'
    },
    zh: {
        tagline: '将您的图像和文本转换为精美的 PDF 文件',
        filenameLabel: '文件名',
        textLabel: '文本内容',
        coverLabel: '封面图片',
        coverUploadText: '将封面图片拖放到此处或',
        clickSelect: '点击选择',
        coverHint: '此图片显示在第一页封面上',
        generateBtn: '生成文档',
        downloadBtn: '下载 PDF',
        processing: '处理中...',
        successMsg: '文件创建成功！',
        previewTitle: '文件预览',
        previewPlaceholder: '内容将显示在此处',
        developer: '开发者',
        devDesc: '精通构建各种文件的开发专家，例如网站、文档和机器人 — Telegram 和 WhatsApp。喜欢阅读，享受宁静。',
        contactLord: '联系 LORD',
        footerBrand: 'Eithar',
        footerTag: '精心制作',
        notifyNoContent: '请先添加文本或封面图片',
        notifyCoverUpload: '封面图片上传成功',
        notifyDownload: '已下载！',
        notifyError: '处理过程中发生错误',
        notifyFileType: '文件必须是图片',
        notifyFileSize: '图片大小必须小于 10MB',
        pdfCoverLabel: '封面',
        pdfContentLabel: '内容',
        pdfFooter: 'Eithar',
        langName: '中文'
    },
    ja: {
        tagline: '画像とテキストをエレガントなPDFファイルに変換',
        filenameLabel: 'ファイル名',
        textLabel: 'テキスト内容',
        coverLabel: '表紙画像',
        coverUploadText: '表紙画像をここにドラッグするか',
        clickSelect: 'クリックして選択',
        coverHint: 'この画像は最初の表紙ページに表示されます',
        generateBtn: 'ドキュメントを生成',
        downloadBtn: 'PDFをダウンロード',
        processing: '処理中...',
        successMsg: 'ファイルが正常に作成されました！',
        previewTitle: 'ファイルプレビュー',
        previewPlaceholder: 'コンテンツがここに表示されます',
        developer: '開発者',
        devDesc: 'ウェブサイト、ドキュメント、ボット — TelegramやWhatsAppなど、さまざまなファイルの構築の専門家。読書が好きで、静寂を楽しむ。',
        contactLord: 'LORDに連絡',
        footerBrand: 'Eithar',
        footerTag: '丁寧に作られました',
        notifyNoContent: '最初にテキストまたは表紙画像を追加してください',
        notifyCoverUpload: '表紙画像が正常にアップロードされました',
        notifyDownload: 'ダウンロード完了！',
        notifyError: '処理中にエラーが発生しました',
        notifyFileType: 'ファイルは画像である必要があります',
        notifyFileSize: '画像サイズは10MB未満である必要があります',
        pdfCoverLabel: '表紙',
        pdfContentLabel: '内容',
        pdfFooter: 'Eithar',
        langName: '日本語'
    },
    id: {
        tagline: 'Ubah gambar dan teks Anda menjadi file PDF yang elegan',
        filenameLabel: 'Nama File',
        textLabel: 'Teks',
        coverLabel: 'Gambar Sampul',
        coverUploadText: 'Seret gambar sampul ke sini atau',
        clickSelect: 'klik untuk memilih',
        coverHint: 'Gambar ini muncul di halaman sampul pertama',
        generateBtn: 'Hasilkan Dokumen',
        downloadBtn: 'Unduh PDF',
        processing: 'Sedang memproses...',
        successMsg: 'File berhasil dibuat!',
        previewTitle: 'Pratinjau File',
        previewPlaceholder: 'Konten akan muncul di sini',
        developer: 'Pengembang',
        devDesc: 'Pengembang ahli dalam membangun berbagai file seperti situs web, dokumen, dan bot — Telegram dan WhatsApp. Suka membaca dan menikmati ketenangan.',
        contactLord: 'Hubungi LORD',
        footerBrand: 'Eithar',
        footerTag: 'Dibuat dengan penuh perhatian',
        notifyNoContent: 'Tambahkan teks atau gambar sampul terlebih dahulu',
        notifyCoverUpload: 'Gambar sampul berhasil diunggah',
        notifyDownload: 'Berhasil diunduh!',
        notifyError: 'Terjadi kesalahan saat pemrosesan',
        notifyFileType: 'File harus berupa gambar',
        notifyFileSize: 'Ukuran gambar harus kurang dari 10MB',
        pdfCoverLabel: 'Sampul',
        pdfContentLabel: 'Konten',
        pdfFooter: 'Eithar',
        langName: 'Indonesia'
    }
};

function t(key) {
    return i18n[currentLang]?.[key] || i18n['en'][key] || key;
}

// ===== Language System =====
function setLang(lang) {
    currentLang = lang;
    document.body.setAttribute('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });

    const textInput = document.getElementById('textInput');
    const filenameInput = document.getElementById('filenameInput');
    if (lang === 'ar') {
        textInput.placeholder = 'اكتب نصك هنا...';
        filenameInput.value = filenameInput.value || 'مخطوطة_إيثار';
    } else if (lang === 'en') {
        textInput.placeholder = 'Type your text here...';
        filenameInput.value = filenameInput.value || 'Eithar_Document';
    } else if (lang === 'ru') {
        textInput.placeholder = 'Введите ваш текст здесь...';
        filenameInput.value = filenameInput.value || 'Документ_Eithar';
    } else if (lang === 'zh') {
        textInput.placeholder = '在此输入您的文本...';
        filenameInput.value = filenameInput.value || 'Eithar_文档';
    } else if (lang === 'ja') {
        textInput.placeholder = 'ここにテキストを入力...';
        filenameInput.value = filenameInput.value || 'Eithar_ドキュメント';
    } else if (lang === 'id') {
        textInput.placeholder = 'Ketik teks Anda di sini...';
        filenameInput.value = filenameInput.value || 'Dokumen_Eithar';
    }

    document.querySelectorAll('.lang-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.getElementById('currentLangLabel').textContent = i18n[lang].langName;
    closeLangMenu();
    updatePreview();
}

function toggleLangMenu() {
    document.getElementById('langMenu').classList.toggle('open');
}

function closeLangMenu() {
    document.getElementById('langMenu').classList.remove('open');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-dropdown')) closeLangMenu();
});

// ===== Developer Modal =====
function openDevModal() {
    document.getElementById('devModal').classList.add('active');
}

function closeDevModal() {
    document.getElementById('devModal').classList.remove('active');
}

document.getElementById('devModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('devModal')) closeDevModal();
});

// ===== DOM Elements =====
const coverUploadArea = document.getElementById('coverUploadArea');
const coverImageInput = document.getElementById('coverImageInput');
const coverImagePreview = document.getElementById('coverImagePreview');
const coverPreviewImg = document.getElementById('coverPreviewImg');
const filenameInput = document.getElementById('filenameInput');
const textInput = document.getElementById('textInput');
const previewContent = document.getElementById('previewContent');

// ===== Live Preview =====
function updatePreview() {
    const text = textInput.value.trim();
    const filename = filenameInput.value.trim() || 'Eithar';

    if (!text && !coverImage) {
        previewContent.innerHTML = `
            <div class="preview-placeholder">
                <div class="preview-doc">
                    <div class="doc-line doc-title"></div>
                    <div class="doc-line"></div>
                    <div class="doc-line"></div>
                    <div class="doc-line doc-short"></div>
                    <div class="doc-image-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <div class="doc-line"></div>
                    <div class="doc-line"></div>
                </div>
                <p>${t('previewPlaceholder')}</p>
            </div>
        `;
        return;
    }

    const dateStr = new Date().toLocaleDateString(
        currentLang === 'ar' ? 'ar-SA' : currentLang === 'zh' ? 'zh-CN' : currentLang === 'ja' ? 'ja-JP' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    let html = `<div class="preview-live">`;
    html += `<h2>${escapeHtml(filename)}</h2>`;
    html += `<div class="preview-date">${dateStr}</div>`;

    if (coverImage) {
        html += `<img class="preview-cover" src="${coverImage}" alt="${t('coverLabel')}">`;
    }

    if (text) {
        html += `<div class="preview-text">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
    }

    html += `</div>`;
    previewContent.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

filenameInput.addEventListener('input', updatePreview);
textInput.addEventListener('input', updatePreview);

// ===== Upload Handlers =====
coverUploadArea.addEventListener('click', () => coverImageInput.click());
coverUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); coverUploadArea.classList.add('dragover'); });
coverUploadArea.addEventListener('dragleave', () => coverUploadArea.classList.remove('dragover'));
coverUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    coverUploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleCoverFile(e.dataTransfer.files[0]);
});
coverImageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleCoverFile(e.target.files[0]);
});

function handleCoverFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification(t('notifyFileType'), 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showNotification(t('notifyFileSize'), 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        coverImage = e.target.result;
        coverPreviewImg.src = coverImage;
        coverImagePreview.classList.add('active');
        coverUploadArea.style.display = 'none';
        showNotification(t('notifyCoverUpload'), 'success');
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function removeCoverImage() {
    coverImage = null;
    coverImagePreview.classList.remove('active');
    coverUploadArea.style.display = 'block';
    coverImageInput.value = '';
    updatePreview();
}

/* =========================================================================
   PDF Engine — Single Cover Image
   ========================================================================= */

const PX_PER_MM = 6;
function pxFromMm(mm) { return mm * PX_PER_MM; }
function ptToMm(pt) { return pt * 0.3527777778; }

function getFontFamily() {
    switch (currentLang) {
        case 'ar': return 'Amiri, Noto Sans Arabic, sans-serif';
        case 'zh': return 'Noto Sans SC, Noto Sans, sans-serif';
        case 'ja': return 'Noto Sans JP, Noto Sans, sans-serif';
        default: return 'Inter, Noto Sans, sans-serif';
    }
}

function getTextDirection() {
    return currentLang === 'ar' ? 'rtl' : 'ltr';
}

function getTextAlign() {
    return currentLang === 'ar' ? 'right' : 'left';
}

function getPageEdge(pageWidth, margin) {
    return currentLang === 'ar' ? pageWidth - margin : margin;
}

async function ensureFontsReady() {
    const font = getFontFamily().split(',')[0].trim();
    try {
        await document.fonts.load('700 40px ' + font);
        await document.fonts.load('400 20px ' + font);
        await document.fonts.ready;
    } catch (e) {
        console.warn('Font load warning:', e);
    }
}

function createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.round(pxFromMm(w));
    c.height = Math.round(pxFromMm(h));
    return { canvas: c, ctx: c.getContext('2d') };
}

function drawText(ctx, text, x, y, opts = {}) {
    const {
        sizePt = 14,
        color = '#1a1a2e',
        align = getTextAlign(),
        bold = false,
        dir = getTextDirection()
    } = opts;
    const sizeMm = ptToMm(sizePt);
    ctx.font = `${bold ? '700' : '400'} ${pxFromMm(sizeMm)}px ${getFontFamily()}`;
    ctx.fillStyle = color;
    ctx.direction = dir;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, pxFromMm(x), pxFromMm(y));
}

function wrapText(ctx, text, maxW, sizePt, bold) {
    const sizeMm = ptToMm(sizePt);
    ctx.font = `${bold ? '700' : '400'} ${pxFromMm(sizeMm)}px ${getFontFamily()}`;
    const maxPx = pxFromMm(maxW);
    const lines = [];

    text.split('\n').forEach(para => {
        if (!para.trim()) { lines.push(''); return; }
        const words = para.split(/\s+/).filter(Boolean);
        let cur = '';
        words.forEach(w => {
            const test = cur ? cur + ' ' + w : w;
            if (ctx.measureText(test).width > maxPx && cur) {
                lines.push(cur);
                cur = w;
            } else {
                cur = test;
            }
        });
        lines.push(cur);
    });
    return lines;
}

// ===== Generate PDF =====
async function generatePDF() {
    const text = textInput.value.trim();
    const filename = filenameInput.value.trim();

    if (!coverImage && !text) {
        showNotification(t('notifyNoContent'), 'error');
        return;
    }

    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const successMessage = document.getElementById('successMessage');

    progressContainer.classList.add('active');
    successMessage.classList.remove('active');
    downloadBtn.style.display = 'none';
    convertBtn.disabled = true;

    let progressInterval;

    try {
        await ensureFontsReady();

        let progress = 0;
        progressInterval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
        }, 200);

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentW = W - margin * 2;
        const edge = getPageEdge(W, margin);
        const isRTL = currentLang === 'ar';

        const measureCtx = document.createElement('canvas').getContext('2d');
        let currentPage = 1;
        let yPos = margin;
        const pages = [];

        const cBg = '#fafafa';
        const cText = '#1a1a2e';
        const cMuted = '#6b7280';
        const cAccent = '#5b42f3';
        const cBorder = '#e5e7eb';

        function drawFrame() {
            doc.setFillColor(250, 250, 252);
            doc.rect(0, 0, W, H, 'F');
            doc.setDrawColor(91, 66, 243);
            doc.setLineWidth(1.2);
            doc.line(margin, margin - 8, W - margin, margin - 8);
        }

        function newPage() {
            if (pages.length > 0) {
                doc.addPage();
                currentPage++;
            }
            drawFrame();
            const entry = createCanvas(W, H);
            pages.push(entry);
            yPos = margin;
            return entry.ctx;
        }

        let ctx = newPage();

        // ===== COVER PAGE =====
        const title = filename || (currentLang === 'ar' ? 'مخطوطة إيثار' : 'Eithar Document');

        drawText(ctx, title, W / 2, margin + 30, {
            sizePt: 28, color: cText, align: 'center', bold: true
        });

        doc.setDrawColor(91, 66, 243);
        doc.setLineWidth(0.6);
        doc.line(W / 2 - 35, margin + 34, W / 2 + 35, margin + 34);

        const dateStr = new Date().toLocaleDateString(
            isRTL ? 'ar-SA' : currentLang === 'zh' ? 'zh-CN' : currentLang === 'ja' ? 'ja-JP' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
        );
        drawText(ctx, dateStr, W / 2, margin + 44, {
            sizePt: 11, color: cMuted, align: 'center'
        });

        yPos = margin + 55;

        // Cover Image (External File Cover)
        if (coverImage) {
            const img = new Image();
            img.src = coverImage;
            await new Promise(r => img.onload = r);

            const maxW = contentW;
            const maxH = H - (margin * 2) - 70;
            let iw = maxW;
            let ih = (img.height * iw) / img.width;
            if (ih > maxH) { ih = maxH; iw = (img.width * ih) / img.height; }

            const cx = (W - iw) / 2;
            doc.addImage(coverImage, 'JPEG', cx, yPos, iw, ih);

            yPos += ih + 10;
            drawText(ctx, t('pdfCoverLabel'), W / 2, yPos, {
                sizePt: 10, color: cMuted, align: 'center'
            });
            yPos += 15;
        }

        if (!coverImage) yPos += 10;

        // ===== TEXT CONTENT =====
        if (text) {
            if (yPos > H - margin - 60) {
                ctx = newPage();
            }

            drawText(ctx, t('pdfContentLabel'), edge, yPos, {
                sizePt: 16, color: cAccent, align: getTextAlign(), bold: true
            });
            yPos += 10;

            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.3);
            if (isRTL) {
                doc.line(margin, yPos - 4, edge, yPos - 4);
            } else {
                doc.line(edge, yPos - 4, W - margin, yPos - 4);
            }
            yPos += 8;

            const bodySize = 13;
            const lineH = 6.5;
            const lines = wrapText(measureCtx, text, contentW, bodySize, false);

            let idx = 0;
            while (idx < lines.length) {
                if (yPos > H - margin - 25) {
                    ctx = newPage();
                    yPos = margin + 5;
                }

                const avail = Math.floor((H - margin - yPos) / lineH);
                const toWrite = Math.min(lines.length - idx, Math.max(avail, 0));
                if (toWrite <= 0) { ctx = newPage(); continue; }

                for (let i = 0; i < toWrite; i++) {
                    const line = lines[idx + i];
                    if (line) {
                        drawText(ctx, line, edge, yPos + (i * lineH), {
                            sizePt: bodySize, color: cText, align: getTextAlign()
                        });
                    }
                }
                idx += toWrite;
                yPos += toWrite * lineH;
            }
        }

        // ===== FOOTER & OVERLAY =====
        const total = pages.length;
        for (let i = 1; i <= total; i++) {
            doc.setPage(i);
            const entry = pages[i - 1];

            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.3);
            doc.line(margin, H - margin - 10, W - margin, H - margin - 10);

            drawText(entry.ctx, t('pdfFooter') + ' — ' + (filename || 'Eithar'), W / 2, H - margin + 2, {
                sizePt: 8, color: cMuted, align: 'center'
            });

            drawText(entry.ctx, i + ' / ' + total, isRTL ? edge : W - margin, H - margin + 2, {
                sizePt: 8, color: cMuted, align: isRTL ? 'right' : 'right', dir: 'ltr'
            });

            doc.addImage(entry.canvas.toDataURL('image/png'), 'PNG', 0, 0, W, H);
        }

        generatedPDF = doc;

        clearInterval(progressInterval);
        progressBar.style.width = '100%';

        setTimeout(() => {
            progressContainer.classList.remove('active');
            successMessage.classList.add('active');
            downloadBtn.style.display = 'flex';
            convertBtn.disabled = false;
            showNotification(t('successMsg'), 'success');
        }, 400);

    } catch (err) {
        console.error(err);
        if (progressInterval) clearInterval(progressInterval);
        progressContainer.classList.remove('active');
        convertBtn.disabled = false;
        showNotification(t('notifyError'), 'error');
    }
}

// ===== Download PDF =====
function downloadPDF() {
    if (!generatedPDF) return;
    const name = (filenameInput.value.trim() || 'Eithar') + '.pdf';
    generatedPDF.save(name);
    showNotification(t('notifyDownload'), 'success');
    createConfetti();
}

// ===== Notification =====
function showNotification(msg, type) {
    const existing = document.querySelector('.cyber-notification');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'cyber-notification';
    const isError = type === 'error';
    el.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-120px);
        background: ${isError ? 'rgba(180, 40, 40, 0.95)' : 'rgba(17, 17, 24, 0.95)'};
        color: #fff;
        padding: 14px 28px;
        border-radius: 10px;
        font-family: ${getFontFamily()};
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px ${isError ? 'rgba(220,50,50,0.3)' : 'rgba(91,66,243,0.3)'};
        border: 1px solid ${isError ? 'rgba(220,50,50,0.4)' : 'rgba(91,66,243,0.3)'};
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-align: center;
        min-width: 280px;
        backdrop-filter: blur(12px);
    `;
    el.textContent = msg;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        el.style.transform = 'translateX(-50%) translateY(-120px)';
        setTimeout(() => el.remove(), 400);
    }, 2800);
}

// ===== Confetti =====
function createConfetti() {
    const colors = ['#af40ff', '#5b42f3', '#00ddeb', '#ffffff', '#a78bfa'];
    for (let i = 0; i < 45; i++) {
        const c = document.createElement('div');
        c.style.cssText = `
            position: fixed;
            width: ${6 + Math.random() * 6}px;
            height: ${6 + Math.random() * 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
            z-index: 10000;
            pointer-events: none;
            opacity: 0.9;
        `;
        document.body.appendChild(c);
        const dur = 2000 + Math.random() * 2000;
        const rot = Math.random() * 720;
        c.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${rot}deg)`, opacity: 0 }
        ], { duration: dur, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => c.remove();
    }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    ensureFontsReady();
    setLang('ar');
});
