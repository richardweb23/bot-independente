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

client.on('qr', (qr) => {
    // qrcode.generate(qr, { small: true });
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error("Erro ao gerar o QR Code", err);
        } else {
          // Exibe o QR Code em uma página web
          app.get('/', (req, res) => {
            res.send(`
              <h1>Escaneie o QR Code</h1>
              <img src="${url}" alt="QR Code" />
            `);
          });
    
          // Inicia o servidor na porta 3001
          app.listen(3001, () => {
            console.log('Servidor rodando em http://localhost:3000');
          });
        }
      });
});

client.on('ready', () => {
    console.log('Bot está pronto!');
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