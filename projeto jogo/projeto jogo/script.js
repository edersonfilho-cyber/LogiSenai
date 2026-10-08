const menu = document.getElementById("menu");
const jogo = document.getElementById("jogo");
const loja = document.getElementById("loja");
const final = document.getElementById("final");

const jogador = document.getElementById("jogador");

const pontosEl = document.getElementById("pontos");
const dinheiroEl = document.getElementById("dinheiro");
const dinheiroMenuEl = document.getElementById("dinheiroMenu");
const dinheiroLojaEl = document.getElementById("dinheiroLoja");

const nivelEl = document.getElementById("nivel");
const entreguesEl = document.getElementById("entregues");
const metaEl = document.getElementById("meta");
const vidasEl = document.getElementById("vidas");
const tempoEl = document.getElementById("tempo");

const pedidoEl = document.getElementById("pedido");
const cargaEl = document.getElementById("carga");
const capacidadeAtualEl = document.getElementById("capacidadeAtual");

const comboEl = document.getElementById("combo");
const precisaoEl = document.getElementById("precisao");

const velocidadeAtualEl = document.getElementById("velocidadeAtual");
const equipamentoAtualEl = document.getElementById("equipamentoAtual");

const dica = document.getElementById("dica");
const mensagem = document.getElementById("mensagem");

const btnLoja = document.getElementById("btnLoja");
const btnFecharLoja = document.getElementById("btnFecharLoja");

const comprarEmpilhadeira = document.getElementById("comprarEmpilhadeira");
const comprarVelocidade = document.getElementById("comprarVelocidade");
const comprarCarga = document.getElementById("comprarCarga");
const comprarPicking = document.getElementById("comprarPicking");

let jogadorX = 480;
let jogadorY = 320;

let teclas = {};

let pontos = 0;

let dinheiro = Number(
    localStorage.getItem("logisenaiDinheiro") || 0
);

let nivel = 1;
let vidas = 3;

let pedidosEntregues = 0;
let meta = 5;

let tempo = 120;

let combo = 0;

let totalInteracoes = 0;
let interacoesCorretas = 0;

let pedidoAtual = [];
let carga = [];

let jogando = false;

let intervaloTempo;
let animacao;

let nivelEmpilhadeira = Number(
    localStorage.getItem("logisenaiEmpilhadeira") || 0
);

let nivelVelocidade = Number(
    localStorage.getItem("logisenaiVelocidade") || 0
);

let nivelCarga = Number(
    localStorage.getItem("logisenaiCarga") || 0
);

let nivelPicking = Number(
    localStorage.getItem("logisenaiPicking") || 0
);

const PRECO_EMPILHADEIRA = 500;
const PRECO_VELOCIDADE = 300;
const PRECO_CARGA = 400;
const PRECO_PICKING = 350;

const produtos = [
    {
        id: "A01",
        nome: "Componente Azul",
        emoji: "🔵",
        x: 85,
        y: 110
    },
    {
        id: "A02",
        nome: "Componente Vermelho",
        emoji: "🔴",
        x: 145,
        y: 110
    },
    {
        id: "A03",
        nome: "Componente Verde",
        emoji: "🟢",
        x: 205,
        y: 110
    },
    {
        id: "B01",
        nome: "Peça Mecânica",
        emoji: "⚙️",
        x: 85,
        y: 300
    },
    {
        id: "B02",
        nome: "Peça Elétrica",
        emoji: "🔌",
        x: 145,
        y: 300
    },
    {
        id: "B03",
        nome: "Ferramenta",
        emoji: "🔧",
        x: 205,
        y: 300
    },
    {
        id: "C01",
        nome: "Caixa Pequena",
        emoji: "📦",
        x: 85,
        y: 490
    },
    {
        id: "C02",
        nome: "Caixa Grande",
        emoji: "📦",
        x: 145,
        y: 490
    },
    {
        id: "C03",
        nome: "Produto Frágil",
        emoji: "🥚",
        x: 205,
        y: 490
    }
];

const obstaculos = [
    {
        x: 390,
        y: 140,
        largura: 80,
        altura: 80
    },
    {
        x: 530,
        y: 460,
        largura: 80,
        altura: 80
    },
    {
        x: 640,
        y: 90,
        largura: 90,
        altura: 80
    }
];

let recorde = Number(
    localStorage.getItem("recordeLogiSENAI") || 0
);

const recordeEl = document.getElementById("recorde");

