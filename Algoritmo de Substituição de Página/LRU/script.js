// Animacação dinâmica dos cards de explicação
const paginas = document.querySelectorAll('.card-conteudo');
const anteriorBtn = document.getElementById('anterior-btn');
const proximoBtn = document.getElementById('proximo-btn');
let paginaAtual = 0;

function atualizarCard() {
    paginas.forEach((pagina, index) => {
        pagina.style.display = index === paginaAtual ? 'block' : 'none';
    });

    if (paginaAtual === 0) {
        anteriorBtn.style.visibility = 'hidden';
    } else {
        anteriorBtn.style.visibility = 'visible';
    }

    if (paginaAtual === paginas.length - 1) {
        proximoBtn.style.visibility = 'hidden';
    } else {
        proximoBtn.style.visibility = 'visible';
    }
}

anteriorBtn.addEventListener('click', () => {
    if (paginaAtual > 0) {
        paginaAtual--;
        atualizarCard();
    }
});

proximoBtn.addEventListener('click', () => {
    if (paginaAtual < paginas.length - 1) {
        paginaAtual++;
        atualizarCard();
    }
});

// Animação dinâmica da simulação do algoritmo FIFO
const filaPaginasVisualizacao = document.getElementById("fila-paginas");
const filaPaginasOperacional = document.getElementById("fila-paginas-operacional");

// Configuração inicial
const cadeiaPaginas = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]; // Fila de páginas solicitadas
const quadrosRAM = 3; // Número de quadros na RAM
const conteudoRAM = Array.from({ length: 2 }, () => Array(quadrosRAM).fill(null));
let pageFaults = 0; // Contador de Page Faults

// Inicializar o disco e a fila
cadeiaPaginas.forEach((pagina, index) => {
    const pageElement = createPageElement(pagina);
    const pageVisualElement = createPageVisualElement(pagina, index === 0);

    filaPaginasVisualizacao.prepend(pageVisualElement); // Adicionar na fila de solicitações
    filaPaginasOperacional.appendChild(pageElement); 
});

// Função para criar um elemento de página
function createPageElement(pageContent) {
    const pagina = document.createElement("div");
    pagina.classList.add("operation-page");
    pagina.textContent = pageContent;
    return pagina;
}

// Função para criar um elemento de página para exibição (com vírgulas)
function createPageVisualElement(pageContent, isFirst) {
    const pagina = document.createElement("div");
    pagina.classList.add("visual-page");
    pagina.textContent = isFirst ? pageContent : `${pageContent},`; // Adicionar vírgula, exceto no último
    return pagina;
}

async function simulacaoLRU() {
    const fila = Array.from(filaPaginasOperacional.children);
    const filaVisualizacao = Array.from(filaPaginasVisualizacao.children);
    let indexQuadroAtualizado = -1;
    let quadrosOcupados = 0;

    for (let step = 0; step < fila.length; step++) {
        const elementoFila = fila[step]; // step = Página atual (de 0 a 20)
        const conteudoPagina = parseInt(elementoFila.textContent);

        let statusPagina = "MISS";
        for (let i = 0; i < quadrosRAM; i++) {
            if (conteudoRAM[0][i] === conteudoPagina) {
                statusPagina = "HIT";
            }
        };

        // Descrição da operação
        await descreverOperacao(conteudoPagina, statusPagina);

        // Remover a página da fila
        filaPaginasOperacional.removeChild(elementoFila);

        // Verifica se a página está na RAM
        let index = null;
        for (let i = 0; i < quadrosRAM; i++) {
            if (conteudoRAM[0][i] === conteudoPagina) {
                index = i;
            }
        };

        if (index === null) { // Se a página não estiver na RAM
            // Page Fault: Página não está na RAM
            pageFaults++;

            if (quadrosOcupados === quadrosRAM) {
                for (let i = 0; i < quadrosRAM; i++) {
                    conteudoRAM[1][i]++;
                };

                let maxQuadro = 0;
                for (let i = 0; i < quadrosRAM; i++) {
                    if (conteudoRAM[1][maxQuadro] < conteudoRAM[1][i]) {
                        maxQuadro = i;
                    }
                };

                indexQuadroAtualizado = maxQuadro;
                
                conteudoRAM[0][indexQuadroAtualizado] = conteudoPagina;
                conteudoRAM[1][indexQuadroAtualizado] = 0;
            } else {
                for (let i = 0; i < quadrosRAM; i++) {
                    if (conteudoRAM[0][i] != null) conteudoRAM[1][i]++;
                };
                
                for (let i = 0; i < quadrosRAM; i++) {
                    if (conteudoRAM[0][i] === null) {
                        conteudoRAM[0][i] = conteudoPagina;
                        conteudoRAM[1][i] = 0;
                        break;
                    }
                };

                indexQuadroAtualizado = quadrosOcupados;

                quadrosOcupados = quadrosOcupados + 1;
            }
            
            // Atualizar o último quadro atualizado
            atualizarQuadro(indexQuadroAtualizado + 1, conteudoPagina);

        } else {
            for (let i = 0; i < quadrosRAM; i++) {
                if (conteudoRAM[1][i] < 3 && conteudoRAM[0][i] !== null) {
                    conteudoRAM[1][i]++;
                }
            };

            conteudoRAM[1][index] = 0;
            atualizarQuadro(index + 1, conteudoPagina);
        }

        // Atualizar a RAM na tabela
        atualizarTabelaPagina(step + 1, conteudoPagina, statusPagina, indexQuadroAtualizado);

        // Eliminar elemento da fila de visualização
        if (filaVisualizacao.length > 0) {
            const ultimoElemento = filaPaginasVisualizacao.lastChild;
            filaPaginasVisualizacao.removeChild(ultimoElemento); // Remove o último elemento
            filaVisualizacao.pop(); // Atualiza a lista visual
        }

        const ram = document.getElementById("ram");
        ram.style.backgroundColor = "#f8f5eb";

        // Pausa para visualização
        await wait(1000);
    }

    alert(`Simulação completa! Total de Page Faults: ${pageFaults}`);
}

