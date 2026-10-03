# MP Boutique — estrutura do front-end

O projeto foi separado por responsabilidade para facilitar manutenção no Cursor e no GitHub.

## Estrutura

- `index.html` — somente estrutura e conteúdo principal da página.
- `css/styles.css` — estilos visuais e responsividade.
- `js/products.js` — dados do catálogo de produtos.
- `js/app.js` — filtros, modal, carrinho, sessionStorage e integração com WhatsApp.
- `assets/` — imagens usadas pelo site.

## Fluxo do catálogo

Os produtos são cadastrados em `js/products.js`. O arquivo `js/app.js` lê esses dados, monta os cards, abre os detalhes do produto e controla o carrinho.

## Carrinho e WhatsApp

O carrinho é salvo temporariamente em `sessionStorage`. Ao finalizar, o JavaScript monta uma mensagem com os produtos e quantidades e abre o atendimento da MP Boutique no WhatsApp.

## Manutenção

Para adicionar ou alterar produtos, edite `js/products.js`. Para mudar aparência, edite `css/styles.css`. Alterações estruturais da página ficam em `index.html`.