if (recordeEl) {
    recordeEl.textContent = recorde;
}

function capacidadeMaxima() {
    return 4 + nivelCarga * 2;
}

function velocidadeBase() {
    let velocidade = 3.5;

    velocidade += nivelVelocidade * 0.7;

    if (nivelEmpilhadeira > 0) {
        velocidade += 2.5;
    }

    return velocidade;
}

function distanciaColeta() {
    return 45;
}

function nomeVelocidade() {
    if (nivelEmpilhadeira > 0) {
        return "⚡ Muito rápida";
    }

    if (nivelVelocidade > 0) {
        return "⚡ Melhorada";
    }

    return "Normal";
}

function nomeEquipamento() {
    if (nivelEmpilhadeira > 0) {
        return "🧑‍🔧 Construtor + Empilhadeira";
    }

    return "🧑‍🔧 Construtor";
}

function salvarHabilidades() {
    localStorage.setItem(
        "logisenaiEmpilhadeira",
        nivelEmpilhadeira
    );

    localStorage.setItem(
        "logisenaiVelocidade",
        nivelVelocidade
    );

    localStorage.setItem(
        "logisenaiCarga",
        nivelCarga
    );

    localStorage.setItem(
        "logisenaiPicking",
        nivelPicking
    );

    localStorage.setItem(
        "logisenaiDinheiro",
        dinheiro
    );
}

function atualizarLoja() {
    if (dinheiroLojaEl) {
        dinheiroLojaEl.textContent = dinheiro;
    }

    const nivelEmpEl =
        document.getElementById("nivelEmpilhadeira");

    const nivelVelEl =
        document.getElementById("nivelVelocidade");

    const nivelCargaEl =
        document.getElementById("nivelCarga");

    const nivelPickEl =
        document.getElementById("nivelPicking");

    if (nivelEmpEl) {
        nivelEmpEl.textContent =
            "Nível " + nivelEmpilhadeira;
    }

    if (nivelVelEl) {
        nivelVelEl.textContent =
            "Nível " + nivelVelocidade;
    }

    if (nivelCargaEl) {
        nivelCargaEl.textContent =
            "Capacidade " + capacidadeMaxima();
    }

    if (nivelPickEl) {
        nivelPickEl.textContent =
            "Nível " + nivelPicking;
    }

    const precoEmp =
        PRECO_EMPILHADEIRA *
        (nivelEmpilhadeira + 1);

    const precoVel =
        PRECO_VELOCIDADE *
        (nivelVelocidade + 1);

    const precoCarga =
        PRECO_CARGA *
        (nivelCarga + 1);

    const precoPick =
        PRECO_PICKING *
        (nivelPicking + 1);

    if (comprarEmpilhadeira) {
        comprarEmpilhadeira.innerHTML =
            `Comprar<br>💰 R$ ${precoEmp}`;

        comprarEmpilhadeira.disabled =
            dinheiro < precoEmp;
    }

    if (comprarVelocidade) {
        comprarVelocidade.innerHTML =
            `Comprar<br>💰 R$ ${precoVel}`;

        comprarVelocidade.disabled =
            dinheiro < precoVel;
    }

    if (comprarCarga) {
        comprarCarga.innerHTML =
            `Comprar<br>💰 R$ ${precoCarga}`;

        comprarCarga.disabled =
            dinheiro < precoCarga;
    }

    if (comprarPicking) {
        comprarPicking.innerHTML =
            `Comprar<br>💰 R$ ${precoPick}`;

        comprarPicking.disabled =
            dinheiro < precoPick;
    }
}

if (comprarEmpilhadeira) {
    comprarEmpilhadeira.addEventListener(
        "click",
        function() {
            const preco =
                PRECO_EMPILHADEIRA *
                (nivelEmpilhadeira + 1);

            if (dinheiro < preco) {
                mostrarMensagem(
                    "💸 Dinheiro insuficiente!"
                );
                return;
            }

            dinheiro -= preco;
            nivelEmpilhadeira++;

            salvarHabilidades();
            atualizarInterface();
            atualizarLoja();

            mostrarMensagem(
                "🏗️ Empilhadeira adquirida! Você ficou mais rápido."
            );
        }
    );
}

if (comprarVelocidade) {
    comprarVelocidade.addEventListener(
        "click",
        function() {
            const preco =
                PRECO_VELOCIDADE *
                (nivelVelocidade + 1);

            if (dinheiro < preco) {
                mostrarMensagem(
                    "💸 Dinheiro insuficiente!"
                );
                return;
            }

            dinheiro -= preco;
            nivelVelocidade++;

            salvarHabilidades();
            atualizarInterface();
            atualizarLoja();

            mostrarMensagem(
                "⚡ Velocidade aumentada!"
            );
        }
    );
}

