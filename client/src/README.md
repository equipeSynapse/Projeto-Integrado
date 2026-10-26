======================================================
DOCUMENTAÇÃO DA PASTA PRINCIPAL: src/
======================================================

A pasta `src/` (source) é o coração do projeto. Ela contém todo o código-fonte da interface (front-end) da aplicação React. Abaixo está o resumo da estrutura, dividido por pastas e arquivos principais.

------------------------------------------------------
1. ARQUIVOS DE CONFIGURAÇÃO RAIZ
------------------------------------------------------

/**
 * main.jsx:
 * Ponto de entrada (entry point) da aplicação React. 
 * É ele quem inicializa o projeto, injeta o componente principal (App) no HTML 
 * (dentro da div com id 'root') e aplica o StrictMode para checagens de desenvolvimento.
 */

/**
 * App.jsx:
 * Componente raiz de roteamento.
 * Utiliza o react-router-dom para mapear as URLs do navegador (como "/", "/cadastro" e "/login") 
 * e decidir qual página (Page) deve ser exibida na tela.
 */

/**
 * index.css:
 * Folha de estilos global. 
 * Importa o Tailwind CSS para o projeto, define variáveis customizadas de tema 
 * (como a fonte Poppins) e aplica os resets básicos (ex: tirar margem do body).
 */

/**
 * App.css:
 * Arquivo reservado para estilos específicos do componente App.jsx (atualmente vazio).
 */


------------------------------------------------------
2. DIRETÓRIOS E SUAS FUNÇÕES
------------------------------------------------------

/** 
 * Pasta assets/: 
 * Armazena os arquivos estáticos consumidos pela aplicação, como imagens, 
 * fontes e os ícones SVG utilizados nos botões e inputs.
 */

/** 
 * Pasta components/: 
 * Armazena os componentes visuais reutilizáveis da aplicação. 
 * O objetivo é manter a interface padronizada e facilitar a manutenção do Mural Colaborativo.
 */
   - cadastroForm.jsx: Formulário de criação de conta dividido em duas etapas, com validação de e-mail e checagem de requisitos de senha em tempo real.
   - InputField.jsx: Campo de entrada genérico. Padroniza inputs de texto e senha, gerencia o botão de mostrar/ocultar senha e exibe erros.
   - LoginForm.jsx: Interface de autenticação que valida as credenciais do usuário, faz a requisição de login e salva o token de acesso.

/** 
 * Pasta pages/: 
 * Contém as visões principais (telas inteiras) da aplicação. 
 * Atuam como contêineres de layout para organizar os componentes e são diretamente associadas às rotas do App.jsx.
 */
   - cadastro/page.jsx: Página principal de registro. Centraliza o CadastroForm na tela.
   - login/login.jsx: Página principal de autenticação. Centraliza o LoginForm na tela.

/** 
 * Pasta services/: 
 * Ponte de comunicação entre a interface gráfica (front-end) e o servidor (back-end). 
 * Centraliza as requisições de rede para evitar código espalhado pelos componentes.
 */
   - api.js: Cria e exporta a configuração central do Axios (URL base do servidor e cabeçalhos padrão).
   - cadastro.js: Envia os dados de registro via POST para a rota "/api/auth/cadastrar" e repassa possíveis erros.
   - login.js: Envia credenciais via POST para "/api/auth/login" e retorna o token de autenticação ou mensagens de erro.

======================================================