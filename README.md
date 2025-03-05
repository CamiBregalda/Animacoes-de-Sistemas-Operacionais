# Animações de Processos de Sistemas Operacionais

Este repositório contém animações criadas com **HTML, CSS e JavaScript** para demonstrar o funcionamento de **algoritmos clássicos de sistemas operacionais**. Os algoritmos implementados incluem **algoritmos de busca no disco** e **algoritmos de substituição de página**.

## 📌 Estrutura do Repositório

Cada algoritmo possui sua própria pasta contendo os arquivos necessários (`index.html`, `style.css`, `script.js`) para visualizar a animação correspondente.

### 🖥️ Algoritmos Implementados:

#### 🔍 Algoritmos de Busca no Disco
Os algoritmos de busca no disco são usados para gerenciar o acesso ao disco rígido e otimizar o tempo de busca dos blocos de dados.

- **FCFS (First-Come, First-Served)** - Atende as requisições na ordem em que chegam, sem priorização.
- **SSTF (Shortest Seek Time First)** - Atende primeiro a requisição mais próxima da posição atual do cabeçote.
- **SCAN (Elevador)** - O cabeçote do disco se move continuamente em uma direção atendendo as requisições até atingir o final, depois inverte a direção.

<hr>

#### 📄 Algoritmos de Substituição de Página
Os algoritmos de substituição de página são usados pelo sistema operacional para gerenciar a memória virtual, decidindo qual página remover quando ocorre uma Page Fault.

- **FIFO (First-In, First-Out)** - A página mais antiga na memória é substituída primeiro.
- **LRU (Least Recently Used)** - A página que não foi usada por mais tempo é removida.

## 🚀 Como Executar as Animações
1. Clone este repositório:
   ```
   git clone https://github.com/CamiBregalda/Animacoes-de-Sistemas-Operacionais.git
   ```
2. Acesse a pasta do repositório:
   ```
   cd animacoes-de-sistemas-operacionais
   ```
3. Escolha o algoritmo desejado e abra o arquivo `index.html` no navegador.

## 🛠 Tecnologias Utilizadas
- **HTML**: Estrutura das páginas.
- **CSS**: Estilização e animações.
- **JavaScript**: Implementação das lógicas dos algoritmos e controle das animações.

## Autor
- **Camila Bregalda** - Desenvolvedora do projeto.
