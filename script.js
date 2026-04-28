/**
 * ECOPOWER CODING - JAVASCRIPT CORE
 * Controla navegação, cálculos e gráficos dinâmicos.
 */

/* ========================= */
/* CONTROLE DE NAVEGAÇÃO (TABS) */
/* ========================= */
/* Responsável por trocar as "telas" do sistema */
function changeTab(index) {

    // Seleciona todas as abas de conteúdo
    const tabs = document.querySelectorAll('.tab-panel');

    // Seleciona todos os botões do menu lateral
    const buttons = document.querySelectorAll('.nav-btn');

    // Remove a classe "active" de todas as abas (esconde tudo)
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove o destaque dos botões
    buttons.forEach(btn => btn.classList.remove('active'));

    // Ativa apenas a aba clicada
    tabs[index].classList.add('active');

    // Destaca o botão correspondente
    buttons[index].classList.add('active');
    
    // Suaviza a rolagem para o topo (melhor UX no mobile)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ========================= */
/* CONTROLE DO GRÁFICO */
/* ========================= */
/* Variável global para armazenar o gráfico atual */
let meuGrafico = null;


/* ========================= */
/* PROCESSAMENTO PRINCIPAL (SIMULADOR) */
/* ========================= */
/* Função chamada ao clicar em "CALCULAR IMPACTO" */
function processarDados() {

    // Pega o valor digitado pelo usuário e converte para número
    const valor = parseFloat(document.getElementById('inputValor').value);
    
    // Validação básica (evita erro ou cálculo inválido)
    if (!valor || valor <= 0) {
        alert("Por favor, Zi, insira um valor de fatura válido para continuar.");
        return; // interrompe a execução
    }

    /* ========================= */
    /* LÓGICA DE NEGÓCIO */
    /* ========================= */
    /* Percentuais simulados do setor energético */
    const pGeracao = 35;
    const pRede = 25;
    const pImpostos = 40;

    // Calcula os valores em reais com base nas porcentagens
    const vGeracao = (valor * pGeracao / 100).toFixed(2);
    const vRede = (valor * pRede / 100).toFixed(2);
    const vImpostos = (valor * pImpostos / 100).toFixed(2);

    /* ========================= */
    /* ATUALIZAÇÃO DO TEXTO DINÂMICO */
    /* ========================= */

    // Seleciona elementos do card explicativo
    const cardInfo = document.getElementById('explica-imposto');
    const textoDinamico = document.getElementById('texto-dinamico');

    // Mostra o card (estava oculto no CSS)
    cardInfo.style.display = 'block';

    // Insere explicação com valores calculados
    textoDinamico.innerHTML = `
        Dos seus R$ ${valor.toFixed(2)}, cerca de <strong>R$ ${vImpostos}</strong> 
        são impostos (ICMS/PIS/COFINS) que retornam para serviços públicos. 
        <strong>R$ ${vGeracao}</strong> pagam as usinas e combustíveis.
    `;

    /* ========================= */
    /* CRIAÇÃO DO GRÁFICO (CHART.JS) */
    /* ========================= */

    // Pega o contexto do canvas
    const ctx = document.getElementById('graficoEnergia').getContext('2d');

    // Se já existe gráfico, destrói antes de criar outro (evita duplicação)
    if (meuGrafico) meuGrafico.destroy();

    // Cria novo gráfico tipo "rosca" (doughnut)
    meuGrafico = new Chart(ctx, {
        type: 'doughnut',

        data: {
            labels: ['Geração', 'Rede (Fios)', 'Impostos'],
            datasets: [{
                data: [pGeracao, pRede, pImpostos],

                // Cores das fatias
                backgroundColor: ['#ff6600', '#444', '#e74c3c'],

                // Cor da borda
                borderColor: '#050505',

                borderWidth: 4,

                // Efeito ao passar o mouse
                hoverOffset: 15
            }]
        },

        options: {
            // Tamanho do "buraco" no meio
            cutout: '75%',

            responsive: true,

            plugins: {
                legend: {
                    position: 'bottom',

                    labels: {
                        color: 'white',

                        // Fonte do gráfico (igual ao projeto)
                        font: {
                            family: 'Playfair Display',
                            size: 14
                        }
                    }
                }
            }
        }
    });

    /* ========================= */
    /* ATUALIZAÇÃO DA TABELA (MME) */
    /* ========================= */

    // Seleciona o corpo da tabela
    const corpo = document.getElementById('tabelaCorpo');

    // Insere linhas dinamicamente com base no valor
    corpo.innerHTML = `
        <tr><td>Geração</td><td>Usinas (Hidro, Térmicas e Solar)</td><td>${pGeracao}% (R$ ${vGeracao})</td></tr>
        <tr><td>Transmissão</td><td>Linhas de Alta Tensão (Torres)</td><td>7% (R$ ${(valor * 0.07).toFixed(2)})</td></tr>
        <tr><td>Distribuição</td><td>Rede Urbana (Postes e Fiação)</td><td>18% (R$ ${(valor * 0.18).toFixed(2)})</td></tr>
        <tr><td>Impostos Estaduais</td><td>ICMS (Financia Saúde e Educação)</td><td>25% (R$ ${(valor * 0.25).toFixed(2)})</td></tr>
        <tr><td>Encargos Sociais</td><td>Subsídios (Tarifa Social)</td><td>15% (R$ ${(valor * 0.15).toFixed(2)})</td></tr>
    `;
}


/* ========================= */
/* INICIALIZAÇÃO DO SISTEMA */
/* ========================= */
/* Executa quando o HTML termina de carregar */
document.addEventListener('DOMContentLoaded', () => {

    // Log de confirmação (debug)
    console.log("EcoPower Coding pronto para brilhar!");
});