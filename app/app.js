// SELEÇÃO DE ELEMENTOS
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('total-balance');
const incomeDisplay = document.getElementById('total-income');
const expenseDisplay = document.getElementById('total-expense');

let financeChart;
let editingId = null; // Se for null, estamos adicionando. Se tiver um ID, estamos editando.

// TEMA (DARK MODE)
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
        // Atualiza o gráfico com os dados filtrados atuais
        const filtered = getFilteredTransactions();
        updateChart(filtered);
    });
}

// ESTADO DA APLICAÇÃO
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Garantir que todas as transações tenham o campo dateMonth
transactions = transactions.map(t => {
    if (!t.dateMonth && t.date) {
        // Converter "DD/MM/YYYY" para "YYYY-MM"
        const [day, month, year] = t.date.split('/');
        t.dateMonth = `${year}-${month}`;
    }
    return t;
});

// FUNÇÕES DE UTILIDADE
const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const generateID = () => Math.round(Math.random() * 1000);

// FUNÇÃO DO GRÁFICO (Definida antes de ser usada no init)
const updateChart = (data) => {
    const canvas = document.getElementById('finance-chart');
    if (!canvas) return; // Segurança caso o canvas não exista no HTML

    const ctx = canvas.getContext('2d');

    // Calcular totais de entrada e saída
    const totalIncome = data
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpense = data
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    // Se o gráfico já existe, nós o destruímos para criar um novo
    if (financeChart) {
        financeChart.destroy();
    }

    // Se não há dados, mostramos um gráfico vazio
    const hasData = totalIncome > 0 || totalExpense > 0;

    financeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: hasData ? ['Entradas', 'Saídas'] : ['Sem transações'],
            datasets: [{
                data: hasData ? [totalIncome, totalExpense] : [1],
                backgroundColor: hasData ? ['#10b981', '#ef4444'] : ['#e2e8f0'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#475569',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) label += ': ';
                            if (context.raw !== undefined) {
                                label += formatCurrency(context.raw);
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
};

// LÓGICA DE ATUALIZAÇÃO DO PAINEL
const updateBalanceValues = (data) => {
    const income = data
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);

    const expense = data
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    const total = income - expense;

    balanceDisplay.textContent = formatCurrency(total);
    incomeDisplay.textContent = formatCurrency(income);
    expenseDisplay.textContent = formatCurrency(expense);
};

// RENDERIZAÇÃO NA TELA
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
        <td class="px-6 py-4 text-sm">
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                ${transaction.category || 'Outros'}
            </span>
        </td>
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
    const filtered = getFilteredTransactions(); // Pegamos a lista filtrada

    transactionList.innerHTML = '';
    filtered.forEach(addTransactionIntoDOM); // Renderiza apenas o filtrado

    // PASSAMOS a lista filtrada para os cálculos e para o gráfico
    updateBalanceValues(filtered); 
    updateChart(filtered);
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

// EVENTOS
transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const desc = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    if (desc.trim() === '' || amount.trim() === '' || category === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, preencha todos os campos!',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }

    const now = new Date();
    const transaction = {
        description: desc,
        amount: parseFloat(amount),
        type: type,
        category: category,
        date: now.toLocaleDateString('pt-BR'),
        dateMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    };

    if (editingId !== null) {
        // MODO EDIÇÃO: Atualizamos o item existente no array
        const index = transactions.findIndex(t => t.id === editingId);
        transactions[index] = {
            ...transactions[index],
            ...transaction
        };

        // Reseta o estado de edição
        editingId = null;
        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Adicionar';
        submitBtn.classList.replace('bg-amber-500', 'bg-indigo-600');
    } else {
        // MODO ADIÇÃO: Cria um novo
        transaction.id = generateID();
        transactions.push(transaction);

        Swal.fire({
            icon: 'success',
            title: 'Adicionado!',
            text: 'Sua transação foi registrada.',
            timer: 1500,
            showConfirmButton: false
        });
    }

    init();
    transactionForm.reset();
});


const prepareEdit = (id) => {
    // 1. Encontramos a transação no array pelo ID
    const transaction = transactions.find(t => t.id === id);

    // 2. Preenchemos o formulário
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;

    // 3. Mudamos o ID de edição e o texto do botão
    editingId = id;
    const submitBtn = transactionForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Salvar Alterações';
    submitBtn.classList.replace('bg-indigo-600', 'bg-amber-500'); // Cor de alerta/edição

    // 4. Jogamos o foco no primeiro campo para o usuário
    document.getElementById('description').focus();
};

const removeTransaction = (id) => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Rose 500
        cancelButtonColor: '#64748b', // Slate 500
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            transactions = transactions.filter(transaction => transaction.id !== id);
            init();

            Swal.fire(
                'Deletado!',
                'Sua transação foi removida.',
                'success'
            );
        }
    });
};