if (comprarCarga) {
    comprarCarga.addEventListener(
        "click",
        function() {
            const preco =
                PRECO_CARGA *
                (nivelCarga + 1);

            if (dinheiro < preco) {
                mostrarMensagem(
                    "💸 Dinheiro insuficiente!"
                );
                return;
            }

            dinheiro -= preco;
            nivelCarga++;

            salvarHabilidades();
            atualizarInterface();
            atualizarLoja();

            mostrarMensagem(
                "🎒 Capacidade de carga aumentada!"
            );
        }
    );
}

if (comprarPicking) {
    comprarPicking.addEventListener(
        "click",
        function() {
            const preco =
                PRECO_PICKING *
                (nivelPicking + 1);

            if (dinheiro < preco) {
                mostrarMensagem(
                    "💸 Dinheiro insuficiente!"
                );
                return;
            }

            dinheiro -= preco;
            nivelPicking++;

            salvarHabilidades();
            atualizarInterface();
            atualizarLoja();

            mostrarMensagem(
                "📦 Área de coleta aumentada!"
            );
        }
    );
}

function trocarTela(tela) {
    document.querySelectorAll(
        ".tela"
    ).forEach(
        function(elemento) {
            elemento.classList.remove(
                "ativa"
            );
        }
    );

    if (tela) {
        tela.classList.add("ativa");
    }
}

if (btnLoja) {
    btnLoja.addEventListener(
        "click",
        function() {
            if (!jogando) return;

            atualizarLoja();
            trocarTela(loja);
        }
    );
}

if (btnFecharLoja) {
    btnFecharLoja.addEventListener(
        "click",
        function() {
            trocarTela(jogo);
            atualizarInterface();

            cancelAnimationFrame(animacao);

            loop();
        }
    );
}

function mostrarMensagem(texto) {
    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.classList.add("mostrar");

    clearTimeout(
        mostrarMensagem.timer
    );

    mostrarMensagem.timer =
        setTimeout(
            function() {
                mensagem.classList.remove(
                    "mostrar"
                );
            },
            2200
        );
}

function iniciarJogo() {
    trocarTela(jogo);

    pontos = 0;
    nivel = 1;
    vidas = 3;
    pedidosEntregues = 0;
    meta = 5;
    tempo = 120;
    combo = 0;

    totalInteracoes = 0;
    interacoesCorretas = 0;

    carga = [];

    jogadorX = 480;
    jogadorY = 320;

    jogando = true;

    criarPedido();

    atualizarInterface();
    posicionarJogador();

    clearInterval(intervaloTempo);

    intervaloTempo =
        setInterval(
            function() {
                if (!jogando) return;

                tempo--;

                atualizarInterface();

                if (tempo <= 0) {
                    terminarJogo(false);
                }
            },
            1000
        );

    cancelAnimationFrame(animacao);

    loop();

    mostrarMensagem(
        "🚚 Operação iniciada!"
    );
}

function criarPedido() {
    pedidoAtual = [];

    let quantidadeItens = 2;

    if (nivel >= 2) {
        quantidadeItens = 3;
    }

    if (nivel >= 3) {
        quantidadeItens = 4;
    }

    let disponiveis = [
        ...produtos
    ];

    for (
        let i = 0;
        i < quantidadeItens;
        i++
    ) {
        const indice =
            Math.floor(
                Math.random() *
                disponiveis.length
            );

        const produto =
            disponiveis.splice(
                indice,
                1
            )[0];

        pedidoAtual.push({
            id: produto.id,
            quantidade:
                1 +
                Math.floor(
                    Math.random() * 2
                ),
            coletado: 0
        });
    }

    mostrarPedido();
}

function mostrarPedido() {
    if (!pedidoEl) return;

    pedidoEl.innerHTML = "";

    pedidoAtual.forEach(
        function(item) {
            const produto =
                produtos.find(
                    function(p) {
                        return p.id === item.id;
                    }
                );

            if (!produto) return;

            const div =
                document.createElement("div");

            div.className =
                "item-pedido";

            if (
                item.coletado >=
                item.quantidade
            ) {
                div.classList.add(
                    "concluido"
                );
            }

            div.innerHTML = `
                <span>
                    ${produto.emoji}
                    ${produto.nome}
                </span>

                <strong>
                    ${item.coletado}/${item.quantidade}
                </strong>
            `;

            pedidoEl.appendChild(div);
        }
    );
}

