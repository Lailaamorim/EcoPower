/**
 * ECOPOWER CODING - JAVASCRIPT CORE
 * Versão Final Sincronizada
 */

/* ========================= */
/* CONTROLE DE NAVEGAÇÃO (TABS) */
/* ========================= */
function changeTab(index) {
    const tabs = document.querySelectorAll('.tab-panel');
    const buttons = document.querySelectorAll('.nav-btn');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    tabs[index].classList.add('active');
    buttons[index].classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================= */
/* CONTROLE DO GRÁFICO */
/* ========================= */
let meuGrafico = null;

/* ========================= */
/* PROCESSAMENTO PRINCIPAL (SIMULADOR) */
/* ========================= */
function processarDados() {
    let input = document.getElementById('inputValor').value;
    const valor = parseFloat(input);
    
    if (!valor || valor <= 0) {
        alert("Por favor, Zi, insira um valor de fatura válido para continuar.");
        return;
    }

    // FORMATAÇÃO AUTOMÁTICA (Ex: 155 vira 155.00 no campo de input)
    document.getElementById('inputValor').value = valor.toFixed(2);

    const pGeracao = 35;
    const pRede = 25;
    const pImpostos = 40;

    // Mostra o card explicativo (alinhado com o CSS .imposto-detail)
    document.getElementById('explica-imposto').style.display = 'block';

    gerarGraficoDinamico(valor, pGeracao, pRede, pImpostos);
    atualizarTabela(valor);
}

/* ========================= */
/* CRIAÇÃO DO GRÁFICO (CHART.JS) */
/* ========================= */
function gerarGraficoDinamico(valorTotal, pGer, pRed, pImp) {
    const ctx = document.getElementById('graficoEnergia').getContext('2d');
    
    if (meuGrafico) meuGrafico.destroy();

    meuGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Geração', 'Rede (Fios)', 'Impostos'],
            datasets: [{
                data: [pGer, pRed, pImp],
                backgroundColor: ['#ff6600', '#444', '#e74c3c'],
                borderColor: '#050505',
                borderWidth: 4,
                hoverOffset: 25 // Aumenta a fatia ao passar o mouse
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            // A MÁGICA DA SINCRONIA:
            onHover: (event, chartElement) => {
                const textoDinamico = document.getElementById('texto-dinamico');
                if (chartElement.length > 0) {
                    const index = chartElement[0].index;
                    const valorItem = (valorTotal * (meuGrafico.data.datasets[0].data[index] / 100)).toFixed(2);
                    
                    if (index === 0) {
                        textoDinamico.innerHTML = `<strong>Geração (R$ ${valorItem}):</strong> Paga a produção de energia nas usinas.`;
                    } else if (index === 1) {
                        textoDinamico.innerHTML = `<strong>Rede (R$ ${valorItem}):</strong> Manutenção dos postes e fios (TUSD/TE).`;
                    } else if (index === 2) {
                        textoDinamico.innerHTML = `<strong>Impostos (R$ ${valorItem}):</strong> ICMS, PIS e COFINS para o governo.`;
                    }
                } else {
                    // Texto quando o mouse não está em cima de nenhuma fatia
                    textoDinamico.innerHTML = `Passe o mouse no gráfico de <strong>R$ ${valorTotal.toFixed(2)}</strong> para detalhar.`;
                }
            },
            plugins: {
                legend: { display: false } // Desativado para não atrapalhar a sincronia do mouse
            }
        }
    });
}

/* ========================= */
/* ATUALIZAÇÃO DA TABELA (MME) */
/* ========================= */
function atualizarTabela(valor) {
    const corpo = document.getElementById('tabelaCorpo');
    
    // Cálculos técnicos
    const vGer = (valor * 0.35).toFixed(2);
    const vTrans = (valor * 0.07).toFixed(2);
    const vDist = (valor * 0.18).toFixed(2);
    const vImp = (valor * 0.25).toFixed(2);
    const vEnc = (valor * 0.15).toFixed(2);

    corpo.innerHTML = `
        <tr><td>Geração</td><td>Usinas e Combustíveis</td><td>35% (R$ ${vGer})</td></tr>
        <tr><td>Transmissão</td><td>Linhas de Alta Tensão</td><td>7% (R$ ${vTrans})</td></tr>
        <tr><td>Distribuição</td><td>Postes e Fiação Urbana</td><td>18% (R$ ${vDist})</td></tr>
        <tr><td>Impostos</td><td>ICMS (Saúde e Educação)</td><td>25% (R$ ${vImp})</td></tr>
        <tr><td>Encargos</td><td>Subsídios Sociais</td><td>15% (R$ ${vEnc})</td></tr>
        <tr style="color: #ff6600; font-weight: bold; font-family: 'Playfair Display', serif;">
            <td colspan="3">Dados baseados em uma conta de R$ ${valor.toFixed(2)}.</td>
        </tr>
    `;
}

/* ========================= */
/* INICIALIZAÇÃO DO SISTEMA */
/* ========================= */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a planilha com R$ 50,00 para já abrir com conteúdo (como solicitado)
    atualizarTabela(50);
    console.log("EcoPower Coding pronto e 100% sincronizado!");
});