import QRCode from 'qrcode';

export async function generateQRDataURL(token: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'}/rescue/${token}`;
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#080B14',
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code', err);
    throw err;
  }
}