function mostrarCarga() {
    if (!cargaEl) return;

    cargaEl.innerHTML = "";

    if (carga.length === 0) {
        cargaEl.innerHTML =
            '<p class="vazio">Carrinho vazio</p>';

        return;
    }

    carga.forEach(
        function(produto) {
            const div =
                document.createElement("div");

            div.className =
                "item-carga";

            div.innerHTML =
                `${produto.emoji} ${produto.nome}`;

            cargaEl.appendChild(div);
        }
    );
}

function atualizarInterface() {
    if (pontosEl) {
        pontosEl.textContent = pontos;
    }

    if (dinheiroEl) {
        dinheiroEl.textContent = dinheiro;
    }

    if (dinheiroMenuEl) {
        dinheiroMenuEl.textContent =
            "R$ " + dinheiro;
    }

    if (nivelEl) {
        nivelEl.textContent = nivel;
    }

    if (entreguesEl) {
        entreguesEl.textContent =
            pedidosEntregues;
    }

    if (metaEl) {
        metaEl.textContent = meta;
    }

    if (vidasEl) {
        vidasEl.textContent = vidas;
    }

    if (tempoEl) {
        tempoEl.textContent = tempo;
    }

    if (comboEl) {
        comboEl.textContent =
            "x" + combo;
    }

    if (capacidadeAtualEl) {
        capacidadeAtualEl.textContent =
            capacidadeMaxima();
    }

    if (velocidadeAtualEl) {
        velocidadeAtualEl.textContent =
            nomeVelocidade();
    }

    if (equipamentoAtualEl) {
        equipamentoAtualEl.textContent =
            nomeEquipamento();
    }

    let precisao = 100;

    if (totalInteracoes > 0) {
        precisao =
            Math.round(
                (
                    interacoesCorretas /
                    totalInteracoes
                ) * 100
            );
    }

    if (precisaoEl) {
        precisaoEl.textContent =
            precisao + "%";
    }

    mostrarPedido();
    mostrarCarga();
}

function posicionarJogador() {
    if (!jogador) return;

    jogador.style.left =
        jogadorX + "px";

    jogador.style.top =
        jogadorY + "px";

    jogador.textContent =
        "🧑‍🔧";

    jogador.classList.remove(
        "empilhadeira"
    );
}

function distancia(
    x1,
    y1,
    x2,
    y2
) {
    return Math.sqrt(
        Math.pow(
            x1 - x2,
            2
        ) +
        Math.pow(
            y1 - y2,
            2
        )
    );
}

function colide(x, y) {
    if (x < 5) return true;
    if (y < 5) return true;
    if (x > 980) return true;
    if (y > 590) return true;

    for (
        const obstaculo
        of obstaculos
    ) {
        if (
            x <
                obstaculo.x +
                obstaculo.largura &&

            x + 45 >
                obstaculo.x &&

            y <
                obstaculo.y +
                obstaculo.altura &&

            y + 45 >
                obstaculo.y
        ) {
            return true;
        }
    }

    return false;
}

function estaEmCimaDoProduto(produto) {
    const jogadorEsquerda = jogadorX;
    const jogadorDireita = jogadorX + 45;

    const jogadorTopo = jogadorY;
    const jogadorBaixo = jogadorY + 45;

    const produtoEsquerda = produto.x;
    const produtoDireita = produto.x + 40;

    const produtoTopo = produto.y;
    const produtoBaixo = produto.y + 40;

    return (
        jogadorDireita >= produtoEsquerda &&
        jogadorEsquerda <= produtoDireita &&
        jogadorBaixo >= produtoTopo &&
        jogadorTopo <= produtoBaixo
    );
}

function produtoProximo() {
    for (
        const produto
        of produtos
    ) {
        const itemPedido =
            pedidoAtual.find(
                function(item) {
                    return item.id === produto.id;
                }
            );

        if (!itemPedido) {
            continue;
        }

        if (
            itemPedido.coletado >=
            itemPedido.quantidade
        ) {
            continue;
        }

        if (
            estaEmCimaDoProduto(
                produto
            )
        ) {
            return produto;
        }
    }

    return null;
}

