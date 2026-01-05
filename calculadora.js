// ===============================
// SELEÇÃO DOS ELEMENTOS
// ===============================
const btnOuvir = document.getElementById("btn-ouvir");
const btnFalar = document.getElementById("btn-falar");
const btnLimpar = document.getElementById("btn-limpar");

const textoCalculo = document.getElementById("texto-calculo");
const textoResposta = document.getElementById("texto-resposta");

// ===============================
// VERIFICA SUPORTE À VOZ
// ===============================
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Seu navegador não suporta reconhecimento de voz. Use Google Chrome.");
}

// ===============================
// CONFIGURA RECONHECIMENTO DE VOZ
// ===============================
const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = false;

// ===============================
// DICIONÁRIO DE NÚMEROS
// ===============================
const numeros = {
    "zero": 0,
    "um": 1,
    "uma": 1,
    "dois": 2,
    "duas": 2,
    "três": 3,
    "tres": 3,
    "quatro": 4,
    "cinco": 5,
    "seis": 6,
    "sete": 7,
    "oito": 8,
    "nove": 9,
    "dez": 10,
    "onze": 11,
    "doze": 12,
    "treze": 13,
    "quatorze": 14,
    "catorze": 14,
    "quinze": 15,
    "dezesseis": 16,
    "dezessete": 17,
    "dezoito": 18,
    "dezenove": 19,
    "vinte": 20
};

// ===============================
// CONVERTE TEXTO EM NÚMERO
// ===============================
function converterNumero(texto) {
    texto = texto.trim();

    if (!isNaN(texto)) {
        return Number(texto);
    }

    return numeros[texto] ?? null;
}

// ===============================
// INTERPRETA A CONTA FALADA
// ===============================
function interpretarConta(frase) {
    frase = frase.toLowerCase();

    let operador = null;
    let separador = "";

    if (frase.includes("mais")) {
        operador = "+";
        separador = "mais";
    } else if (frase.includes("menos")) {
        operador = "-";
        separador = "menos";
    } else if (frase.includes("vezes")) {
        operador = "*";
        separador = "vezes";
    } else if (frase.includes("multiplicado")) {
        operador = "*";
        separador = "multiplicado";
    } else if (frase.includes("dividido")) {
        operador = "/";
        separador = "dividido";
    }

    if (!operador) return null;

    const partes = frase.split(separador);

    if (partes.length !== 2) return null;

    const num1 = converterNumero(partes[0]);
    const num2 = converterNumero(partes[1]);

    if (num1 === null || num2 === null) return null;

    return calcular(num1, operador, num2);
}

// ===============================
// CÁLCULOS
// ===============================
function calcular(a, operador, b) {
    switch (operador) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? "Erro" : (a / b).toFixed(2);
        default:
            return null;
    }
}

// ===============================
// EVENTO: OUVIR
// ===============================
btnOuvir.addEventListener("click", () => {
    btnOuvir.classList.add("ativo");
    textoCalculo.textContent = "Estou ouvindo...";
    recognition.start();
});

// ===============================
// RESULTADO DA FALA
// ===============================
recognition.addEventListener("result", (event) => {
    const fala = event.results[0][0].transcript;

    textoCalculo.textContent = fala;

    const resultado = interpretarConta(fala);

    textoResposta.textContent =
        resultado !== null ? resultado : "Não entendi";
});

// ===============================
// PARA ANIMAÇÃO QUANDO TERMINA
// ===============================
recognition.addEventListener("end", () => {
    btnOuvir.classList.remove("ativo");
});

// ===============================
// EVENTO: FALAR RESPOSTA
// ===============================
btnFalar.addEventListener("click", () => {
    const resposta = textoResposta.textContent;

    if (!resposta || resposta === "0") return;

    const utterance = new SpeechSynthesisUtterance(
        `O resultado é ${resposta}`
    );
    utterance.lang = "pt-BR";

    window.speechSynthesis.speak(utterance);
});

// ===============================
// EVENTO: LIMPAR
// ===============================
btnLimpar.addEventListener("click", () => {
    textoCalculo.textContent = 'Clique em "Ouvir" e fale seu cálculo...';
    textoResposta.textContent = "0";
});
