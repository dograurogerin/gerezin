// ELEMENTOS DO SITE

const form = document.getElementById("pedidoForm");
const lista = document.getElementById("listaPedidos");
const campoBusca = document.getElementById("busca");


// STATUS DISPONÍVEIS

const statusDisponiveis = [
    "Pedido feito",
    "Em preparo",
    "Finalizado",
    "Entregue"
];


// CARREGAR PEDIDOS SALVOS

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


// GARANTIR STATUS DOS PEDIDOS ANTIGOS

pedidos = pedidos.map(pedido => ({
    ...pedido,
    status: statusDisponiveis.includes(pedido.status)
        ? pedido.status
        : "Pedido feito"
}));


// NAVEGAÇÃO ENTRE AS ABAS

document.querySelectorAll("nav button").forEach(botao => {

    botao.addEventListener("click", () => {

        document.querySelectorAll("nav button")
            .forEach(b => b.classList.remove("active"));

        document.querySelectorAll(".pagina")
            .forEach(p => p.classList.remove("active"));

        botao.classList.add("active");

        const pagina = document.getElementById(
            botao.dataset.page
        );

        pagina.classList.add("active");

        atualizarMural();

    });

});


// CADASTRAR PEDIDO

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

        observacoes: document.getElementById("observacoes")
            .value.trim(),

        status: "Pedido feito"

    };


    // ADICIONAR PEDIDO À LISTA

    pedidos.push(pedido);

    salvarDados();

    // LIMPAR FORMULÁRIO

    form.reset();

    alert("Pedido cadastrado com sucesso!");

    // ABRIR MURAL

    document.querySelector(
        '[data-page="mural"]'
    ).click();

});


// PESQUISAR EM TEMPO REAL

campoBusca.addEventListener("input", function() {

    atualizarMural();

});


// SALVAR PEDIDOS NO NAVEGADOR

function salvarDados() {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    atualizarMural();

}


// NORMALIZAR TEXTO PARA PESQUISA

function normalizarTexto(texto) {

    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// ATUALIZAR MURAL

function atualizarMural() {

    lista.innerHTML = "";


    // TEXTO DIGITADO NA BUSCA

    const pesquisa = normalizarTexto(
        campoBusca.value.trim()
    );


    // FILTRAR PEDIDOS PELO NOME OU TELEFONE

    const pedidosFiltrados = pedidos.filter(pedido => {

        const nome = normalizarTexto(pedido.nome);

        const telefone = normalizarTexto(pedido.telefone);

        return nome.includes(pesquisa) ||
               telefone.includes(pesquisa);

    });


    // VERIFICAR SE EXISTEM PEDIDOS

    if (pedidosFiltrados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.className = "vazio";

        mensagem.textContent = pesquisa
            ? "Nenhum pedido encontrado."
            : "Nenhum pedido cadastrado.";

        lista.appendChild(mensagem);

    }


    // CRIAR UMA FICHA PARA CADA PEDIDO

    pedidosFiltrados.forEach(pedido => {

        const ficha = document.createElement("div");


        // IDENTIFICAR A COR DO STATUS

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

        const campos = [

            "Telefone: " + pedido.telefone,

            "Quantidade: " + pedido.quantidade,

            "Tipo: " + pedido.tipo,

            "Observações: " +
                (pedido.observacoes || "Nenhuma")

        ];


        campos.forEach(texto => {

            const paragrafo = document.createElement("p");

            paragrafo.textContent = texto;

            ficha.appendChild(paragrafo);

        });


        // TEXTO DO STATUS

        const label = document.createElement("label");

        label.textContent = "Status do pedido";


        // SELETOR DE STATUS

        const seletor = document.createElement("select");


        statusDisponiveis.forEach(status => {

            const opcao = document.createElement("option");

            opcao.value = status;

            opcao.textContent = status;

            if (pedido.status === status) {

                opcao.selected = true;

            }

            seletor.appendChild(opcao);

        });


        // ALTERAR STATUS

        seletor.addEventListener("change", function() {

            pedido.status = seletor.value;

            salvarDados();

        });


        // BOTÃO DE EXCLUSÃO

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


        // MONTAR FICHA

        ficha.appendChild(label);

        ficha.appendChild(seletor);

        ficha.appendChild(excluir);

        lista.appendChild(ficha);

    });


    // ATUALIZAR CONTADORES

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

}


// INICIAR O SITE

atualizarMural();