function estaNaExpedicao() {
    const jogadorEsquerda = jogadorX;
    const jogadorDireita = jogadorX + 45;

    const jogadorTopo = jogadorY;
    const jogadorBaixo = jogadorY + 45;

    const expedicaoEsquerda = 840;
    const expedicaoDireita = 920;

    const expedicaoTopo = 480;
    const expedicaoBaixo = 560;

    return (
        jogadorDireita >= expedicaoEsquerda &&
        jogadorEsquerda <= expedicaoDireita &&
        jogadorBaixo >= expedicaoTopo &&
        jogadorTopo <= expedicaoBaixo
    );
}

function interagir() {
    if (!jogando) return;

    totalInteracoes++;

    if (estaNaExpedicao()) {
        if (carga.length === 0) {
            mostrarMensagem(
                "ℹ️ O carrinho está vazio."
            );

            return;
        }

        let pedidoCompleto = true;

        for (
            const item
            of pedidoAtual
        ) {
            if (
                item.coletado <
                item.quantidade
            ) {
                pedidoCompleto = false;
                break;
            }
        }

        if (!pedidoCompleto) {
            combo = 0;

            atualizarInterface();

            mostrarMensagem(
                "⚠️ Ainda faltam produtos!"
            );

            return;
        }

        const dinheiroGanho =
            100 +
            nivel * 50 +
            combo * 15 +
            Math.floor(
                tempo / 2
            );

        const pontosGanho =
            200 +
            tempo * 2 +
            combo * 20 +
            nivel * 50;

        dinheiro +=
            dinheiroGanho;

        pontos +=
            pontosGanho;

        pedidosEntregues++;

        carga = [];

        combo++;

        tempo += 20;

        salvarHabilidades();

        atualizarInterface();

        mostrarMensagem(
            "🚚 Pedido entregue! +R$ " +
            dinheiroGanho +
            " | ⏱️ +20 segundos!"
        );

        if (
            pedidosEntregues >=
            meta
        ) {
            if (nivel >= 3) {
                terminarJogo(true);
                return;
            }

            nivel++;

            pedidosEntregues = 0;

            meta =
                5 +
                nivel * 2;

            tempo =
                120 +
                nivel * 10;

            criarPedido();

            atualizarInterface();

            mostrarMensagem(
                "⭐ Nível " +
                nivel +
                " desbloqueado!"
            );
        } else {
            criarPedido();

            atualizarInterface();
        }

        return;
    }

    const produto =
        produtoProximo();

    if (produto) {
        const itemPedido =
            pedidoAtual.find(
                function(item) {
                    return item.id === produto.id;
                }
            );

        if (!itemPedido) {
            combo = 0;

            atualizarInterface();

            mostrarMensagem(
                "❌ Esse produto não faz parte do pedido."
            );

            return;
        }

        if (
            itemPedido.coletado >=
            itemPedido.quantidade
        ) {
            mostrarMensagem(
                "⚠️ Você já pegou a quantidade necessária."
            );

            return;
        }

        if (
            carga.length >=
            capacidadeMaxima()
        ) {
            mostrarMensagem(
                "🎒 Carrinho cheio! Compre uma melhoria para carregar mais."
            );

            return;
        }

        itemPedido.coletado++;

        carga.push(produto);

        interacoesCorretas++;

        combo++;

        pontos +=
            30 +
            combo * 5;

        atualizarInterface();

        mostrarMensagem(
            "📦 " +
            produto.nome +
            " coletado!"
        );

        return;
    }

    mostrarMensagem(
        "ℹ️ Fique em cima de um produto ou da área de expedição."
    );
}

function atualizarDica() {
    if (!dica) return;

    if (
        estaNaExpedicao() &&
        carga.length > 0
    ) {
        dica.style.display = "block";

        dica.style.left =
            (jogadorX + 55) +
            "px";

        dica.style.top =
            (jogadorY - 10) +
            "px";

        dica.textContent =
            "E — entregar pedido";

        return;
    }

    const produto =
        produtoProximo();

    if (produto) {
        dica.style.display = "block";

        dica.style.left =
            (jogadorX + 55) +
            "px";

        dica.style.top =
            (jogadorY - 10) +
            "px";

        dica.textContent =
            "E — pegar " +
            produto.emoji +
            " " +
            produto.id;

        return;
    }

    dica.style.display = "none";
}

