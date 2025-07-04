const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 5;
numeroSenha.textContent = tamanhoSenha;

const botoes = document.querySelectorAll('.parametro-senha__botao');

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');

for (let i = 0; i < checkbox.length; i++) { // Adicionado 'let' antes de i
    checkbox[i].onclick = geraSenha;
}

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';

// Função para verificar e substituir caracteres repetidos
function verificaEsubstituiRepetidos(senha) {
    const contagem = {};
    const caracteresUnicos = new Set();
    let novaSenha = '';
    
    // Contagem de caracteres
    for (const char of senha) {
        contagem[char] = (contagem[char] || 0) + 1;
    }
    
    // Gera nova senha substituindo repetidos
    for (const char of senha) {
        if (contagem[char] === 1) {
            novaSenha += char;
        } else {
            // Se for a primeira ocorrência, mantém o caractere
            if (!caracteresUnicos.has(char)) {
                novaSenha += char;
                caracteresUnicos.add(char);
            } else {
                // Substitui por um novo caractere único
                let novoChar;
                do {
                    novoChar = geraCaractereAleatorio();
                } while (caracteresUnicos.has(novoChar) || senha.includes(novoChar));
                
                novaSenha += novoChar;
                caracteresUnicos.add(novoChar);
            }
        }
    }
    
    return novaSenha;
}

// Função auxiliar para gerar caractere aleatório
function geraCaractereAleatorio() {
    const caracteresDisponiveis = [];
    
    if (checkbox[0].checked) caracteresDisponiveis.push(...letrasMaiusculas);
    if (checkbox[1].checked) caracteresDisponiveis.push(...letrasMinusculas);
    if (checkbox[2].checked) caracteresDisponiveis.push(...numeros);
    if (checkbox[3].checked) caracteresDisponiveis.push(...simbolos);
    // Removida a referência à variável não definida 'repetir'
    
    // Se nenhum checkbox estiver marcado, usa todos os caracteres
    if (caracteresDisponiveis.length === 0) {
        caracteresDisponiveis.push(
            ...letrasMaiusculas,
            ...letrasMinusculas,
            ...numeros,
            ...simbolos
        );
    }
    
    const randomIndex = Math.floor(Math.random() * caracteresDisponiveis.length);
    return caracteresDisponiveis[randomIndex];
}

// Função para contar caracteres repetidos
function contaCaracteres(senha) {
    const contagem = {};
    for (const char of senha) {
        contagem[char] = (contagem[char] || 0) + 1;
    }
    return contagem;
}

function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) {
        alfabeto = alfabeto + letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto = alfabeto + letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto = alfabeto + numeros;
    }
    if (checkbox[3].checked) {
        alfabeto = alfabeto + simbolos;
    }
    // Removida a linha com a variável não declarada 'contagem'
    
    // Se nenhum checkbox estiver marcado, usa todos os caracteres
    if (alfabeto === '') {
        alfabeto = letrasMaiusculas + letrasMinusculas + numeros + simbolos;
    }
    
    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[numeroAleatorio];
    }
    
    // Verifica e substitui caracteres repetidos (corrigido o nome da função)
    const senhaSemRepetidos = verificaEsubstituiRepetidos(senha);
    
    // Exibe a contagem de caracteres no console (para debug)
    console.log('Contagem de caracteres:', contaCaracteres(senhaSemRepetidos));
    
    campoSenha.value = senhaSemRepetidos;
    
    // Adicionado cálculo da força da senha
    calcularForcaSenha(tamanhoSenha, alfabeto.length);
}

function calcularForcaSenha(tamanhoSenha, tamanhoAlfabeto) {
    if (!tamanhoSenha || !tamanhoAlfabeto) {
        console.error("Tamanho da senha ou do alfabeto inválido!");
        return;
    }

    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    console.log(entropia);

    const forcaSenha = document.querySelector('.forca');
    if (!forcaSenha) {
        console.error("Elemento .forca não encontrado!");
        return;
    }

    forcaSenha.classList.remove('fraca', 'media-fraca', 'media', 'media-forte', 'forte');
    
    if (entropia > 80) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 60) {
        forcaSenha.classList.add('media-forte');
    } else if (entropia > 40) {
        forcaSenha.classList.add('media');
    } else if (entropia > 20) {
        forcaSenha.classList.add('media-fraca');
    } else {
        forcaSenha.classList.add('fraca');
    }

    const valorEntropia = document.querySelector('.entropia');
    if (valorEntropia) {
        const diasParaQuebrar = Math.floor((2 ** entropia) / (100e6 * 60 * 60 * 24));
        valorEntropia.textContent = `Um computador pode demorar ${diasParaQuebrar} dias para encontrar sua senha.`;
    }
}

// Inicializa a senha
geraSenha();