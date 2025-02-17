import 'dotenv/config';
import { google } from 'googleapis';
import { normalizeGolsAssistencias, normalizeDesempenho } from './methods';

// Carregar credenciais da conta de serviço
const auth = new google.auth.GoogleAuth({
  credentials: {
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Corrige quebra de linha
      client_email: process.env.GOOGLE_CLIENT_EMAIL
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// ID da planilha (está na URL da planilha do Google Sheets)
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const GOLS = "GOLS!B1:AJ2"; // Defina o intervalo de células que deseja ler
const ASSISTENCIAS = "ASSISTENCIAS!B1:AJ2"; // Defina o intervalo de células que deseja ler
const DESEMPENHO = "JOGOS!M1:S2"; // Defina o intervalo de células que deseja ler

export const getReadSheet = async (type: 'GOLS' | 'ASSISTENCIAS' | 'DESEMPENHO'): Promise<string> => {
  const sheets = google.sheets({ version: 'v4', auth });
  let range = type === 'GOLS' ? GOLS : ASSISTENCIAS;
  range = type === 'DESEMPENHO' ? DESEMPENHO : range;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  // const rows = res.data.values;
  const rows = response.data.values as [[string], [string]];
  if (rows.length) {
    console.log(response.data.values);
    let structuredData: string | undefined = '';
    if(type === 'DESEMPENHO') {
      normalizeDesempenho(rows);
    }
    if(type === 'GOLS' || type === 'ASSISTENCIAS') {
      structuredData = normalizeGolsAssistencias(rows, type);
    }
    return structuredData || '';
  } else {
    return '';
  }
}

console.log(getReadSheet('DESEMPENHO'));