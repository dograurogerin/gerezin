// =====================================
// ELEMENTOS DO SITE
// =====================================

const form = document.getElementById("pedidoForm");
const lista = document.getElementById("listaPedidos");
const campoBusca = document.getElementById("busca");

const recebimento = document.getElementById("recebimento");
const campoEndereco = document.getElementById("campoEndereco");
const endereco = document.getElementById("endereco");


// =====================================
// OPÇÕES DISPONÍVEIS
// =====================================

const statusDisponiveis = [
    "Pedido feito",
    "Em preparo",
    "Finalizado",
    "Entregue"
];

const pagamentosDisponiveis = [
    "Não informado",
    "Não pago",
    "Pago"
];


// =====================================
// CARREGAR PEDIDOS SALVOS
// =====================================

let pedidos = [];

try {

    pedidos = JSON.parse(
        localStorage.getItem("pedidos") || "[]"
    );

    if (!Array.isArray(pedidos)) {
        pedidos = [];
    }

} catch (erro) {

    pedidos = [];

}


// =====================================
// ADAPTAR PEDIDOS ANTIGOS
// =====================================

pedidos = pedidos.map(pedido => ({

    ...pedido,

    status: statusDisponiveis.includes(pedido.status)
        ? pedido.status
        : "Pedido feito",

    horario: pedido.horario || "",

    recebimento: pedido.recebimento || "Não informado",

    endereco: pedido.endereco || "",

    pagamento: pedido.pagamento || "Não informado",

    situacaoPagamento:
        pagamentosDisponiveis.includes(pedido.situacaoPagamento)
            ? pedido.situacaoPagamento
            : "Não informado",

    valor: Number(pedido.valor || 0),

    observacoes: pedido.observacoes || ""

}));


// =====================================
// MOSTRAR OU ESCONDER ENDEREÇO
// =====================================

recebimento.addEventListener("change", function() {

    if (recebimento.value === "Entrega") {

        campoEndereco.classList.add("visivel");

        endereco.required = true;

    } else {

        campoEndereco.classList.remove("visivel");

        endereco.required = false;

        endereco.value = "";

    }

});


// =====================================
// NAVEGAÇÃO ENTRE ABAS
// =====================================

document.querySelectorAll("nav button").forEach(botao => {

    botao.addEventListener("click", function() {

        document.querySelectorAll("nav button")
            .forEach(b => b.classList.remove("active"));

        document.querySelectorAll(".pagina")
            .forEach(p => p.classList.remove("active"));

        botao.classList.add("active");

        document.getElementById(
            botao.dataset.page
        ).classList.add("active");

        atualizarMural();

    });

});


// =====================================
// CADASTRAR NOVO PEDIDO
// =====================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const pedido = {

        id: Date.now(),

        nome: document.getElementById("nome")
            .value.trim(),

        telefone: document.getElementById("telefone")
            .value.trim(),

        quantidade: document.getElementById("quantidade")
            .value,

        tipo: document.getElementById("tipo")
            .value,

        horario: document.getElementById("horario")
            .value,

        recebimento: recebimento.value,

        endereco: recebimento.value === "Entrega"
            ? endereco.value.trim()
            : "",

        pagamento: document.getElementById("pagamento")
            .value,

        valor: Number(
            document.getElementById("valor").value
        ),

        situacaoPagamento: "Não pago",

        observacoes: document.getElementById("observacoes")
            .value.trim(),

        status: "Pedido feito"

    };


    pedidos.push(pedido);

    salvarDados();

    form.reset();

    campoEndereco.classList.remove("visivel");

    endereco.required = false;

    alert("Pedido cadastrado com sucesso!");

    document.querySelector(
        '[data-page="mural"]'
    ).click();

});


// =====================================
// PESQUISA POR NOME OU TELEFONE
// =====================================

campoBusca.addEventListener("input", function() {

    atualizarMural();

});


// =====================================
// SALVAR DADOS NO NAVEGADOR
// =====================================

function salvarDados() {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    atualizarMural();

}


// =====================================
// NORMALIZAR TEXTO DA PESQUISA
// =====================================

