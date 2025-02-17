import { Client } from 'whatsapp-web.js';
// import qrcode from 'qrcode-terminal';
import qrcode from 'qrcode';
import express from 'express';

const app = express();
import {getReadSheet} from './google.api';
import { verificaAgenda, converterTextoParaWhatsApp, getAgendaAtual } from './converter-agenda';

const client = new Client({
    puppeteer: {
      headless: true, // Modo sem interface gráfica
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Opções do Puppeteer
    }
  });
  let qrGenerated = false;

  client.on('qr', (qr) => {
    if (!qrGenerated) {  // Verifica se o QR Code já foi gerado
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error("Erro ao gerar o QR Code", err);
        } else {
          // Exibe o QR Code na página apenas se não tiver sido exibido antes
          app.get('/', (req, res) => {
            res.send(`
              <h1>Escaneie o QR Code</h1>
              <img src="${url}" alt="QR Code" />
            `);
          });
  
          // Marca que o QR Code foi gerado para não repetir
          qrGenerated = true;
  
          // Inicia o servidor na porta 3000
          const port = process.env.PORT || 3000;
          app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port} ou na URL do Render`);
          });
        }
      });
    }
  });

client.on('ready', () => {
    console.log('WhatsApp Web está pronto!');
});

let agenda = '';
let agendaAtual = '';

client.on('message_create', async (message) => {
    console.log('message.fromMe', message.fromMe);
    // if (message.fromMe) return;

    const {body, from} = message;
    const paraTeste = '5521979786795@c.us';
    const grupoJogadores = '5521968006001-1598890291@g.us';
    const grupoDiretoria = '5521979786795@c.us';
    const permissoes = from === grupoDiretoria || from === paraTeste || from === grupoJogadores;
    if(!permissoes) return;

    // Atualiza agenda
    if(verificaAgenda(body)) {
        agenda = converterTextoParaWhatsApp(body);
        agendaAtual = getAgendaAtual(body);
        // console.log(agenda);
        // message.reply(agenda);
        return;
    }
    if (body === '!artilharia') {
        message.reply(await getReadSheet('GOLS'));
    }
    if (body === '!assistencias') {
        message.reply(await getReadSheet('ASSISTENCIAS'));
    }
    if (body === '!desempenho') {
        message.reply(await getReadSheet('DESEMPENHO'));
    }
    if (body === '!agenda') {
        if(grupoJogadores) {
            message.reply(agendaAtual);
        } else {
            message.reply(agenda);
        }
    }
});

client.initialize();