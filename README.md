# FinanceHub - Dashboard Financeiro 💰

Dashboard interativo para controle de finanças pessoais, desenvolvido com **Vanilla JavaScript** e **Tailwind CSS**. Perfeito para reforçar conceitos fundamentais de desenvolvimento web.

![FinanceHub](assets/favicon.svg)

---

## 🎯 Sobre o Projeto

FinanceHub é uma aplicação web moderna que permite gerenciar suas transações financeiras de forma simples e intuitiva. O projeto foi desenvolvido com foco em boas práticas de programação e demonstra competências em:

- **JavaScript**: DOM manipulation, localStorage, ES6+ features
- **Tailwind CSS**: Responsive design, dark mode, component styling
- **UX/UI**: Interface intuitiva e acessível
- **Git & GitHub**: Versionamento e boas práticas

---

## ✨ Funcionalidades

✅ **Adicionar Transações** - Registre entradas e saídas com descrição, valor e tipo  
✅ **Editar Transações** - Modifique transações existentes facilmente  
✅ **Deletar Transações** - Remova transações indesejadas  
✅ **Modo Escuro** - Alterne entre temas claro e escuro com persistência  
✅ **Visualização de Dados** - Gráfico doughnut com Chart.js  
✅ **Cálculos Automáticos** - Saldo total, entradas e saídas  
✅ **Responsivo** - Funciona perfeitamente em mobile, tablet e desktop  
✅ **Persistência** - Dados salvos em localStorage  

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estrutura semântica e acessível |
| **CSS3 + Tailwind CSS** | Styling responsivo com utility-first approach |
| **Vanilla JavaScript** | Lógica pura, sem frameworks |
| **Chart.js 4.x** | Visualização de dados em gráfico |
| **Google Fonts** | Tipografia (Inter) |

---

## 📂 Estrutura do Projeto

```
finance-hub/
├── index.html           # Página principal
├── app/
│   └── app.js           # Lógica da aplicação
├── css/
│   └── style.css        # Estilos customizados
├── assets/
│   └── favicon.svg      # Ícone da aplicação
├── README.md            # Este arquivo
└── .gitignore          # Arquivos a ignorar no git
```

---

## 🚀 Como Usar

### 1️⃣ **Adicionar uma Transação**
- Preencha os campos: Descrição, Valor, Tipo (Entrada/Saída)
- Clique em "Adicionar"
- A transação aparecerá na tabela e será refletida nos cards de resumo

### 2️⃣ **Editar uma Transação**
- Clique no botão "Editar" na linha da transação desejada
- O formulário será preenchido com os dados atuais
- Faça as alterações necessárias
- Clique em "Salvar Alterações"

### 3️⃣ **Deletar uma Transação**
- Clique no botão "Excluir" na linha da transação

### 4️⃣ **Alternar Tema**
- Clique no botão no header: "Modo escuro" / "Modo claro"
- A preferência é salva automaticamente

---

## 💡 Conceitos JavaScript Reforçados

### 1. **DOM Manipulation**
```javascript
// Seleção de elementos
const element = document.getElementById('id');
const elements = document.querySelectorAll('.classe');

// Manipulação de classes
element.classList.add('classe');
element.classList.remove('classe');
element.classList.toggle('classe');
```

### 2. **Array Methods**
```javascript
// Filter - encontrar transações por tipo
const income = transactions.filter(t => t.type === 'income');

// Map - transformar dados
const descriptions = transactions.map(t => t.description);

// Reduce - somar valores
const total = transactions.reduce((acc, t) => acc + t.amount, 0);

// Find - buscar transação por ID
const transaction = transactions.find(t => t.id === id);
```

### 3. **LocalStorage**
```javascript
// Salvar dados
localStorage.setItem('key', JSON.stringify(data));

// Recuperar dados
const data = JSON.parse(localStorage.getItem('key'));

// Validação segura
try {
    localStorage.setItem('test', '1');
} catch (error) {
    console.warn('LocalStorage unavailable');
}
```

