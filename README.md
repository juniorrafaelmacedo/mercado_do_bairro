# Mercado do Bairro - Sistema ERP

![Mercado do Bairro ERP](https://via.placeholder.com/800x200?text=Mercado+do+Bairro+ERP)

Sistema de Gestão Empresarial (ERP) desenvolvido sob medida para o varejo de hortifruti e alimentos. O sistema oferece controle total sobre compras, financeiro, logística e gestão de usuários, operando como uma Single Page Application (SPA) moderna e responsiva.

## 🚀 Funcionalidades

### 📊 Dashboard Gerencial
- **Análise Temporal**: Acompanhamento do fluxo de caixa diário.
- **KPIs em Tempo Real**: Totais pagos, pendentes e vencidos.
- **Top Fornecedores**: Ranking de gastos.
- **Filtros Customizáveis**: Seleção de período para análise precisa.

### 🛒 Gestão de Compras
- **Controle de Notas Fiscais**: Lançamento, conferência e estorno.
- **Integração Financeira**: NFs confirmadas geram títulos a pagar automaticamente.
- **Cadastro Completo**: Fornecedores (com validação de CPF/CNPJ) e Produtos.
- **Exportação**: Relatórios em formato CSV (Excel).

### 💰 Controle Financeiro
- **Contas a Pagar**: Gestão de vencimentos e status.
- **Pagamentos**: Baixa de títulos e histórico.
- **Estorno Inteligente**: Devolução de títulos para o setor de compras com um clique.
- **Navegação Integrada**: Edição rápida de NFs a partir do título financeiro.

### 🚚 Logística e Viagens
- **Controle de Fretes**: Registro de viagens, motoristas e placas.
- **Custo e Peso**: Cálculo de custos de transporte e volume de carga.
- **Vínculo de NFs**: Associação de cargas a viagens específicas.

### ⚙️ Administração
- **Controle de Acesso (RBAC)**: Perfis para Admin, Financeiro, Compras e Logística.
- **Gestão de Usuários**: Cadastro e edição de permissões.
- **Persistência de Dados**: Uso de `LocalStorage` para manter os dados salvos no navegador.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Build/Bundler**: Vite (compatível)

## 📦 Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/juniorrafaelmacedo/mercado_do_bairro.git
   cd mercado_do_bairro
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🔐 Acesso (Dados de Exemplo)

O sistema já vem com dados pré-carregados para teste. Utilize as credenciais abaixo na tela de login:

| Usuário | Senha | Perfil |
|---------|-------|--------|
| `admin` | `123` | Acesso Total (Mestre) |
| `ana`   | `123` | Financeiro & Compras |
| `carlos`| `123` | Compras |
| `roberto`| `123`| Logística |

---

Desenvolvido por **Junior Rafael Macedo**.
