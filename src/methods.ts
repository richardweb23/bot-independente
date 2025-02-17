export const normalizeGolsAssistencias = (rows: [[string], [string]], type: 'GOLS' | 'ASSISTENCIAS') => {
  if (!rows || rows.length < 2) {
    console.log('Dados insuficientes.');
    return;
  }
  // Criando um objeto com cada coluna separada
  const headerRow = rows[0]; // Linha 1 (Cabeçalhos)
  const dataRow = rows[1]; // Linha 2 (Valores correspondentes)

  // Criando um array de objetos para ordenar
  let structuredData = headerRow.map((header, index) => ({
      nome: header,
      valor: Number(dataRow[index]) || 0 // Se não houver valor, retorna 0
  }));

  // Ordenando do maior para o menor
  structuredData.sort((a, b) => b.valor - a.valor);
  structuredData = structuredData.filter((e) => e.nome !== '' && e.nome !== 'JOGADOR' && e.nome !== 'GOLS' && e.valor !== 0);

  const ranking = structuredData
  .filter(jogador => jogador.nome !== 'GOLS')
  .sort((a, b) => b.valor - a.valor);

  let header = type === 'GOLS' ? `⚽*Ranking da Artilharia*⚽\n\n` : `🅰️*Ranking de Assistências*🅰️\n\n`;
  const mensagem = header + 
  ranking .map(j => `${j.valor.toString().padStart(2, '0')} GOLS - *${j.nome}*`).join('\n');

  return mensagem;
}

export const normalizeDesempenho = (rows: [[string], [string]]) => {
  if (!rows || rows.length < 2) {
    console.log('Dados insuficientes.');
    return;
  }

  const headerRow = rows[0];
  const dataRow = rows[1];
  let dados = headerRow.map((header, index) => ({
    nome: header,
    valor: Number(dataRow[index]) || 0 // Se não houver valor, retorna 0
  }));

  const icones: { [key: string]: string } = {
    "JOGOS": "✅",
    "VITÓRIAS": "🏆",
    "EMPATES": "➖",
    "DERROTAS": "❌",
    "GOLS PRÓ": "⚽",
    "GOLS CONTRA": "🥅",
    "SALDO": "📈",
    "APROVEITAMENTO": "📊"
  };

  let mensagem = "📊 *Desempenho do Independente* 📊\n\n";
  
  let totalJogos = dados.find(d => d.nome === "JOGOS")?.valor || 0;
  let vitorias = dados.find(d => d.nome === "VITÓRIAS")?.valor || 0;
  let empates = dados.find(d => d.nome === "EMPATES")?.valor || 0;
  
  let aproveitamento = totalJogos > 0 ? ((vitorias + (empates / 2)) / totalJogos) * 100 : 0;

  dados.push({ nome: "APROVEITAMENTO", valor: parseFloat(aproveitamento.toFixed(2)) });
  
  dados.forEach(({ nome, valor }) => {
    const icone = icones[nome] || "🔹";
    mensagem += `${icone} *${nome}:* ${valor}${nome === "APROVEITAMENTO" ? "%" : ""}\n`;
  });
  
  console.log(mensagem.trim());
  return mensagem.trim();
}