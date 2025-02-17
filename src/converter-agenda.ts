interface IJogo {
  dia: number;
  time_casa: string;
  time_visitante: string;
  local: string;
  horario: string;
}

interface IMes {
  mes: string;
  partidas: IJogo[];
}

interface IAgenda {
  ano: number;
  jogos: IMes[];
}


function converterTextoParaJson(texto: string): IAgenda {
  const agenda: IAgenda = { ano: 2025, jogos: [] };
  let mesAtual: string | null = null;
  const linhas = texto.split("\n");

  linhas.forEach((linha, index) => {
    const mesMatch = linha.match(/\*([\p{L}]+)\s+2025\*/u);
    const jogoMatch = linha.match(/\*(\d{2})\*\s*-\s*Independente\s*x\s*(.+)/);

    if (mesMatch) {
      mesAtual = mesMatch[1].trim();
      agenda.jogos.push({ mes: mesAtual, partidas: [] });
    } else if (jogoMatch) {
      const dia = parseInt(jogoMatch[1]);
      const timeVisitante = jogoMatch[2].trim();
      let local = "A definir";
      let horario = "A definir";

      // Tenta pegar o local e horário na linha seguinte
      const proximaLinha = linhas[index + 1]?.trim();
      const localHorarioMatch = proximaLinha?.match(/(.+?)\s*\((\d{1,2}:\d{2})\)/);

      if (localHorarioMatch) {
        local = localHorarioMatch[1].trim();
        horario = localHorarioMatch[2].trim();
      }

      const partida: IJogo = {
        dia,
        time_casa: "Independente",
        time_visitante: timeVisitante,
        local,
        horario,
      };

      if (mesAtual) {
        agenda.jogos[agenda.jogos.length - 1].partidas.push(partida);
      }
    }
  });

  return agenda;
}

function converterJsonParaString(json: IAgenda): string {
  let agendaString = `📅 *Agenda Independente ${json.ano}*\n\n`;

  json.jogos.forEach((mes) => {
    agendaString += `📌 *${mes.mes} ${json.ano}*\n`;

    mes.partidas.forEach((partida) => {
      agendaString += `➡️ *${partida.dia}* - Independente 🆚 ${partida.time_visitante}\n`;
      agendaString += `🏟️ ${partida.local} ⏰ ${partida.horario}\n\n`;
    });

    agendaString += "—".repeat(28) + "\n\n"; // Linha divisória
  });

  return agendaString;
}


function filtrarAgendaMesAtualOuProximo(agenda: IAgenda): IAgenda {
  const agora = new Date();
  const mesAtual = agora.toLocaleString("pt-BR", { month: "long" }).toLowerCase();
  const diaAtual = agora.getDate();

  // Ordena meses na sequência correta
  const mesesOrdenados = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  let jogosFiltrados = agenda.jogos.find(m => m.mes.toLowerCase() === mesAtual)?.partidas.filter(jogo => jogo.dia >= diaAtual) || [];

  // Se não houver jogos restantes no mês atual, pega do próximo mês disponível
  if (jogosFiltrados.length === 0) {
    const indiceAtual = mesesOrdenados.indexOf(mesAtual);
    for (let i = indiceAtual + 1; i < mesesOrdenados.length; i++) {
      const mesProximo = mesesOrdenados[i];
      const jogosProximoMes = agenda.jogos.find(m => m.mes.toLowerCase() === mesProximo)?.partidas || [];
      if (jogosProximoMes.length > 0) {
        return { ano: agenda.ano, jogos: [{ mes: mesProximo, partidas: jogosProximoMes }] };
      }
    }
  }

  return jogosFiltrados.length > 0 ? { ano: agenda.ano, jogos: [{ mes: mesAtual, partidas: jogosFiltrados }] } : { ano: agenda.ano, jogos: [] };
}


// 📌 Exemplo de uso:
const agendaTexto = `Agenda Independente 2025
#agenda_bot

*Fevereiro 2025*

*02* - Independente x Amigos de Quinta
Guaratibano (8:00)

*09*- Independente x Vila Real
Fazenda Marambaia (8:00)

*16* - Independente x Patota FC
Guaratibano (8:00)

++++++++++++++++++++++++
*Março 2025*

*09* - Independente x Piratas FC
Guaratibano (8:00)

*16*- Independente x União FC
Quiruá - Bangu (8:00)

*23* - Independente x Itaguaí AC
Arena Itaguaí 

++++++++++++++++++++++++
*Abril 2025*

*06* - Independente x ❓❓ 
A definir ❗❗❗ 

*13*- Independente x Camorim
Guaratibano (8:00)

*27* - Independente x Cheiro FC 
Guaratibano (8:00)

++++++++++++++++++++++++
*Maio 2025*

*04* - Independente x Amigos de Quinta 
Fazenda Marambaia (8:00)

*18* - Independente x Marumbi
Guaratibano (8:00)

*25* - Independente x Colinas 
Fazenda Marambaia (8:00)

++++++++++++++++++++++++
*Junho 2025*

*01* - Independente x Colorado FC
Fazenda Marambaia (8:00)

*15* - Independente x Vila Real 
Fazenda Marambaia 

*29* - Independente x Black Panther FC
Guaratibano (8:00)

++++++++++++++++++++++++
*Julho 2025*

*13* - Independente x ❓❓
A definir ❗❗❗

*20* - Independente x Colorado FC 
Campo do Moinho (8:00)

*27* - Independente x mancha negra
Campo do são Basílio 

++++++++++++++++++++++++
*Agosto 2025*

*17* - Independente x ❓❓
Guaratibano (8:00)

*24* - Independente x ❓❓
A definir ❗❗❗

*31* - Independente x ❓❓
Guaratibano (8:00)

++++++++++++++++++++++++
*Setembro 2025*

*14* - Independente x ❓❓
A definir ❗❗❗

*21* - Independente x ❓❓
A definir ❗❗❗

*28* - Independente x ❓❓
A definir ❗❗❗

++++++++++++++++++++++++

*Outubro 2025*

*05* - Independente x SPF 
Campestre (8:00)

*19* - Independente x ❓❓
A definir ❗❗❗

*26*- Independente x ❓❓
A definir ❗❗❗ 

++++++++++++++++++++++++
*Novembro 2025*

*09* - Independente x ❓❓
Fazenda Marambaia (8:00)

*16* - Independente x ❓❓
A definir ❗❗❗

*30* - Independente x ❓❓
A definir ❗❗❗

++++++++++++++++++++++++
*Dezembro 2025*

*07* - Independente x ❓❓
A definir ❗❗❗

*14* - Independente x ❓❓
A definir ❗❗❗

*21* - Independente x ❓❓
A definir ❗❗❗`;


export const verificaAgenda = (texto: string) => {
  const regex = /#agenda_bot\b/i; // Case insensitive
  return regex.test(texto);
}

export const converterTextoParaWhatsApp = (texto: string): string => {
  const json = converterTextoParaJson(texto);
  return converterJsonParaString(json);
}

// 📌 Exemplo de uso:
export const getAgendaAtual = (texto: string): string => {
  const agendaJson = converterTextoParaJson(texto);
  const agendaFiltrada = filtrarAgendaMesAtualOuProximo(agendaJson);
  return converterJsonParaString(agendaFiltrada);
}



// console.log(converterTextoParaWhatsApp(agendaTexto));
// console.log(getAgendaAtual(agendaTexto));
