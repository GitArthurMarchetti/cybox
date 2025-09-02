import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'Cybox <noreply@cybox.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw new Error('Falha ao enviar email');
    }
}

export function createInviteEmailTemplate(
    departmentName: string,
    inviterName: string,
    inviteLink: string
): string {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Convite para ${departmentName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0F0F0F;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0F0F0F;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1F1F1F 0%, #2C2C2C 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <img src="${process.env.NEXTAUTH_URL}/logo-completa-branca.png" alt="Cybox" style="height: 60px; margin: 0 auto 10px; display: block;" />
                <p style="color: #8C8888; margin: 10px 0 0; font-size: 16px;">Sistema de Gestão Patrimonial</p>
            </div>

            <!-- Content -->
            <div style="background-color: #1F1F1F; padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #FFFFFF; margin: 0 0 10px; font-size: 24px; font-weight: bold;">Você foi convidado!</h2>
                    <p style="color: #B4B4B4; margin: 0; font-size: 16px; line-height: 1.5;">
                        <strong style="color: #F6CF45;">${inviterName}</strong> convidou você para participar do departamento
                    </p>
                </div>

                <!-- Department Card -->
                <div style="background: linear-gradient(135deg, #2C2C2C 0%, #252525 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border: 2px solid #F6CF45; box-shadow: 0 8px 32px rgba(246, 207, 69, 0.15);">
                    <div style="text-align: center;">
                        <div style="background: linear-gradient(135deg, #F6CF45 0%, #FFD700 100%); width: 60px; height: 60px; border-radius: 16px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(246, 207, 69, 0.3);">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 21h18"></path>
                                <path d="M5 21V7l8-4v18"></path>
                                <path d="M19 21V11l-6-4"></path>
                            </svg>
                        </div>
                        <h3 style="color: #FFFFFF; margin: 0 0 8px; font-size: 22px; font-weight: bold;">${departmentName}</h3>
                        <div style="background-color: #F6CF45; color: #000; padding: 6px 12px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Departamento
                        </div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <p style="color: #B4B4B4; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
                        Clique no botão abaixo para aceitar o convite e começar a gerenciar patrimônios junto com sua equipe.
                    </p>

                    <!-- CTA Button -->
                    <a href="${inviteLink}" 
                       style="display: inline-block; background-color: #F6CF45; color: #000000; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                        Aceitar Convite
                    </a>

                    <p style="color: #8C8888; margin: 20px 0 0; font-size: 14px;">
                        Este convite expira em 7 dias. Se você não possui uma conta, será criada automaticamente.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #0F0F0F; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                <div style="border-top: 1px solid #2C2C2C; padding-top: 20px;">
                    <p style="color: #8C8888; margin: 0; font-size: 14px;">
                        Este email foi enviado pelo Cybox - Sistema de Gestão Patrimonial
                    </p>
                    <p style="color: #6C6C6C; margin: 10px 0 0; font-size: 12px;">
                        Se você não esperava este convite, pode ignorar este email com segurança.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}