### 4. **Eventos**
```javascript
// Event listeners
element.addEventListener('click', handler);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // lógica
});

// Event delegation
document.on('click', '[data-action="delete"]', handler);
```

### 5. **Template Literals**
```javascript
const html = `
    <div class="card">
        <h2>${title}</h2>
        <p>${description}</p>
    </div>
`;
element.innerHTML = html;
```

### 6. **Operador Spread & Destructuring**
```javascript
// Spread operator
const updated = { ...original, name: 'novo' };

// Destructuring
const { income, expense } = updateBalanceValues();
const { id, description, amount } = transaction;
```

---

## 🎨 Conceitos Tailwind CSS Reforçados

### 1. **Responsive Design**
```html
<!-- Mobile-first approach -->
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
    <!-- 1 coluna mobile, 3 desktop, 4 em telas maiores -->
</div>
```

### 2. **Dark Mode**
```html
<!-- Classes dark: são aplicadas quando .dark existe no html -->
<div class="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">
    <!-- Fundo branco em light, slate-900 em dark -->
</div>
```

### 3. **Focus States & Accessibility**
```html
<input class="focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
```

### 4. **Utility-First Approach**
```html
<!-- Em vez de criar classes CSS, use utilities -->
<button class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
    Botão
</button>
```

### 5. **Conditional Styling**
```html
<!-- Estilos dinâmicos com classes condicionais -->
<div class="text-emerald-600 dark:text-emerald-400"></div>
```

---

## 🔍 Boas Práticas Implementadas

### **Semântica HTML**
- Uso de tags semânticas: `<header>`, `<main>`, `<section>`, `<form>`
- Atributos `aria-*` para acessibilidade

### **JavaScript Limpo**
- Funções pequenas e com responsabilidade única
- Nomes em inglês (padrão de mercado) e comentários em português
- Código auto-explicativo e bem estruturado
- Tratamento de erros com try/catch

### **Performance**
- LocalStorage para evitar requisições
- Delegação de eventos
- Destruição de charts antes de recriar
- Minimização de re-renders

### **Organização**
- Código estruturado em seções comentadas
- Separação de concerns (HTML, CSS, JS)
- Pastas organizadas por tipo de arquivo

---

## 🌐 Como Abrir o Projeto

### Opção 1: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com direito em `index.html` → "Open with Live Server"

### Opção 2: Servidor Local
```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (com http-server)
npx http-server
```

Acesse em: `http://localhost:8000`

### Opção 3: Diretamente
Abra o arquivo `index.html` no navegador (funciona, mas localStorage pode ter limitações)

---

## 📊 Exemplo de Dados

```javascript
// Formato das transações
{
    id: 123,
    description: "Aluguel",
    amount: 1500.00,
    type: "expense",  // 'income' ou 'expense'
    date: "15/02/2026"
}
```

---

## 🎓 O Que Você Aprenderá

- ✅ Manipulação de DOM com Vanilla JS
- ✅ Gestão de estado com localStorage
- ✅ Array methods avançados (map, filter, reduce, find)
- ✅ Event handling e formulários
- ✅ Responsive design com Tailwind
- ✅ Dark mode e preferências do usuário
- ✅ Integração com bibliotecas (Chart.js)
- ✅ Git workflow e repositórios

---

## 🚨 Possíveis Melhorias Futuras

- [ ] Backend com Node.js/Express
- [ ] Autenticação de usuários
- [ ] Categorias de transações
- [ ] Filtros avançados (data, categoria)
- [ ] Export de dados (CSV, PDF)
- [ ] Notificações de alertas
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados

---

## 📝 Licença

Este projeto é de código aberto e foi desenvolvido para fins educacionais.

---

## 👤 Autor

Desenvolvido como projeto de aprendizado e portfólio.

---

## 📞 Suporte

Dúvidas ou sugestões? Abra uma issue no repositório!

---

**⭐ Se esse projeto foi útil, considere deixar uma star!**

---

## 🔗 Links Úteis

- [MDN - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

Desenvolvido com ❤️ para aprender e crescer como desenvolvedor.