function atualizarMovimento() {
    if (!jogando) return;

    let dx = 0;
    let dy = 0;

    if (
        teclas["w"] ||
        teclas["arrowup"]
    ) {
        dy--;
    }

    if (
        teclas["s"] ||
        teclas["arrowdown"]
    ) {
        dy++;
    }

    if (
        teclas["a"] ||
        teclas["arrowleft"]
    ) {
        dx--;
    }

    if (
        teclas["d"] ||
        teclas["arrowright"]
    ) {
        dx++;
    }

    if (
        dx !== 0 ||
        dy !== 0
    ) {
        const tamanho =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= tamanho;
        dy /= tamanho;

        let velocidade =
            velocidadeBase();

        if (teclas["shift"]) {
            velocidade *= 1.5;
        }

        const novoX =
            jogadorX +
            dx * velocidade;

        const novoY =
            jogadorY +
            dy * velocidade;

        if (
            !colide(
                novoX,
                jogadorY
            )
        ) {
            jogadorX =
                novoX;
        }

        if (
            !colide(
                jogadorX,
                novoY
            )
        ) {
            jogadorY =
                novoY;
        }

        posicionarJogador();
    }
}

function loop() {
    if (!jogando) return;

    atualizarMovimento();
    atualizarDica();

    animacao =
        requestAnimationFrame(
            loop
        );
}

function terminarJogo(vitoria) {
    jogando = false;

    clearInterval(
        intervaloTempo
    );

    cancelAnimationFrame(
        animacao
    );

    if (pontos > recorde) {
        recorde = pontos;

        localStorage.setItem(
            "recordeLogiSENAI",
            recorde
        );
    }

    const pontuacaoFinal =
        document.getElementById(
            "pontuacaoFinal"
        );

    const dinheiroFinal =
        document.getElementById(
            "dinheiroFinal"
        );

    const nivelFinal =
        document.getElementById(
            "nivelFinal"
        );

    const tituloFinal =
        document.getElementById(
            "tituloFinal"
        );

    const textoFinal =
        document.getElementById(
            "textoFinal"
        );

    if (pontuacaoFinal) {
        pontuacaoFinal.textContent =
            pontos;
    }

    if (dinheiroFinal) {
        dinheiroFinal.textContent =
            "R$ " + dinheiro;
    }

    if (nivelFinal) {
        nivelFinal.textContent =
            nivel;
    }

    if (vitoria) {
        if (tituloFinal) {
            tituloFinal.textContent =
                "🏆 OPERAÇÃO CONCLUÍDA!";
        }

        if (textoFinal) {
            textoFinal.textContent =
                "Parabéns! Você dominou o centro de distribuição e construiu sua evolução logística.";
        }
    } else {
        if (tituloFinal) {
            tituloFinal.textContent =
                "💀 OPERAÇÃO ENCERRADA";
        }

        if (textoFinal) {
            textoFinal.textContent =
                "O tempo acabou. Use o dinheiro ganho para melhorar seu equipamento e tente novamente.";
        }
    }

    salvarHabilidades();

    trocarTela(final);
}

document.addEventListener(
    "keydown",
    function(event) {
        const tecla =
            event.key.toLowerCase();

        teclas[tecla] = true;

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                " "
            ].includes(tecla)
        ) {
            event.preventDefault();
        }

        if (tecla === "e") {
            event.preventDefault();
            interagir();
        }

        if (tecla === "b") {
            event.preventDefault();

            if (jogando) {
                atualizarLoja();
                trocarTela(loja);
            }
        }
    }
);

document.addEventListener(
    "keyup",
    function(event) {
        teclas[
            event.key.toLowerCase()
        ] = false;
    }
);

const btnIniciar =
    document.getElementById(
        "btnIniciar"
    );

const btnNovamente =
    document.getElementById(
        "btnNovamente"
    );

const btnMenu =
    document.getElementById(
        "btnMenu"
    );

if (btnIniciar) {
    btnIniciar.addEventListener(
        "click",
        iniciarJogo
    );
}

if (btnNovamente) {
    btnNovamente.addEventListener(
        "click",
        iniciarJogo
    );
}

if (btnMenu) {
    btnMenu.addEventListener(
        "click",
        function() {
            jogando = false;

            clearInterval(
                intervaloTempo
            );

            cancelAnimationFrame(
                animacao
            );

            trocarTela(menu);

            if (recordeEl) {
                recordeEl.textContent =
                    recorde;
            }

            if (dinheiroMenuEl) {
                dinheiroMenuEl.textContent =
                    "R$ " + dinheiro;
            }
        }
    );
}

atualizarInterface();
atualizarLoja();
posicionarJogador();