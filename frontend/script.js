const API_URL = 'http://localhost:3000/api/items';

document.addEventListener('DOMContentLoaded', () => {
    fetchItems();

    const form = document.getElementById('itemForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Elemento form não encontrado.');
    }
});

async function fetchItems() {
    const listElement = document.getElementById('itemsList');

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.message === 'success') {
            renderItems(result.data);
        } else {
            showError('Erro ao carregar dados do servidor.');
        }
    } catch (error) {
        console.error('Erro:', error);
        showError('Falha na conexão com o backend. Verifique se o servidor está rodando.');
    }
}

function renderItems(items) {
    const listElement = document.getElementById('itemsList');
    if (!listElement) return;

    listElement.innerHTML = '';

    if (items.length === 0) {
        listElement.innerHTML = '<div class="empty-message">Nenhum item cadastrado ainda.</div>';
        return;
    }

    items.reverse().forEach(item => { // Mostrar mais recentes primeiro
        const card = document.createElement('div');
        card.className = 'item-card';

        const h3 = document.createElement('h3');
        h3.className = 'item-name';
        h3.textContent = item.name;

        const p = document.createElement('p');
        p.className = 'item-desc';
        p.textContent = item.description || 'Sem descrição.';

        card.appendChild(h3);
        card.appendChild(p);
        listElement.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Salvando...</span>';
    submitBtn.disabled = true;

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const data = { name, description };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.message === 'success') {
            // Limpar formulário
            document.getElementById('name').value = '';
            document.getElementById('description').value = '';

            // Recarregar lista
            fetchItems();
        } else {
            alert('Erro ao salvar item: ' + result.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar dados.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function showError(msg) {
    const listElement = document.getElementById('itemsList');
    if (listElement) {
        listElement.innerHTML = `<div class="error-message">${msg}</div>`;
    }
}
