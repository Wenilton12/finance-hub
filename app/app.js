// 1. SELEÇÃO DE ELEMENTOS
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('total-balance');
const incomeDisplay = document.getElementById('total-income');
const expenseDisplay = document.getElementById('total-expense');

let financeChart;
let editingId = null; // Se for null, estamos adicionando. Se tiver um ID, estamos editando.

// 2. TEMA (DARK MODE)
const getStorage = () => {
    try {
        const testKey = '__theme_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return localStorage;
    } catch (error) {
        return null;
    }
};

const safeStorage = getStorage();

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    if (themeLabel) {
        themeLabel.textContent = isDark ? 'Modo claro' : 'Modo escuro';
    }
};

const getPreferredTheme = () => {
    const stored = safeStorage ? safeStorage.getItem('theme') : null;
    if (stored === 'dark' || stored === 'light') return stored;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

let currentTheme = getPreferredTheme();
applyTheme(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        if (safeStorage) {
            safeStorage.setItem('theme', currentTheme);
        }
    });
}

// 3. ESTADO DA APLICAÇÃO
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 4. FUNÇÕES DE UTILIDADE
const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const generateID = () => Math.round(Math.random() * 1000);

// 5. FUNÇÃO DO GRÁFICO (Definida antes de ser usada no init)
const updateChart = (income, expense) => {
    const canvas = document.getElementById('finance-chart');
    if (!canvas) return; // Segurança caso o canvas não exista no HTML

    const ctx = canvas.getContext('2d');

    // Se o gráfico já existe, nós o destruímos para criar um novo
    if (financeChart) {
        financeChart.destroy();
    }

    financeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                label: 'R$',
                data: [income, expense],
                backgroundColor: ['#10b981', '#f43f5e'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
};

// 6. LÓGICA DE ATUALIZAÇÃO DO PAINEL
const updateBalanceValues = () => {
    const amounts = transactions.map(transaction =>
        transaction.type === 'income' ? transaction.amount : -transaction.amount
    );

    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = transactions
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);
    const expense = transactions
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    balanceDisplay.textContent = formatCurrency(total);
    incomeDisplay.textContent = formatCurrency(income);
    expenseDisplay.textContent = formatCurrency(expense);

    // Retornamos os valores para serem usados no gráfico
    return { income, expense };
};

// 7. RENDERIZAÇÃO NA TELA
const addTransactionIntoDOM = (transaction) => {
    const row = document.createElement('tr');
    row.classList.add('hover:bg-gray-50', 'dark:hover:bg-slate-800', 'transition-colors');

    const amountColor = transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600';
    const amountPrefix = transaction.type === 'income' ? '+' : '-';

    row.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-700 dark:text-slate-100">${transaction.description}</td>
        <td class="px-6 py-4 text-sm font-semibold ${amountColor}">
            ${amountPrefix} ${formatCurrency(transaction.amount)}
        </td>
        <td class="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">${transaction.date}</td>
        <td class="px-6 py-4 text-center">
            <button onclick="prepareEdit(${transaction.id})" class="text-indigo-500 hover:text-indigo-700 font-medium md:mr-4">
                Editar
            </button>
            <button onclick="removeTransaction(${transaction.id})" class="text-rose-500 hover:text-rose-700 font-medium dark:hover:text-rose-400">
                Excluir
            </button>
        </td>
    `;
    transactionList.appendChild(row);
};

// Função principal que orquestra tudo
const init = () => {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);

    // Atualiza os valores e pega o retorno para o gráfico
    const { income, expense } = updateBalanceValues();

    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Agora sim o gráfico aparece!
    updateChart(income, expense);
};

// 8. EVENTOS
transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const desc = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    if (desc.trim() === '' || amount.trim() === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

     if (editingId !== null) {
        // MODO EDIÇÃO: Atualizamos o item existente no array
        const index = transactions.findIndex(t => t.id === editingId);
        
        transactions[index] = {
            ...transactions[index], // Mantém o ID e a Data originais
            description: desc,
            amount: parseFloat(amount),
            type: type
        };

        // Reseta o estado de edição
        editingId = null;
        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Adicionar';
        submitBtn.classList.replace('bg-amber-500', 'bg-indigo-600');

    } else {
        // MODO ADIÇÃO: Cria um novo
        const transaction = {
            id: generateID(),
            description: desc,
            amount: parseFloat(amount),
            type: type,
            date: new Date().toLocaleDateString('pt-BR')
        };
        transactions.push(transaction);
    }

    init(); // Atualiza tudo (tabela, cards, gráfico e localStorage)
    transactionForm.reset();
});

const prepareEdit = (id) => {
    // 1. Encontramos a transação no array pelo ID
    const transaction = transactions.find(t => t.id === id);
    
    // 2. Preenchemos o formulário
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;

    // 3. Mudamos o ID de edição e o texto do botão
    editingId = id;
    const submitBtn = transactionForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Salvar Alterações';
    submitBtn.classList.replace('bg-indigo-600', 'bg-amber-500'); // Cor de alerta/edição
    
    // 4. Jogamos o foco no primeiro campo para o usuário
    document.getElementById('description').focus();
};

const removeTransaction = (id) => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
};

// Inicialização
init();