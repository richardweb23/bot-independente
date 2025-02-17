import xlsx from 'xlsx';

// Caminho para o arquivo Excel
const caminhoDoArquivo = './estatisticas.xlsx';

// Lê o arquivo Excel
const planilha = xlsx.readFile(caminhoDoArquivo);

// Obtém a primeira aba da planilha
const aba = planilha.Sheets[planilha.SheetNames[1]];
const aba2 = planilha.Sheets[planilha.SheetNames[2]];

export const getList = (index: number) => {
  const colunasEspecificas = [];
  const abaAtual = planilha.Sheets[planilha.SheetNames[index]]
  
  // Loop para percorrer da linha 3 até a linha 30
  for (let i = 0; i <= 30; i++) {
      // Obtém os valores das células AG e AH para a linha atual
      const valorAG = abaAtual[`AG${i}`] ? abaAtual[`AG${i}`].v : null; // Verifica se a célula existe
      const valorAH = abaAtual[`AH${i}`] ? abaAtual[`AH${i}`].v : null; // Verifica se a célula existe
  
      // Adiciona os valores ao array
      colunasEspecificas.push({ linha: i, AG: valorAG, AH: valorAH });
  }
  
  const mensagem = colunasEspecificas.map((item, index) => {
    if(item.AH > 0) {
      return `${item.AH} = *${item.AG}*`;
    }
    return ``
  });
  let title = `*ARTILHIARIA* ⚽`;
  if(index === 2) {
    title = `*ASSISTÊNCIAS* 💡`
  }
  // console.log([title, ...mensagem].filter((item) => item.length > 1).join('\n'));
  return [title, ...mensagem].filter((item) => item.length > 1).join('\n');
}

