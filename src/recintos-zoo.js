class Bioma {
    static SAVANA = "savana";
    static FLORESTA = "floresta";
    static RIO = "rio";
}

class Animal {
    static LEAO = {
        tamanho: 3,
        biomas: [Bioma.SAVANA],
        carnivoro: true
    };
    static LEOPARDO = {
        tamanho: 2,
        biomas: [Bioma.SAVANA],
        carnivoro: true
    };
    static CROCODILO = {
        tamanho: 3,
        biomas: [Bioma.RIO],
        carnivoro: true
    };
    static MACACO = {
        tamanho: 1,
        biomas: [Bioma.SAVANA, Bioma.FLORESTA],
        carnivoro: false
    };
    static GAZELA = {
        tamanho: 2,
        biomas: [Bioma.SAVANA],
        carnivoro: false
    };
    static HIPOPOTAMO = {
        tamanho: 4,
        biomas: [Bioma.SAVANA, Bioma.RIO],
        carnivoro: false
    };
}

class Recinto {
    constructor(numero, biomas, tamanho, animais) {
        this.numero = numero;
        this.biomas = biomas;
        this.tamanho = tamanho;
        this.animais = animais;
    }
}

class Erro {
    static ANIMAL_INVALIDO = { 'erro': "Animal inválido" };
    static QUANTIDADE_INVALIDA = { 'erro': "Quantidade inválida" };
    static NAO_HA_RECINTO_VIAVEL = { 'erro': "Não há recinto viável" };
}

class RecintosZoo {
    constructor() {
        this.recintos = [
            new Recinto(1, [Bioma.SAVANA], 10, [{ animal: Animal.MACACO, quantidade: 3 }]),
            new Recinto(2, [Bioma.FLORESTA], 5, []),
            new Recinto(3, [Bioma.SAVANA, Bioma.RIO], 7, [{ animal: Animal.GAZELA, quantidade: 1 }]),
            new Recinto(4, [Bioma.RIO], 8, []),
            new Recinto(5, [Bioma.SAVANA], 9, [{ animal: Animal.LEAO, quantidade: 1 }])
        ];
    }

    verificarRecintoContemBiomas(recinto, biomasAnimal) {
        for (const bioma of biomasAnimal) {
            if (recinto.biomas.includes(bioma)) return true;
        }
        return false;
    }

    verificarRecintoTemEspaco(novoAnimal, quantidadeNovoAnimal, recinto) {
        return this.calcularEspacoLivre(novoAnimal, quantidadeNovoAnimal, recinto) >= 0;
    }

    verificarRestricoesCarnivoras(novoAnimal, recinto) {
        if (novoAnimal.carnivoro) {
            if (recinto.animais.length > 1) return false;

            if (recinto.animais.length == 1) {
                return recinto.animais[0].animal == novoAnimal;
            }

            return true;
        }

        return recinto.animais.every(elemento => !elemento.animal.carnivoro);
    }

    verificarHipopotamoCoexistencia(recinto) {
        if (recinto.animais.length == 0) return true;
        if (recinto.animais.length == 1 && recinto.animais[0].animal == Animal.HIPOPOTAMO) return true;
        return recinto.biomas.includes(Bioma.RIO) && recinto.biomas.includes(Bioma.SAVANA);
    }

    verificarMacacoAcompanhado(recinto, quantidadeMacacos) {
        if (recinto.animais.length > 0) return true;
        return quantidadeMacacos > 1;
    }

    calcularEspacoLivre(novoAnimal, quantidadeNovoAnimal, recinto) {
        var espacoLivre = recinto.tamanho;

        if (recinto.animais.length > 0) {

            for (const elemento of recinto.animais) {
                espacoLivre -= elemento.quantidade * elemento.animal.tamanho;
            }

            for (const elemento of recinto.animais) {
                if (novoAnimal != elemento.animal) {
                    espacoLivre -= 1;
                    break;
                }
            }            
        }

        return espacoLivre - quantidadeNovoAnimal * novoAnimal.tamanho;
    }

    analisaRecintos(animal, quantidade) {
        if (!Animal.hasOwnProperty(animal)) return Erro.ANIMAL_INVALIDO;
        if (quantidade <= 0) return Erro.QUANTIDADE_INVALIDA;

        let novoAnimal = Animal[animal];

        let recintos = [];

        for (const recinto of this.recintos) {            
            if (!this.verificarRecintoContemBiomas(recinto, novoAnimal.biomas)) continue;
            if (!this.verificarRecintoTemEspaco(novoAnimal, quantidade, recinto)) continue;
            if (!this.verificarRestricoesCarnivoras(novoAnimal, recinto)) continue;
            if (novoAnimal == Animal.HIPOPOTAMO && !this.verificarHipopotamoCoexistencia(recinto)) continue;
            if (novoAnimal == Animal.MACACO && !this.verificarMacacoAcompanhado(recinto, quantidade)) continue;

            recintos.push(`Recinto ${recinto.numero} (espaço livre: ${this.calcularEspacoLivre(novoAnimal, quantidade, recinto)} total: ${recinto.tamanho})`);            
        }

        if (recintos.length == 0) return Erro.NAO_HA_RECINTO_VIAVEL;

        return {
            recintosViaveis: recintos
        }
    }
}

export { RecintosZoo as RecintosZoo };
