## Visão geral do que foi implementado

Este projeto foi ajustado para funcionar como um **mini ERP web** totalmente em **frontend**, usando **Next.js** e **localStorage** como "banco de dados" local.  
O objetivo é demonstrar, em apresentação de faculdade, fluxos básicos de um sistema com **login fake, dashboard, cadastros, pedidos, estoque e entregas**, passando sensação de sistema real sem backend.

---

## Camada de persistência local

Arquivo principal: `lib/local-db.ts`

- **Tecnologia usada**: `localStorage` do navegador.
- **Chave de armazenamento**: `SMARTSTOCK_DB`.
- **Estrutura principal (`SmartstockDb`)**:
  - `clients`: clientes cadastrados.
  - `products`: produtos com estoque atual e preço.
  - `orders`: pedidos de venda com itens e totais.
  - `deliveries`: entregas associadas aos pedidos.
  - `stockMovements`: movimentações de estoque (entrada/saída).
  - `lastOrderNumber`: controle simples de numeração sequencial (G1, G2, ...).
  - `session`: sessão de login fake (`isLoggedIn`, `userName`).

### Principais funções expostas

- **Sessão / login**
  - `getSession()`: lê a sessão salva.
  - `setSession(session)`: grava/limpa a sessão.

- **Clientes**
  - `listClients()`: retorna todos os clientes.
  - `addClient(input)`: cria um novo cliente e persiste.

- **Produtos**
  - `listProducts()`: retorna todos os produtos.
  - `addProduct(input)`: cria um novo produto com estoque inicial.
  - `findProductById(id)`: busca produto específico.

- **Estoque**
  - `listStockMovements()`: lista de movimentações.
  - `addStockMovement(input)`: registra entrada/saída, atualiza estoque do produto e grava o movimento.

- **Pedidos**
  - `listOrders()`: lista de pedidos.
  - `createOrder(input)`: cria pedido com itens, gera:
    - **saída de estoque** (movimentações tipo `Saida`) para cada item.
    - **entrega pendente** associada ao pedido.
  - `updateOrderStatus(orderId, status)`: altera status do pedido.

- **Entregas**
  - `listDeliveries()`: lista de entregas.
  - `updateDeliveryStatus(deliveryId, status)`: altera status da entrega.

> Ao carregar o app pela primeira vez, o módulo inicializa o `localStorage` com **dados de exemplo** (clientes e produtos) para facilitar a demonstração.

---

## Telas e fluxos funcionais

### 1. Login fake

- Arquivo: `components/erp-layout.tsx`
- O `ErpLayout` verifica a sessão via `getSession()`.  
  - Se não houver sessão ou `isLoggedIn` for falso, exibe a **tela de login**.
  - Ao logar, chama `setSession({ isLoggedIn: true, userName: "Admin Smartstock" })` e recarrega a página.
- A tela de login aceita **qualquer combinação de e-mail e senha** (é apenas para demonstração visual).
- Após login, todas as páginas que usam `ErpLayout` ficam **"protegidas"**.

### 2. Dashboard

- Arquivo: `components/dashboard-content.tsx`
- Agora alguns cards são calculados a partir da base local:
  - **Pedidos cadastrados** (`listOrders()`).
  - **Pedidos pendentes/orçamentos** (status `Pendente` ou `Orcamento`).
  - **Produtos em estoque** (soma do campo `stock` em `products`).
  - **Faturamento** (soma dos totais de pedidos com status `Faturado` ou `Entregue`).
- Mantém o visual original, mas com números dinâmicos.

### 3. Cadastro e listagem de clientes

- Arquivo: `components/clients-content.tsx`
- Antes: lista fixa em array hard-coded.
- Agora:
  - Lê clientes via `listClients()` (dados do `localStorage`).
  - Possui um card de **"Novo cliente rápido"** com campos:
    - Nome/Razão social, CPF/CNPJ, telefone, e-mail, cidade.
  - Ao salvar, chama `addClient()`:
    - Atualiza a lista em tela.
    - Persiste no `localStorage`.
  - Filtro por nome ou CPF/CNPJ continua funcionando.

### 4. Cadastro e listagem de produtos

- Arquivo: `components/products-content.tsx`
- Antes: lista fixa de produtos em memória.
- Agora:
  - Lê produtos via `listProducts()`.
  - Possui **formulário rápido** para cadastrar produtos:
    - Nome, código, referência interna, estoque inicial, unidade, preço de venda.
  - Ao salvar, chama `addProduct()`:
    - Atualiza tabela e estoque.
    - Persiste no `localStorage`.
  - A tabela mostra:
    - Estoque atual (`stock` + unidade).
    - Preço formatado em `R$`.
  - Rodapé mostra:
    - **Total de produtos** cadastrados.
    - **Estoque total** (somatório das quantidades).

