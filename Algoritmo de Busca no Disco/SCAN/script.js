const blocos = [500, 659, 914, 999, 447, 335, 278, 161, 71];
let indexDeslocamento = 0;
let deslocamento = 0;
let totalDeslocamento = 0;

// Desenhar eixos do gráfico
function desenharEixos(ctx, largura, altura) {
    // Eixo X (bloco)
    ctx.beginPath();
    ctx.moveTo(50, altura - 15); // Início do eixo
    ctx.lineTo(largura - 20, altura - 15); // Fim do eixo
    ctx.stroke();

    // Eixo Y (tempo)
    ctx.beginPath();
    ctx.moveTo(50, altura - 15); // Início do eixo
    ctx.lineTo(50, 0); // Fim do eixo
    ctx.stroke();

    // Adicionar rótulos ao eixo X
    ctx.textAlign = "center";
    for (let i = 0; i <= 10; i++) {
        let x = 50 + (i * (largura - 100) / 10);
        ctx.fillText(i * 100, x, altura);
    }

    // Adicionar rótulos dos eixos
    ctx.fillText("#bloco", largura - 50, altura - 25);
    ctx.save();
    ctx.translate(40, 80);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("t (tempo)", 0, 0);
    ctx.restore();
}

// Adicionar desenho do gráfico
async function criarDesenho() {
    var canvas = document.getElementById("grafico");
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.8;

    ctx.moveTo(200, 185);

    const pontos = [
        { x: 200, y: 185, novoBloco: true }, // 500
        { x: 200, y: 175, novoBloco: false },
        { x: 245, y: 165, novoBloco: true }, // 659
        { x: 245, y: 150, novoBloco: false },
        { x: 330, y: 135, novoBloco: true }, // 914
        { x: 330, y: 125, novoBloco: false },
        { x: 360, y: 115, novoBloco: true }, // 999

        { x: 185, y: 100, novoBloco: true }, // 447
        { x: 185, y: 90,  novoBloco: false },
        { x: 145, y: 85,  novoBloco: true }, // 335
        { x: 145, y: 75,  novoBloco: false },
        { x: 130, y: 70,  novoBloco: true }, // 278
        { x: 130, y: 60,  novoBloco: false },
        { x: 100, y: 55,  novoBloco: true }, // 161
        { x: 100, y: 45,  novoBloco: false },
        { x: 70,  y: 40,  novoBloco: true }, // 71
        { x: 70,  y: 30,  novoBloco: false }
    ];

    for(let i = 0; i < pontos.length; i++) {
        somarDeslocamento(pontos[i].novoBloco);
        atualizarDescricao(pontos[i].novoBloco);

        ctx.lineTo(pontos[i].x, pontos[i].y);

        if (i % 2 != 0 && i < 7) {
            ctx.save();
            ctx.strokeStyle = "green";
        } else if (i % 2 == 0 && i >= 7) {
            ctx.save();
            ctx.strokeStyle = "green";
        } else {
            ctx.save();
            ctx.strokeStyle = "black";
        }

        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(pontos[i - 1].x, pontos[i - 1].y);
            ctx.lineTo(pontos[i].x, pontos[i].y);
            ctx.stroke();
        }
    
        if (i % 2 != 0) {
            ctx.restore();
        }
    
        await sleep(3000);
    }
}

// Atualizar descrição do bloco
function atualizarDescricao(novoBloco) {
    if (!novoBloco) {
        if (indexDeslocamento === blocos.length) {
            document.getElementById("pgFault").textContent = `Busca Finalizada!`;
        } else {
            document.getElementById("pgFault").textContent = `Indo para o bloco ${blocos[indexDeslocamento]}.`;
        }

        if (blocos[indexDeslocamento] === 999) {
            document.getElementById("pgFault").textContent = `Desloca até o último bloco antes de retornar a varredura.`;
        }

        document.getElementById("pgFault").style.color = "black";
    } else {
        document.getElementById("pgFault").textContent = `Bloco ${blocos[indexDeslocamento - 1]} encontrado.`;
        document.getElementById("pgFault").style.color = "green";
    }
}

// Somar deslocamento e atualizar índice de deslocamento
function somarDeslocamento(atualiza) {
    if (atualiza){
        console.log(blocos[indexDeslocamento]);

        if (indexDeslocamento < blocos.length - 1) {
            if (blocos[indexDeslocamento] < blocos[indexDeslocamento + 1]) {
                deslocamento = (blocos[indexDeslocamento + 1] - blocos[indexDeslocamento]);
            } else {
                deslocamento = (blocos[indexDeslocamento] - blocos[indexDeslocamento + 1]);
            }

            console.log("deslocamento: " + deslocamento);
            if (deslocamento === 552) {
                atualizarDescricaoBloco();
                console.log("Agora!");
            }

            indexDeslocamento++;
        } else {
            indexDeslocamento++;
            document.getElementById("deslocamento").innerHTML = "<b>Total de Blocos Deslocados:</b> " + totalDeslocamento + " blocos";
        }
    } else {
        atualizarDescricaoBloco();
    }
}

// Atualizar descrição de blocos percorridos
function atualizarDescricaoBloco(){
    if (blocos[indexDeslocamento] === undefined) {
        document.getElementById("deslocamentoAtual").innerHTML = "";

        return;
    }
    
    let descricaoDeslocamentoAtual = "<b>Blocos Deslocados Para Chegar ao Bloco Requisitado:</b> " + (deslocamento) + " blocos";
    document.getElementById("deslocamentoAtual").innerHTML = descricaoDeslocamentoAtual;

    totalDeslocamento += deslocamento;
    let descricaoDeslocamento = "<b>Total de Blocos Deslocados:</b> " + totalDeslocamento + " blocos";
    document.getElementById("deslocamento").innerHTML = descricaoDeslocamento;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function iniciarAnimacao() {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    const largura = canvas.width;
    const altura = canvas.height;

    desenharEixos(ctx, largura, altura);

    await criarDesenho();
}