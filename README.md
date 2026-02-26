# FinanceHub - Dashboard Financeiro Profissional 💰

Dashboard interativo para controle de finanças pessoais, desenvolvido com **Vanilla JavaScript** e **Tailwind CSS**. Uma aplicação robusta que demonstra o uso de estados dinâmicos, filtros de dados e persistência.

![FinanceHub](assets/favicon.svg)

---

## 🎯 Sobre o Projeto

O **FinanceHub** é uma ferramenta completa de gestão financeira. O projeto foi desenvolvido para demonstrar o poder do JavaScript puro em lidar com fluxos de dados complexos, manipulação do DOM em tempo real e integração com bibliotecas externas para uma experiência de usuário (UX) de alto nível.

### 🚀 Diferenciais Técnicos:
- **Lógica Reativa**: A interface se adapta instantaneamente a filtros de busca e data.
- **Data Visualization**: Uso de gráficos dinâmicos para análise rápida de saldo.
- **Arquitetura Limpa**: Funções com responsabilidades únicas e código bem comentado.
- **Persistência Segura**: Sistema de armazenamento local com validação de disponibilidade.

---

## ✨ Funcionalidades Implementadas

✅ **Gestão Completa (CRUD)** - Adicione, edite e remova transações com facilidade.  
✅ **Análise de Saldo Visual** - Gráfico doughnut dinâmico que compara o total de Entradas vs Saídas.  
✅ **Filtros Inteligentes** - Pesquisa por descrição, tipo e um **Filtro Mensal** que sincroniza todo o painel.  
✅ **Modo Escuro (Dark Mode)** - Interface adaptável com detecção automática de preferência do sistema.  
✅ **Exportação de Dados** - Geração de arquivos **CSV** para uso em Excel ou Sheets.  
✅ **Notificações Premium** - Uso de **SweetAlert2** para alertas de erro, sucesso e confirmações críticas.  
✅ **Migração de Dados** - Lógica interna que garante a compatibilidade de dados antigos com novas funcionalidades.  
✅ **Limpeza Total** - Função para resetar o dashboard com aviso de segurança.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estrutura semântica e acessível |
| **Tailwind CSS** | Estilização utility-first com foco em responsividade |
| **Vanilla JS** | Lógica core, manipulação de estado e eventos |
| **Chart.js 4.x** | Visualização de dados estatísticos |
| **SweetAlert2** | Modais e alertas profissionais |
| **LocalStorage** | Persistência de dados no navegador |

---

## 💡 Conceitos JavaScript Reforçados no Código

### 1. **Sincronização de Estado (UI Sync)**
O projeto utiliza uma função centralizadora que garante que a tabela, os cards e o gráfico estejam sempre em harmonia com os filtros aplicados.
```javascript
const updateUI = () => {
    transactionList.innerHTML = '';
    const filtered = getFilteredTransactions();
    filtered.forEach(addTransactionIntoDOM);
    updateBalanceValues(filtered);
    updateChart(filtered);
};
```

### 2. **Cálculos com Array Methods (Reduce)**
Uso avançado de filter e reduce para processar os totais financeiros de forma limpa e performática.
```javascript
const income = data
    .filter(item => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

const expense = data
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);
```

### 3. **Segurança no Armazenamento**
Implementação de um helper para verificar a disponibilidade do localStorage antes do uso.
```javascript
const getStorage = () => {
    try {
        const testKey = '__theme_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return localStorage;
    } catch (error) { return null; }
};
```

```javascript
const storage = getStorage();
if (storage) {
    storage.setItem('transactions', JSON.stringify(data));
}
```

### 4. **Geração de Arquivos via JS**
Uso da API Blob para permitir que o usuário baixe seus dados em formato de planilha.
```javascript
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.setAttribute('href', url);
link.setAttribute('download', 'transactions.csv');
link.click();
```

---

## 📂 Estrutura de Arquivos

```
finance-hub/
├── index.html           # Estrutura principal com Tailwind
├── app/
│   └── app.js           # Toda a inteligência da aplicação
├── css/
│   └── style.css        # Estilos customizados complementares
├── assets/
│   └── favicon.svg      # Identidade visual
└── README.md            # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto

1. Clone este repositório.
2. Certifique-se de ter a extensão Live Server no VS Code ou utilize um servidor local de sua preferência.
3. Abra o arquivo `index.html`.
4. Comece a gerenciar suas finanças!

---

## 🔍 Boas Práticas de Engenharia de Software

- **Mobile-First**: Design pensado primeiro para dispositivos móveis e expandido para desktops.
- **Nomenclatura**: Variáveis e funções em inglês (padrão de mercado) com comentários em português para fins educacionais.
- **Lifecycle Management**: Destruição correta de instâncias de gráficos para evitar vazamento de memória.
- **Data Migration**: Código preparado para atualizar objetos de dados antigos automaticamente.

---

## 👤 Autor

**Wenilton Ferreira** - Desenvolvedor em constante evolução.

www.linkedin.com/in/wenilton-ferreira-baa012207 | https://weniltonweb.com.br/

Desenvolvido com foco em fundamentos sólidos de Front-end e UX.