// Atualizar a tabela de RAM
function atualizarTabelaPagina(step, conteudoPagina, statusPagina) {
    // Atualizar linha "Página Adicionada"
    const linhaPaginas = document.getElementById("linha-paginas");
    const pagina = document.createElement("td");
    pagina.textContent = conteudoPagina;
    linhaPaginas.appendChild(pagina);

    // Atualizar linhas dos quadros da RAM
    for (let i = 0; i < quadrosRAM; i++) {
        const linhaQuadros = document.getElementById(`linha-quadro-${i + 1}`);
        const paginaQuadro = document.createElement("td");
        paginaQuadro.textContent = conteudoRAM[0][i] !== null ? conteudoRAM[0][i] : "*";

        if (statusPagina === "HIT" && conteudoRAM[0][i] === conteudoPagina) {
            paginaQuadro.classList.add("page-hit");
        } else if (statusPagina === "MISS" && conteudoRAM[0][i] === conteudoPagina) {
            paginaQuadro.classList.add("page-fault");
        }

        linhaQuadros.appendChild(paginaQuadro);
    }

    // Atualizar linha "Tempo"
    const linhaTempo = document.getElementById("linha-tempo");
    const tempo = document.createElement("td");
    tempo.textContent = step;
    linhaTempo.appendChild(tempo);
}

// Atualizar a quadro do bloco de RAM
function atualizarQuadro(numeroQuadro, valor) {
    const quadro = document.getElementById(`quadro-${numeroQuadro}`);

    if (quadro) {
        quadro.querySelector('span').textContent = valor;
    } else {
        console.log('Quadro não encontrado!');
    }

    for (let i = 1; i <= quadrosRAM; i++) {
        const contador = document.getElementById(`contador-${i}`);

        if (conteudoRAM[1][i - 1] === 3) {
            conteudoRAM[1][i - 1] = 2;
        }

        contador.textContent = conteudoRAM[1][i - 1];
    }
}

// Descrever a operação de busca e substituição de página
async function descreverOperacao(conteudoPagina, statusPagina){
    await processarCpu(conteudoPagina);
    await processarTabelaPaginas();
    await processarMMU(statusPagina, conteudoPagina);
}

async function processarCpu(conteudoPagina){
    const cpu = document.getElementById("cpu");
    const paginaCpu = document.getElementById("pagina-cpu");

    paginaCpu.innerText = "Nº da Página Virtual + Offset";
    descricao.innerText = "Processo em execução na CPU requer determinada página virtual que possui o valor correspondente para acessar o conteúdo " + conteudoPagina + ".";
    cpu.style.backgroundColor = "grey";

    criarSeta("cpu", "tabela-pagina");

    await wait(2500);

    cpu.style.backgroundColor = "#f8f5eb";
    paginaCpu.innerText = "";
}

