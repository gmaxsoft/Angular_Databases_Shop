import * as nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Mock SMTP configuration for testing
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'your-ethereal-user@example.com',
        pass: 'your-ethereal-pass'
      }
    });
    // Note: For Gmail, use:
    // this.transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'your-email@gmail.com',
    //     pass: 'your-app-password'
    //   }
    // });
  }

  async sendOrderConfirmation(orderData: any, userEmail: string): Promise<void> {
    const mailOptions = {
      from: 'noreply@database-shop.com',
      to: userEmail,
      subject: 'Potwierdzenie zamówienia',
      html: `
        <h1>Dziękujemy za zamówienie!</h1>
        <p>Numer zamówienia: ${orderData.orderId}</p>
        <p>Szczegóły zamówienia:</p>
        <ul>
          ${orderData.items.map((item: any) => `<li>${item.name} - ${item.quantity} szt. - ${item.price} zł</li>`).join('')}
        </ul>
        <p>Całkowita kwota: ${orderData.total} zł</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila potwierdzenia zamówienia:', error);
      throw error;
    }
  }

  async sendDownloadLinks(orderId: string, userEmail: string, downloadLinks: string[]): Promise<void> {
    const mailOptions = {
      from: 'noreply@database-shop.com',
      to: userEmail,
      subject: 'Linki do pobrania produktów',
      html: `
        <h1>Twoje produkty są gotowe do pobrania!</h1>
        <p>Numer zamówienia: ${orderId}</p>
        <p>Kliknij poniższe linki, aby pobrać zakupione produkty:</p>
        <ul>
          ${downloadLinks.map(link => `<li><a href="${link}">Pobierz produkt</a></li>`).join('')}
        </ul>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila z linkami do pobrania:', error);
      throw error;
    }
  }
}