### 5. Controle básico de estoque (entrada/saída)

- Arquivo: `components/stock-movements-content.tsx`
- Antes: movimentações estáticas.
- Agora:
  - Lê produtos com `listProducts()` e movimentações com `listStockMovements()`.
  - Cards superiores:
    - Total de produtos.
    - Itens em estoque (soma do `stock`).
    - Quantidade de registros de entrada.
    - Quantidade de registros de saída.
  - Formulário de **"Nova movimentação manual"**:
    - Seleção de produto existente.
    - Tipo (`Entrada` ou `Saida`).
    - Quantidade.
    - Origem (texto livre).
  - Ao salvar:
    - Chama `addStockMovement()`.
    - Atualiza estoque do produto.
    - Grava a movimentação na lista.
  - Tabela mostra:
    - Produto, tipo, quantidade (+/-), origem e estoque após o movimento.

### 6. Criação e listagem de pedidos

#### Lista de pedidos

- Arquivo: `components/sales-list-content.tsx`
- Antes: lista mockada.
- Agora:
  - Lê pedidos via `listOrders()` e junta com clientes (`listClients()`).
  - Exibe:
    - Número, data, cliente, valor total (R$), status.
  - Mostra resumo no cabeçalho:
    - Quantidade de pedidos.
    - Soma total em R$.
  - Permite alterar status diretamente via menu:
    - `Orcamento`, `Pendente`, `Faturado`, `Entregue`, `Cancelado`.
  - Usa `updateOrderStatus()` para persistir o novo status.

#### Criação de pedido / orçamento

- Arquivo: `components/sales-order-content.tsx`
- Antes: formulário apenas visual, sem gravação real.
- Agora:
  - Carrega clientes (`listClients()`) no campo **Cliente**.
  - Carrega produtos (`listProducts()`) para fazer busca simplificada:
    - Quando o usuário começa a digitar o campo de produto, o sistema tenta casar código, referência ou início do nome com um produto real.
    - Preenche automaticamente `productId`, nome e `unitPrice`.
  - Para cada linha de produto:
    - Quantidade, valor unitário, desconto unitário e subtotal são recalculados.
  - Totais:
    - Quantidade total de itens.
    - Total de descontos.
    - Total geral do pedido.
  - Botão **"Salvar pedido / orçamento"**:
    - Monta os itens em `NewOrderItemInput`.
    - Chama `createOrder()`:
      - Cria o pedido com status inicial `Orcamento`.
      - Gera movimentações de **saída de estoque** para cada item.
      - Cria automaticamente uma **entrega pendente** vinculada.
    - Limpa o formulário e mostra um aviso com:
      - Número do pedido gerado (ex: `#G1`).
      - Valor total formatado.
      - Aviso de que estoque e entrega foram atualizados.

### 7. Módulo simples de entregas / rota

- Arquivos:
  - `components/deliveries-content.tsx`
  - `app/entregas/page.tsx`
- Comportamento:
  - Lê entregas via `listDeliveries()`, pedidos com `listOrders()` e clientes com `listClients()`.
  - Cards superiores:
    - Entregas pendentes.
    - Entregas em rota.
    - Entregas concluídas.
  - Tabela principal mostra:
    - Pedido, cliente, cidade/rota, data programada, valor do pedido, status.
  - Coluna de ações:
    - Botões para mudar status para:
      - `Pendente`
      - `Em rota`
      - `Entregue`
      - `Cancelada`
    - Cada ação chama `updateDeliveryStatus()` e persiste no `localStorage`.

---

## Resumo dos fluxos funcionais

- **Login fake**:
  - Tela de login dentro do `ErpLayout`.
  - Salva sessão em `localStorage`.
  - Protege o restante da aplicação.

- **Dashboard**:
  - Mostra indicadores baseados em dados reais salvos localmente.

- **Clientes**:
  - Listagem, busca e cadastro rápido com persistência.

- **Produtos**:
  - Listagem, busca, cadastro rápido, estoque e preço com persistência.

- **Estoque**:
  - Movimentações manuais de entrada/saída.
  - Atualização automática do estoque dos produtos.

- **Pedidos**:
  - Criação de pedidos/orçamentos a partir de clientes e produtos reais.
  - Listagem com totais e alteração de status.

- **Entregas / rota**:
  - Entregas geradas automaticamente ao criar pedido.
  - Tela de controle simples de rota/status de entrega.

Tudo isso funciona **apenas no navegador**, sem backend, garantindo que:

- Os dados **permanecem** após atualizar a página (enquanto o `localStorage` não é limpo).
- A experiência é de um **ERP funcional** para fins de demonstração acadêmica.