async function processarTabelaPaginas(){
    const pageTable = document.getElementById("tabela-pagina");
    const paginaSolicitada = document.getElementById("pagina-solicitada");
    const frame = document.getElementById("frame-pagina");

    paginaSolicitada.innerText = "Nº Pág Virtual";
    frame.innerText = "Frame";
    descricao.innerText = "CPU busca na tabela de páginas o endereço correspondente a página passada na requisição.";
    pageTable.style.backgroundColor = "grey";

    criarSeta("tabela-pagina", "mmu");

    await wait(2500);

    pageTable.style.backgroundColor = "#f8f5eb";
    paginaSolicitada.innerText = "...";
    frame.innerText = "...";
}

async function processarMMU(statusPagina, conteudoPagina){
    const mmu = document.getElementById("mmu");
    const quadro1 = document.getElementById("pagina-mmu-1");
    const quadro2 = document.getElementById("pagina-mmu-2");

    quadro1.innerText = "Offset";
    quadro2.innerText = "Frame";
    descricao.innerText = "MMU recebe o endereço da página da tabela de páginas e calcula o endereço físico junto ao offset do processo.";
    mmu.style.backgroundColor = "grey";

    await wait(2500);

    if(statusPagina === "HIT"){
        descricao.innerText = "Através do endereço, MMU encontra a página na memória RAM.";
        mmu.style.backgroundColor = "green";

        criarSeta("mmu", "ram");

        await wait(2500);

        mmu.style.backgroundColor = "#f8f5eb";
        quadro1.innerText = "";
        quadro2.innerText = "";

        await processarRam(conteudoPagina);
    } else {
        descricao.innerText = "Através do endereço, MMU encontra a página no disco.";
        mmu.style.backgroundColor = "red";

        if (conteudoRAM.length === 0){
            await wait(5000);
        } 

        criarSeta("mmu", "disco");

        await wait(2500);

        mmu.style.backgroundColor = "#f8f5eb";
        quadro1.innerText = "";
        quadro2.innerText = "";

        await processarDisco(conteudoPagina);
    }
}

async function processarRam(conteudoPagina){
    const ram = document.getElementById("ram");

    if (conteudoRAM.length === quadrosRAM) {
        descricao.innerText = "RAM está cheia. A página com o maior contador (por extar a mais tempo sem ser utilizada) será será substituída pela página " + conteudoPagina + ".";
    } else {
        descricao.innerText = "Página " + conteudoPagina + " é adicionada à RAM.";
    }

    if (conteudoRAM.includes(conteudoPagina)){
        descricao.innerText = "Página " + conteudoPagina + " já está presente na RAM e pronta para a utilização.";
    }
    
    ram.style.backgroundColor = "grey";

    await wait(2500);
}

async function processarDisco(conteudoPagina){
    const disco = document.getElementById("disco");
    const blocoDisco = document.getElementById("bloco-disco");

    blocoDisco.innerText = conteudoPagina;
    descricao.innerText = "Página " + conteudoPagina + " é encontrada o disco e será levada para a memória principal.";
    disco.style.backgroundColor = "grey";

    if (conteudoRAM.length === 0){
        await wait(5000);
    } 

    criarSeta("ram", "disco");

    await wait(2500);

    disco.style.backgroundColor = "#f8f5eb";
    blocoDisco.innerText = "";

    await processarRam(conteudoPagina);
}

async function criarSeta(origem, destino) {
    const elementoOrigem = document.getElementById(origem);
    const elementoDestino = document.getElementById(destino);
    
    // Coordenadas dos elementos
    const origemRect = elementoOrigem.getBoundingClientRect();
    const destinoRect = elementoDestino.getBoundingClientRect();
    
    // Calcular posição inicial e final da seta
    const x1 = origemRect.right;
    const y1 = origemRect.top + origemRect.height / 2;
    const x2 = destinoRect.left;
    const y2 = destinoRect.top + destinoRect.height / 2;

    // Calcular o comprimento e o ângulo da seta
    const comprimento = Math.hypot(x2 - x1, y2 - y1);
    const angulo = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Criar a seta
    const seta = document.createElement("div");
    seta.className = "seta";
    seta.style.width = `${comprimento}px`;
    seta.style.transform = `rotate(${angulo}deg)`;
    seta.style.top = `${y1}px`;
    seta.style.left = `${x1}px`;
    document.body.appendChild(seta);

    // Remover a seta após 3 segundos
    await wait(2500);
    seta.style.opacity = 0;
    seta.remove();
}

// Função auxiliar para aguardar
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

document.getElementById("iniciar").addEventListener("click", simulacaoLRU);

atualizarCard();