// Seleção dos novos elementos
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');

// Função de busca e filtro combinados
const filterMonth = document.getElementById('filter-month');

const getFilteredTransactions = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = filterType.value;
    const selectedMonth = filterMonth.value; // Formato: "YYYY-MM"

    return transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm);
        const matchesType = selectedType === 'all' || t.type === selectedType;
        
        // Se o usuário não selecionou mês, mostra todos. Se selecionou, compara.
        const matchesMonth = !selectedMonth || t.dateMonth === selectedMonth;

        return matchesSearch && matchesType && matchesMonth;
    });
};

// Ouvinte de evento para o mês
filterMonth.addEventListener('change', () => updateUI());

// Definir o valor inicial do filterMonth para o mês atual
filterMonth.value = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

// Eventos para disparar a atualização em tempo real
searchInput.addEventListener('input', () => updateUI());
filterType.addEventListener('change', () => updateUI());

const updateUI = () => {
    transactionList.innerHTML = '';
    const filtered = getFilteredTransactions();
    filtered.forEach(addTransactionIntoDOM);
    updateBalanceValues(filtered);
    updateChart(filtered);
};

const exportToCSV = () => {
    if (transactions.length === 0) {
        Swal.fire('Vazio', 'Não há dados para exportar', 'info');
        return;
    }

    // 1. Definir o cabeçalho
    let csv = 'Descrição,Categoria,Valor,Tipo,Data\n';

    // 2. Adicionar as linhas
    transactions.forEach(t => {
        const amount = t.type === 'expense' ? `-${t.amount}` : t.amount;
        csv += `${t.description},${t.category},${amount},${t.type},${t.date}\n`;
    });

    // 3. Criar um "Blob" (objeto de dados binários)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // 4. Criar um link temporário para download
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `financehub_export_${new Date().toLocaleDateString()}.csv`);
    a.click();

    Swal.fire('Sucesso!', 'Seu relatório foi gerado.', 'success');
};

const clearAllTransactions = () => {
    // 1. Verificamos se existe algo para limpar
    if (transactions.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Nada para limpar',
            text: 'Seu histórico já está vazio.',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }

    // 2. Alerta de Confirmação Crítica
    Swal.fire({
        title: 'Tem certeza absoluta?',
        text: "Isso apagará todas as suas transações permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Vermelho (perigo)
        cancelButtonColor: '#64748b',  // Cinza (cancelar)
        confirmButtonText: 'Sim, apagar tudo!',
        cancelButtonText: 'Não, cancelar',
        reverseButtons: true // Inverte a ordem para o "Cancelar" ficar na esquerda (padrão UX)
    }).then((result) => {
        if (result.isConfirmed) {
            // 3. Esvaziamos o array
            transactions = [];

            // 4. Rodamos o init para atualizar Tabela, Gráfico, Cards e LocalStorage
            init();

            // 5. Feedback de sucesso
            Swal.fire(
                'Tudo limpo!',
                'Seu dashboard foi resetado com sucesso.',
                'success'
            );
        }
    });
};

// Inicialização
init();