function normalizarTexto(texto) {

    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =====================================
// ADICIONAR INFORMAÇÃO À FICHA
// =====================================

function adicionarCampo(ficha, texto) {

    const paragrafo = document.createElement("p");

    paragrafo.textContent = texto;

    ficha.appendChild(paragrafo);

}


// =====================================
// CRIAR OPÇÕES DE UM SELECT
// =====================================

function criarSeletor(opcoes, valorAtual) {

    const seletor = document.createElement("select");

    opcoes.forEach(valor => {

        const opcao = document.createElement("option");

        opcao.value = valor;

        opcao.textContent = valor;

        if (valorAtual === valor) {
            opcao.selected = true;
        }

        seletor.appendChild(opcao);

    });

    return seletor;

}


// =====================================
// ATUALIZAR O MURAL
// =====================================

function atualizarMural() {

    lista.innerHTML = "";

    const pesquisa = normalizarTexto(
        campoBusca.value.trim()
    );


    // FILTRAR PEDIDOS

    const pedidosFiltrados = pedidos.filter(pedido => {

        const nome = normalizarTexto(pedido.nome);

        const telefone = normalizarTexto(pedido.telefone);

        return nome.includes(pesquisa) ||
               telefone.includes(pesquisa);

    });


    // MENSAGEM QUANDO NÃO EXISTEM PEDIDOS

    if (pedidosFiltrados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.className = "vazio";

        mensagem.textContent = pesquisa
            ? "Nenhum pedido encontrado."
            : "Nenhum pedido cadastrado.";

        lista.appendChild(mensagem);

    }


    // CRIAR FICHAS

    pedidosFiltrados.forEach(pedido => {

        const ficha = document.createElement("div");


        // COR DO STATUS

        const classesStatus = {

            "Pedido feito": "status-pedido",

            "Em preparo": "status-preparo",

            "Finalizado": "status-finalizado",

            "Entregue": "status-entregue"

        };

        ficha.className = "ficha " +
            (classesStatus[pedido.status] || "status-pedido");


        // NOME DO CLIENTE

        const titulo = document.createElement("h3");

        titulo.textContent = pedido.nome;

        ficha.appendChild(titulo);


        // INFORMAÇÕES DO PEDIDO

        adicionarCampo(
            ficha,
            "Telefone: " + pedido.telefone
        );

        adicionarCampo(
            ficha,
            "Quantidade: " + pedido.quantidade
        );

        adicionarCampo(
            ficha,
            "Tipo: " + pedido.tipo
        );

        adicionarCampo(
            ficha,
            "Horário: " + (pedido.horario || "Não informado")
        );

        adicionarCampo(
            ficha,
            "Recebimento: " + pedido.recebimento
        );


        // ENDEREÇO DE ENTREGA

        if (pedido.recebimento === "Entrega") {

            adicionarCampo(
                ficha,
                "Endereço: " +
                (pedido.endereco || "Não informado")
            );

        }


        // FORMA DE PAGAMENTO

        adicionarCampo(
            ficha,
            "Forma de pagamento: " + pedido.pagamento
        );


        // OBSERVAÇÕES

        adicionarCampo(
            ficha,
            "Observações: " +
            (pedido.observacoes || "Nenhuma")
        );


        // =================================
        // VALOR EDITÁVEL
        // =================================

        const areaValor = document.createElement("div");

        areaValor.className = "area-valor";

        const labelValor = document.createElement("label");

        labelValor.textContent = "Valor do pedido (R$)";

        const inputValor = document.createElement("input");

        inputValor.type = "number";

        inputValor.min = "0";

        inputValor.step = "0.01";

        inputValor.placeholder = "Digite o valor";

        inputValor.value = Number(
            pedido.valor || 0
        ).toFixed(2);


        inputValor.addEventListener("change", function() {

            const novoValor = Number(inputValor.value);

            if (
                inputValor.value.trim() === "" ||
                !Number.isFinite(novoValor) ||
                novoValor < 0
            ) {

                alert("Digite um valor válido.");

                inputValor.value = Number(
                    pedido.valor || 0
                ).toFixed(2);

                return;

            }

            pedido.valor = novoValor;

            salvarDados();

        });


        areaValor.appendChild(labelValor);

        areaValor.appendChild(inputValor);

        ficha.appendChild(areaValor);


        // =================================
        // STATUS DE PRODUÇÃO
        // =================================

        const labelStatus = document.createElement("label");

        labelStatus.textContent = "Status do pedido";

        const seletorStatus = criarSeletor(
            statusDisponiveis,
            pedido.status
        );


        seletorStatus.addEventListener("change", function() {

            pedido.status = seletorStatus.value;

            salvarDados();

        });


        ficha.appendChild(labelStatus);

        ficha.appendChild(seletorStatus);


        // =================================
        // SITUAÇÃO DO PAGAMENTO
        // =================================

        const areaPagamento = document.createElement("div");

        areaPagamento.className = "area-pagamento";

        const labelPagamento = document.createElement("label");

        labelPagamento.textContent = "Situação do pagamento";

        const seletorPagamento = criarSeletor(
            pagamentosDisponiveis,
            pedido.situacaoPagamento
        );


        // COR DO PAGAMENTO

        function atualizarCorPagamento() {

            labelPagamento.className =
                pedido.situacaoPagamento === "Pago"
                    ? "pagamento-pago"
                    : "pagamento-pendente";

        }

        atualizarCorPagamento();


        seletorPagamento.addEventListener("change", function() {

            pedido.situacaoPagamento = seletorPagamento.value;

            atualizarCorPagamento();

            salvarDados();

        });


        areaPagamento.appendChild(labelPagamento);

        areaPagamento.appendChild(seletorPagamento);

        ficha.appendChild(areaPagamento);


        // =================================
        // EXCLUIR PEDIDO
        // =================================

        const excluir = document.createElement("button");

        excluir.textContent = "Excluir pedido";

        excluir.className = "excluir";


        excluir.addEventListener("click", function() {

            if (confirm("Deseja excluir este pedido?")) {

                pedidos = pedidos.filter(
                    p => p.id !== pedido.id
                );

                salvarDados();

            }

        });


        ficha.appendChild(excluir);

        lista.appendChild(ficha);

    });


    // =================================
    // CONTADORES DE PRODUÇÃO
    // =================================

    document.getElementById("total").textContent =
        pedidos.length;

    document.getElementById("preparo").textContent =
        pedidos.filter(
            p => p.status === "Em preparo"
        ).length;

    document.getElementById("finalizados").textContent =
        pedidos.filter(
            p => p.status === "Finalizado"
        ).length;

    document.getElementById("entregues").textContent =
        pedidos.filter(
            p => p.status === "Entregue"
        ).length;


    // =================================
    // CONTADORES DE PAGAMENTO
    // =================================

    document.getElementById("pagos").textContent =
        pedidos.filter(
            p => p.situacaoPagamento === "Pago"
        ).length;

    document.getElementById("naoPagos").textContent =
        pedidos.filter(
            p => p.situacaoPagamento === "Não pago"
        ).length;

}


// =====================================
// INICIAR SITE
// =====================================

atualizarMural();