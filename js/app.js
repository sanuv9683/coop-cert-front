// Setup SignaturePad
const canvas = document.getElementById('signaturePad');
const signaturePad = new SignaturePad(canvas, {
    minWidth: 0.5,
    maxWidth: 2.5,
    penColor: 'black',
    backgroundColor: null
});
document.getElementById('clearSig').addEventListener('click', () => {
    signaturePad.clear();
    document.getElementById('sigArea').style.display = 'none';
});

// Set date picker to today
const dateField = document.getElementById('dateField');
window.addEventListener('load', () => {
    dateField.valueAsDate = new Date();
    applyPreview();
});

// Update certificate overlays
function applyPreview() {
    // Name
    const nameVal = document.getElementById('recipientName').value.trim() || '__________';
    document.getElementById('nameArea').textContent = nameVal;

    // Date from picker
    const dateVal = dateField.value;
    const dateText = dateVal ? new Date(dateVal).toLocaleDateString() : '';
    document.getElementById('dateArea').textContent = dateText;

    // Signature
    const sigImg = document.getElementById('sigArea');
    if (!signaturePad.isEmpty()) {
        sigImg.src = signaturePad.toDataURL('image/png');
        sigImg.style.display = 'block';
    }
}

// Print only certificate
function printCertificate() {
    applyPreview();
    // Open a new window with only the certificate markup
    const content = document.getElementById('certificate').outerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Certificate</title>
              <style>
                body { margin: 0; padding: 0; }
                #certificate { width: 800px; height: 1120px; margin: 0 auto; position: relative; font-family: 'Playfair Display', serif; }
                #certificate img#bgImage { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
                #nameArea, #sigArea, #dateArea { position: absolute; left: 50%; transform: translateX(-50%); z-index: 2; }
                #nameArea { top: 522px; font-family: 'Alex Brush', cursive; font-size: 46px; text-decoration: underline; text-align: center; width: 80%; word-wrap: break-word; }
                #sigArea { top: 822px; width: 180px; }
                #dateArea { top: 1020px; width: 100%; font-size: 21px; text-align: center; transform: none; left: 70px; }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
}

// Download PNG
function downloadCertificate() {
    applyPreview();
    document.getElementById("dateArea").style.bottom = '80px';
    html2canvas(document.getElementById('certificate')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    document.getElementById("dateArea").style.bottom = '73px';
}

// Unified share (email/WhatsApp/native)
function shareCertificate() {
    applyPreview();
    html2canvas(document.getElementById('certificate')).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], 'certificate.png', {type: blob.type});
            if (navigator.canShare && navigator.canShare({files: [file]})) {
                navigator.share({files: [file], title: 'Certificate', text: 'Here is your certificate!'});
            } else {
                // Fallback: download then prompt user
                const link = document.createElement('a');
                link.download = 'certificate.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                alert('Sharing not supported; certificate downloaded. Please attach it manually.');
            }
        });
    });
}

// Event bindings
document.getElementById('previewBtn').addEventListener('click', applyPreview);
document.getElementById('downloadBtn').addEventListener('click', downloadCertificate);
document.getElementById('printBtn').addEventListener('click', printCertificate);
document.getElementById('shareBtn').addEventListener('click', shareCertificate);


document.getElementById('logoutBtn').addEventListener('click', ()=>{
    localStorage.removeItem('isLoggedIn');
    location.href = 'index.html';
});