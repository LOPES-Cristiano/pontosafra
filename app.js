const DataStore = {
    init() {
        if (!localStorage.getItem('pontosafra_users')) {
            const mockUsers = [
                { id: 1, name: 'João Silva', email: 'joao@pontosafra.com', username: 'joao', password: '123456', role: 'Consultor', createdAt: '2024-01-15T10:00:00Z', phone: '(16) 99123-4567', bio: 'Consultor agrícola especializado em cafeicultura', avatar: null },
                { id: 2, name: 'Maria Santos', email: 'maria@pontosafra.com', username: 'maria', password: '123456', role: 'Produtor', createdAt: '2024-02-20T14:30:00Z', phone: '(16) 98765-4321', bio: 'Produtora rural com foco em sustentabilidade', avatar: null, clientId: 1 }
            ];
            localStorage.setItem('pontosafra_users', JSON.stringify(mockUsers));
        }
        
        if (!localStorage.getItem('pontosafra_clients')) {
            const mockClients = [
                { id: 1, name: 'Fazenda São João', owner: 'Pedro Almeida', email: 'pedro@fazendajoao.com', phone: '(16) 99876-5432', crop: 'Café Arábica', area: 850, city: 'Franca', state: 'SP', status: 'active', production: 12450, revenue: 284000, createdAt: '2024-03-10T09:00:00Z', consultantId: 1, userId: 2 },
                { id: 2, name: 'Sítio Boa Vista', owner: 'Carlos Mendes', email: 'carlos@boavista.com', phone: '(16) 98765-4321', crop: 'Café Robusta', area: 420, city: 'Ribeirão Preto', state: 'SP', status: 'active', production: 5200, revenue: 125000, createdAt: '2024-04-05T11:20:00Z', consultantId: 1, userId: null }
            ];
            localStorage.setItem('pontosafra_clients', JSON.stringify(mockClients));
        }
        
        if (!localStorage.getItem('pontosafra_consultants')) {
            const mockConsultants = [
                { id: 1, userId: 1, specialty: 'Cafeicultura', experience: 12, certifications: ['Agrônomo CREA-SP', 'Consultor Técnico'], rating: 4.8, totalClients: 2 }
            ];
            localStorage.setItem('pontosafra_consultants', JSON.stringify(mockConsultants));
        }
        
        if (!localStorage.getItem('pontosafra_activities')) {
            const mockActivities = [
                { id: 1, type: 'harvest', title: 'Colheita concluída', description: 'Fazenda São João - Talhão 3', client: 'Fazenda São João', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: 'check-circle', color: 'green' },
                { id: 2, type: 'alert', title: 'Alerta de irrigação', description: 'Sítio Boa Vista - Sistema #2', client: 'Sítio Boa Vista', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), icon: 'alert-triangle', color: 'orange' }
            ];
            localStorage.setItem('pontosafra_activities', JSON.stringify(mockActivities));
        }
        
        if (!localStorage.getItem('pontosafra_notifications')) {
            const mockNotifications = [
                { id: 1, title: 'Novo cliente cadastrado', message: 'Pedro Almeida foi adicionado à sua carteira', type: 'info', read: false, date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
                { id: 2, title: 'Relatório pronto', message: 'Análise de solo da Fazenda Esperança está disponível', type: 'success', read: false, date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
                { id: 3, title: 'Alerta de pragas', message: 'Detecção de ferrugem no Talhão 5', type: 'warning', read: true, date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
            ];
            localStorage.setItem('pontosafra_notifications', JSON.stringify(mockNotifications));
        }
    },
    
    getUsers() { return JSON.parse(localStorage.getItem('pontosafra_users') || '[]'); },
    getCurrentUser() { return JSON.parse(localStorage.getItem('pontosafra_currentUser') || 'null'); },
    setCurrentUser(user) { localStorage.setItem('pontosafra_currentUser', JSON.stringify(user)); },
    logout() { localStorage.removeItem('pontosafra_currentUser'); },
    updateUser(userId, data) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...data };
            localStorage.setItem('pontosafra_users', JSON.stringify(users));
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                this.setCurrentUser(users[index]);
            }
            return users[index];
        }
        return null;
    },
    
    getConsultants() { return JSON.parse(localStorage.getItem('pontosafra_consultants') || '[]'); },
    getConsultantByUserId(userId) {
        return this.getConsultants().find(c => c.userId === userId);
    },
    getClientsByConsultant(consultantId) {
        return this.getClients().filter(c => c.consultantId === consultantId);
    },
    getClientByUserId(userId) {
        return this.getClients().find(c => c.userId === userId);
    },
    
    getClients() { return JSON.parse(localStorage.getItem('pontosafra_clients') || '[]'); },
    addClient(client) {
        const clients = this.getClients();
        client.id = Date.now();
        client.createdAt = new Date().toISOString();
        clients.push(client);
        localStorage.setItem('pontosafra_clients', JSON.stringify(clients));
        return client;
    },
    updateClient(id, data) {
        const clients = this.getClients();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...data };
            localStorage.setItem('pontosafra_clients', JSON.stringify(clients));
            return clients[index];
        }
        return null;
    },
    deleteClient(id) {
        const clients = this.getClients().filter(c => c.id !== id);
        localStorage.setItem('pontosafra_clients', JSON.stringify(clients));
    },
    
    getActivities() { return JSON.parse(localStorage.getItem('pontosafra_activities') || '[]'); },
    addActivity(activity) {
        const activities = this.getActivities();
        activity.id = Date.now();
        activity.date = new Date().toISOString();
        activities.unshift(activity);
        localStorage.setItem('pontosafra_activities', JSON.stringify(activities));
        return activity;
    },
    
    getNotifications() { return JSON.parse(localStorage.getItem('pontosafra_notifications') || '[]'); },
    getUnreadCount() { return this.getNotifications().filter(n => !n.read).length; },
    markAsRead(id) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            localStorage.setItem('pontosafra_notifications', JSON.stringify(notifications));
        }
    },
    markAllAsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        localStorage.setItem('pontosafra_notifications', JSON.stringify(notifications));
    },
    addNotification(notification) {
        const notifications = this.getNotifications();
        notification.id = Date.now();
        notification.date = new Date().toISOString();
        notification.read = false;
        notifications.unshift(notification);
        localStorage.setItem('pontosafra_notifications', JSON.stringify(notifications));
        return notification;
    },
    
    getFinancialRecords() { return JSON.parse(localStorage.getItem('pontosafra_financial') || '[]'); },
    addFinancialRecord(record) {
        const records = this.getFinancialRecords();
        record.id = Date.now();
        record.createdAt = new Date().toISOString();
        records.unshift(record);
        localStorage.setItem('pontosafra_financial', JSON.stringify(records));
        return record;
    },
    updateFinancialRecord(id, data) {
        const records = this.getFinancialRecords();
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = { ...records[index], ...data };
            localStorage.setItem('pontosafra_financial', JSON.stringify(records));
            return records[index];
        }
        return null;
    },
    deleteFinancialRecord(id) {
        const records = this.getFinancialRecords().filter(r => r.id !== id);
        localStorage.setItem('pontosafra_financial', JSON.stringify(records));
    },
    getFinancialCategories() {
        return {
            revenue: ['Venda de Produção', 'Serviços', 'Subsídios', 'Outros'],
            expense: ['Insumos', 'Mão de Obra', 'Equipamentos', 'Manutenção', 'Combustível', 'Transporte', 'Impostos', 'Outros']
        };
    },
    
    getProduction() { return JSON.parse(localStorage.getItem('pontosafra_production') || '[]'); },
    addProduction(production) {
        const productions = this.getProduction();
        production.id = Date.now();
        production.createdAt = new Date().toISOString();
        productions.unshift(production);
        localStorage.setItem('pontosafra_production', JSON.stringify(productions));
        return production;
    },
    updateProduction(id, data) {
        const productions = this.getProduction();
        const index = productions.findIndex(p => p.id === id);
        if (index !== -1) {
            productions[index] = { ...productions[index], ...data };
            localStorage.setItem('pontosafra_production', JSON.stringify(productions));
            return productions[index];
        }
        return null;
    },
    deleteProduction(id) {
        const productions = this.getProduction().filter(p => p.id !== id);
        localStorage.setItem('pontosafra_production', JSON.stringify(productions));
    },
    
    getInventory() { return JSON.parse(localStorage.getItem('pontosafra_inventory') || '[]'); },
    addInventoryItem(item) {
        const inventory = this.getInventory();
        item.id = Date.now();
        item.createdAt = new Date().toISOString();
        inventory.unshift(item);
        localStorage.setItem('pontosafra_inventory', JSON.stringify(inventory));
        return item;
    },
    updateInventoryItem(id, data) {
        const inventory = this.getInventory();
        const index = inventory.findIndex(i => i.id === id);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...data };
            localStorage.setItem('pontosafra_inventory', JSON.stringify(inventory));
            return inventory[index];
        }
        return null;
    },
    deleteInventoryItem(id) {
        const inventory = this.getInventory().filter(i => i.id !== id);
        localStorage.setItem('pontosafra_inventory', JSON.stringify(inventory));
    },
    getInventoryCategories() {
        return ['Fertilizantes', 'Defensivos', 'Sementes', 'Combustível', 'Ferramentas', 'Equipamentos', 'Outros'];
    }
};

const UI = {
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i data-lucide="${this.getToastIcon(type)}"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
    },
    
    getToastIcon(type) {
        const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
        return icons[type] || 'info';
    },
    
    showModal(title, content, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn-primary" id="modal-confirm">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        lucide.createIcons();
        if (onConfirm) {
            document.getElementById('modal-confirm').addEventListener('click', () => {
                onConfirm();
                modal.remove();
            });
        }
        setTimeout(() => modal.classList.add('show'), 10);
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 60) return `Há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        if (hours < 24) return `Há ${hours} hora${hours !== 1 ? 's' : ''}`;
        if (days < 7) return `Há ${days} dia${days !== 1 ? 's' : ''}`;
        return date.toLocaleDateString('pt-BR');
    },
    
    formatCurrency(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); },
    formatNumber(value) { return new Intl.NumberFormat('pt-BR').format(value); }
};

function setupDashboard() {
    const currentUser = DataStore.getCurrentUser();
    if (currentUser.role === 'Consultor') {
        loadConsultantDashboard();
    } else if (currentUser.role === 'Produtor') {
        loadProducerDashboard();
    } else {
        loadDashboardStats();
    }
    loadRecentActivities();
    loadMarketData();
}

function loadConsultantDashboard() {
    const currentUser = DataStore.getCurrentUser();
    const consultant = DataStore.getConsultantByUserId(currentUser.id);
    const clients = consultant ? DataStore.getClientsByConsultant(consultant.id) : [];
    
    const stats = {
        totalClients: clients.filter(c => c.status === 'active').length,
        totalProduction: clients.reduce((sum, c) => sum + (c.production || 0), 0),
        totalRevenue: clients.reduce((sum, c) => sum + (c.revenue || 0), 0),
        totalArea: clients.reduce((sum, c) => sum + (c.area || 0), 0)
    };
    
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = stats.totalClients;
        statValues[1].textContent = UI.formatNumber(stats.totalProduction);
        statValues[2].textContent = `R$ ${Math.floor(stats.totalRevenue / 1000)}k`;
        statValues[3].textContent = UI.formatNumber(stats.totalArea);
    }
}

function loadProducerDashboard() {
    const currentUser = DataStore.getCurrentUser();
    const client = DataStore.getClientByUserId(currentUser.id);
    
    if (!client) {
        loadDashboardStats();
        return;
    }
    
    const consultants = DataStore.getConsultants();
    const consultant = consultants.find(c => c.id === client.consultantId);
    const consultantUser = consultant ? DataStore.getUsers().find(u => u.id === consultant.userId) : null;
    
    const production = DataStore.getProduction().filter(p => p.clientId === client.id);
    const financialRecords = DataStore.getFinancialRecords();
    const inventory = DataStore.getInventory();
    
    const totalProduction = production.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = inventory.filter(i => i.quantity <= i.minQuantity).length;
    
    const statValues = document.querySelectorAll('.stat-value');
    const statLabels = document.querySelectorAll('.stat-card h3');
    const statIcons = document.querySelectorAll('.stat-icon');
    
    if (statValues.length >= 4 && statLabels.length >= 4) {
        statLabels[0].textContent = 'Minha Propriedade';
        statValues[0].textContent = client.name;
        statValues[0].style.fontSize = '20px';
        
        statLabels[1].textContent = 'Produção Total';
        statValues[1].textContent = UI.formatNumber(totalProduction);
        
        statLabels[2].textContent = 'Área da Fazenda';
        statValues[2].textContent = `${client.area} ha`;
        
        statLabels[3].textContent = 'Alertas de Estoque';
        statValues[3].textContent = lowStock;
        if (statIcons[3]) {
            statIcons[3].innerHTML = '<i data-lucide="alert-triangle"></i>';
            lucide.createIcons();
        }
    }
    
    if (consultantUser) {
        const bottomRow = document.querySelector('.bottom-row');
        if (bottomRow) {
            const consultantCard = document.createElement('div');
            consultantCard.className = 'activity-card';
            consultantCard.innerHTML = `
                <div class="card-header">
                    <div>
                        <h3>👨‍🌾 Meu Consultor</h3>
                        <p>Profissional responsável</p>
                    </div>
                </div>
                <div style="padding: 20px; background: var(--sidebar-bg); border-radius: 12px; margin-top: 16px;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <div style="width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, #3498db, #2980b9); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
                            ${consultantUser.name.charAt(0)}
                        </div>
                        <div>
                            <h4 style="margin: 0 0 4px 0; font-size: 18px; color: var(--text-primary);">${consultantUser.name}</h4>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 13px;">${consultant.specialty || 'Consultor Agrícola'}</p>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px;">
                            <i data-lucide="mail" style="width: 16px; height: 16px; color: var(--primary);"></i>
                            <span>${consultantUser.email}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px;">
                            <i data-lucide="phone" style="width: 16px; height: 16px; color: var(--primary);"></i>
                            <span>${consultantUser.phone || 'Não informado'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px;">
                            <i data-lucide="award" style="width: 16px; height: 16px; color: var(--primary);"></i>
                            <span>${consultant.experience || 0} anos de experiência</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px;">
                            <i data-lucide="star" style="width: 16px; height: 16px; color: #f39c12;"></i>
                            <span>Avaliação: ${consultant.rating || '0.0'} ⭐</span>
                        </div>
                    </div>
                </div>
            `;
            bottomRow.insertBefore(consultantCard, bottomRow.firstChild);
            lucide.createIcons();
        }
    }
}

function initializeApp() {
    DataStore.init();
    const currentUser = DataStore.getCurrentUser();
    if (!currentUser && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        window.location.href = 'login.html';
        return;
    }
    if (currentUser) {
        setupDashboard();
        setupNavigation();
        setupMobileMenu();
        setupNotifications();
        updateUserInfo();
        updateMenuLabels();
        initializeCharts();
    }
}

function setupDashboard() {
    const currentUser = DataStore.getCurrentUser();
    if (currentUser.role === 'Consultor') {
        loadConsultantDashboard();
    } else if (currentUser.role === 'Produtor') {
        loadProducerDashboard();
    } else {
        loadDashboardStats();
    }
    loadRecentActivities();
    loadMarketData();
}

function loadDashboardStats() {
    const clients = DataStore.getClients();
    const stats = {
        totalClients: clients.filter(c => c.status === 'active').length,
        totalProduction: clients.reduce((sum, c) => sum + (c.production || 0), 0),
        totalRevenue: clients.reduce((sum, c) => sum + (c.revenue || 0), 0),
        totalArea: clients.reduce((sum, c) => sum + (c.area || 0), 0)
    };
    
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = stats.totalClients;
        statValues[1].textContent = UI.formatNumber(stats.totalProduction);
        statValues[2].textContent = `R$ ${Math.floor(stats.totalRevenue / 1000)}k`;
        statValues[3].textContent = UI.formatNumber(stats.totalArea);
    }
}

function loadRecentActivities() {
    const activities = DataStore.getActivities();
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.slice(0, 4).map(activity => `
            <div class="activity-item">
                <div class="activity-icon bg-${activity.color}">
                    <i data-lucide="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="time">${UI.formatDate(activity.date)}</span>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

function loadMarketData() {
    const marketData = [
        { name: 'Café Arábica', unit: 'Saca 60kg', price: 1245.00, change: 5.2 },
        { name: 'Café Robusta', unit: 'Saca 60kg', price: 892.00, change: 2.8 },
        { name: 'Milho', unit: 'Saca 60kg', price: 78.50, change: -1.3 },
        { name: 'Soja', unit: 'Saca 60kg', price: 152.30, change: 3.1 }
    ];
    const marketList = document.querySelector('.market-list');
    if (marketList) {
        marketList.innerHTML = marketData.map(item => `
            <div class="market-item">
                <div class="market-info">
                    <h4>${item.name}</h4>
                    <span>${item.unit}</span>
                </div>
                <div class="market-price">
                    <strong>${UI.formatCurrency(item.price)}</strong>
                    <span class="trend ${item.change >= 0 ? 'up' : 'down'}">${item.change >= 0 ? '+' : ''}${item.change}%</span>
                </div>
            </div>
        `).join('');
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const page = link.dataset.page;
            loadPage(page);
        });
    });
}

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    const pages = {
        dashboard: () => window.location.reload(),
        clients: renderClientsPage,
        production: renderProductionPage,
        financial: renderFinancialPage,
        inventory: renderInventoryPage,
        reports: renderReportsPage,
        weather: renderWeatherPage,
        market: renderMarketPage,
        news: renderNewsPage,
        courses: renderCoursesPage,
        profile: renderProfilePage
    };
    if (pages[page]) {
        pages[page](mainContent);
        lucide.createIcons();
        setTimeout(() => setupSearchAndFilters(), 100);
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainWrapper = document.querySelector('.main-wrapper');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('pontosafra_sidebar_collapsed', isCollapsed);
        });
        
        sidebar.addEventListener('click', (e) => {
            if (window.innerWidth > 1024 && sidebar.classList.contains('collapsed')) {
                if (!e.target.closest('.nav-link')) {
                    sidebar.classList.remove('collapsed');
                    localStorage.setItem('pontosafra_sidebar_collapsed', 'false');
                }
            }
        });
        
        const savedState = localStorage.getItem('pontosafra_sidebar_collapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
        
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                }
            });
        });
        
        const observer = new MutationObserver(() => {
            if (sidebar.classList.contains('open') && window.innerWidth <= 1024) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
}

function setupNotifications() {
    updateNotificationBadge();
    const notificationBtn = document.querySelector('.header-btn[title="Notificações"]');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotificationsPanel);
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.badge');
    const count = DataStore.getUnreadCount();
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

function showNotificationsPanel() {
    const notifications = DataStore.getNotifications();
    const content = `
        <div class="notifications-panel">
            <div class="notifications-header">
                <h4>Notificações</h4>
                <button class="btn-text" onclick="markAllNotificationsRead()">Marcar todas como lidas</button>
            </div>
            <div class="notifications-list">
                ${notifications.map(n => `
                    <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationRead(${n.id})">
                        <div class="notification-icon type-${n.type}">
                            <i data-lucide="${getNotificationIcon(n.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <h5>${n.title}</h5>
                            <p>${n.message}</p>
                            <span class="notification-time">${UI.formatDate(n.date)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    UI.showModal('Notificações', content);
}

function getNotificationIcon(type) {
    const icons = { info: 'info', success: 'check-circle', warning: 'alert-triangle', error: 'x-circle' };
    return icons[type] || 'bell';
}

function markNotificationRead(id) {
    DataStore.markAsRead(id);
    updateNotificationBadge();
}

function markAllNotificationsRead() {
    DataStore.markAllAsRead();
    updateNotificationBadge();
    UI.showToast('Todas as notificações foram marcadas como lidas', 'success');
    document.querySelector('.modal-overlay')?.remove();
}

function updateUserInfo() {
    const currentUser = DataStore.getCurrentUser();
    if (currentUser) {
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        if (userName) userName.textContent = currentUser.name;
        if (userRole) userRole.textContent = currentUser.role;
    }
}

function updateMenuLabels() {
    const currentUser = DataStore.getCurrentUser();
    if (currentUser && currentUser.role === 'Produtor') {
        const clientsLink = document.querySelector('.nav-link[data-page="clients"]');
        if (clientsLink) {
            const span = clientsLink.querySelector('span');
            if (span) {
                span.textContent = 'Propriedades';
            }
        }
    }
}

function renderClientsPage(container) {
    const currentUser = DataStore.getCurrentUser();
    const isConsultant = currentUser.role === 'Consultor';
    const consultant = isConsultant ? DataStore.getConsultantByUserId(currentUser.id) : null;
    
    let clients = DataStore.getClients();
    if (isConsultant && consultant) {
        clients = DataStore.getClientsByConsultant(consultant.id);
    } else if (currentUser.role === 'Produtor') {
        const clientData = DataStore.getClientByUserId(currentUser.id);
        clients = clientData ? [clientData] : [];
    }
    
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>${isConsultant ? 'Meus Clientes' : 'Minhas Propriedades'}</h1>
                <p>${isConsultant ? 'Gerencie sua carteira de clientes' : 'Informações das propriedades'}</p>
            </div>
            ${isConsultant ? `
                <button class="btn-primary" onclick="showAddClientModal()">
                    <i data-lucide="plus"></i> Novo Cliente
                </button>
            ` : ''}
        </div>
        
        <div class="table-container" style="margin-bottom: 24px;">
            <div class="table-header">
                <h3>Clientes</h3>
                <div class="table-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Buscar clientes..." id="client-search">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="clients-grid">
            ${clients.map(client => `
                <div class="client-card">
                    <div class="client-header">
                        <div class="client-avatar">${client.name.charAt(0)}</div>
                        <div class="client-info">
                            <h3>${client.name}</h3>
                            <p>${client.owner}</p>
                        </div>
                    </div>
                    <div class="client-details">
                        <div class="detail-item"><i data-lucide="sprout"></i><span>${client.crop}</span></div>
                        <div class="detail-item"><i data-lucide="map-pin"></i><span>${client.city}, ${client.state}</span></div>
                        <div class="detail-item"><i data-lucide="maximize-2"></i><span>${client.area} ha</span></div>
                    </div>
                    <div class="client-stats">
                        <div><strong>${UI.formatNumber(client.production)}</strong><span>Sacas</span></div>
                        <div><strong>${UI.formatCurrency(client.revenue)}</strong><span>Receita</span></div>
                    </div>
                    <div class="client-actions">
                        <button class="btn-sm btn-secondary" onclick="viewClient(${client.id})"><i data-lucide="eye"></i> Ver</button>
                        <button class="btn-sm btn-secondary" onclick="editClient(${client.id})"><i data-lucide="edit"></i> Editar</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

function showAddClientModal() {
    const content = `
        <form id="add-client-form" class="modal-form">
            <div class="input-group"><label>Nome da Propriedade</label><input type="text" id="client-name" class="input-field" required></div>
            <div class="input-group"><label>Proprietário</label><input type="text" id="client-owner" class="input-field" required></div>
            <div class="input-group"><label>E-mail</label><input type="email" id="client-email" class="input-field" required></div>
            <div class="input-group"><label>Telefone</label><input type="text" id="client-phone" class="input-field" required></div>
            <div class="input-group"><label>Cultura</label><input type="text" id="client-crop" class="input-field" required></div>
            <div class="input-group"><label>Área (hectares)</label><input type="number" id="client-area" class="input-field" required></div>
            <div class="input-group"><label>Cidade</label><input type="text" id="client-city" class="input-field" required></div>
            <div class="input-group"><label>Estado</label><input type="text" id="client-state" class="input-field" required maxlength="2"></div>
        </form>
    `;
    UI.showModal('Novo Cliente', content, () => {
        const form = document.getElementById('add-client-form');
        const client = {
            name: document.getElementById('client-name').value,
            owner: document.getElementById('client-owner').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            crop: document.getElementById('client-crop').value,
            area: parseFloat(document.getElementById('client-area').value),
            city: document.getElementById('client-city').value,
            state: document.getElementById('client-state').value.toUpperCase(),
            status: 'active',
            production: 0,
            revenue: 0
        };
        DataStore.addClient(client);
        DataStore.addActivity({ type: 'client', title: 'Novo cliente cadastrado', description: `${client.name} - ${client.crop}`, icon: 'user-plus', color: 'blue' });
        UI.showToast('Cliente cadastrado com sucesso!', 'success');
        renderClientsPage(document.getElementById('mainContent'));
        lucide.createIcons();
    });
}

function renderProductionPage(container) {
    const productions = DataStore.getProduction();
    const clients = DataStore.getClients();
    
    container.innerHTML = `
        <div class="content-header">
            <div><h1>Controle de Produção</h1><p>Acompanhe a produção de todas as propriedades</p></div>
            <button class="btn-primary" onclick="showAddProductionModal()">
                <i data-lucide="plus"></i> Registrar Produção
            </button>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                <div class="stat-content">
                    <h4>Produção Total</h4>
                    <div class="value">${UI.formatNumber(productions.reduce((sum, p) => sum + p.quantity, 0))}</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>Sacas</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper">
                    <i data-lucide="package"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                <div class="stat-content">
                    <h4>Propriedades Ativas</h4>
                    <div class="value">${clients.filter(c => c.status === 'active').length}</div>
                    <div class="stat-change">
                        <i data-lucide="map-pin"></i>
                        <span>Em operação</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #3498db; background: rgba(52, 152, 219, 0.1);">
                    <i data-lucide="home"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                <div class="stat-content">
                    <h4>Área Plantada</h4>
                    <div class="value">${UI.formatNumber(clients.reduce((sum, c) => sum + c.area, 0))}</div>
                    <div class="stat-change">
                        <i data-lucide="maximize-2"></i>
                        <span>Hectares</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #f39c12; background: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="crop"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #9b59b6; --accent-color-bg: rgba(155, 89, 182, 0.1);">
                <div class="stat-content">
                    <h4>Produtividade Média</h4>
                    <div class="value">${(productions.reduce((sum, p) => sum + p.quantity, 0) / clients.reduce((sum, c) => sum + c.area, 0) || 0).toFixed(1)}</div>
                    <div class="stat-change">
                        <i data-lucide="activity"></i>
                        <span>Sacas/ha</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #9b59b6; background: rgba(155, 89, 182, 0.1);">
                    <i data-lucide="bar-chart-2"></i>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Registros de Produção</h3>
                <div class="table-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Buscar produções..." id="production-search">
                    </div>
                    <div class="filter-group">
                        <button class="filter-btn active" data-filter="all">Todos</button>
                        <button class="filter-btn" data-filter="harvest">Colheita</button>
                        <button class="filter-btn" data-filter="planting">Plantio</button>
                    </div>
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Cultura</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Área (ha)</th>
                        <th>Qualidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="production-tbody">
                    ${productions.length > 0 ? productions.map(prod => {
                        const client = clients.find(c => c.id === prod.clientId);
                        return `
                            <tr>
                                <td>${new Date(prod.date).toLocaleDateString('pt-BR')}</td>
                                <td>${client ? client.name : 'N/A'}</td>
                                <td>${prod.crop}</td>
                                <td><span class="status-badge ${prod.type === 'harvest' ? 'active' : 'pending'}">${prod.type === 'harvest' ? 'Colheita' : 'Plantio'}</span></td>
                                <td style="font-weight: 600;">${UI.formatNumber(prod.quantity)} sacas</td>
                                <td>${prod.area} ha</td>
                                <td><span class="status-badge ${prod.quality}">${getQualityLabel(prod.quality)}</span></td>
                                <td>
                                    <div class="table-actions-cell">
                                        <button class="icon-btn" onclick="editProduction(${prod.id})" title="Editar">
                                            <i data-lucide="edit"></i>
                                        </button>
                                        <button class="icon-btn danger" onclick="deleteProduction(${prod.id})" title="Excluir">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('') : `
                        <tr>
                            <td colspan="8">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i data-lucide="sprout"></i></div>
                                    <h3>Nenhuma produção registrada</h3>
                                    <p>Comece registrando a produção das propriedades</p>
                                    <button class="btn-primary" onclick="showAddProductionModal()">
                                        <i data-lucide="plus"></i> Registrar Produção
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
    
    lucide.createIcons();
}

function showAddProductionModal() {
    const clients = DataStore.getClients();
    
    const content = `
        <form id="add-production-form" class="modal-form">
            <div class="input-group">
                <label>Cliente <span class="required">*</span></label>
                <select id="production-client" class="input-field" required>
                    <option value="">Selecione o cliente...</option>
                    ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Cultura <span class="required">*</span></label>
                    <input type="text" id="production-crop" class="input-field" required placeholder="Ex: Café Arábica">
                </div>
                
                <div class="input-group">
                    <label>Tipo <span class="required">*</span></label>
                    <select id="production-type" class="input-field" required>
                        <option value="">Selecione...</option>
                        <option value="planting">Plantio</option>
                        <option value="harvest">Colheita</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Data <span class="required">*</span></label>
                    <input type="date" id="production-date" class="input-field" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="input-group">
                    <label>Quantidade (sacas) <span class="required">*</span></label>
                    <input type="number" id="production-quantity" class="input-field" required placeholder="0" step="1" min="0">
                </div>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Área (hectares) <span class="required">*</span></label>
                    <input type="number" id="production-area" class="input-field" required placeholder="0" step="0.1" min="0">
                </div>
                
                <div class="input-group">
                    <label>Qualidade <span class="required">*</span></label>
                    <select id="production-quality" class="input-field" required>
                        <option value="">Selecione...</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <label>Observações</label>
                <textarea id="production-notes" class="input-field" placeholder="Informações adicionais sobre a produção..."></textarea>
            </div>
        </form>
    `;
    
    UI.showModal('Registrar Produção', content, () => {
        const production = {
            clientId: parseInt(document.getElementById('production-client').value),
            crop: document.getElementById('production-crop').value,
            type: document.getElementById('production-type').value,
            date: document.getElementById('production-date').value,
            quantity: parseFloat(document.getElementById('production-quantity').value),
            area: parseFloat(document.getElementById('production-area').value),
            quality: document.getElementById('production-quality').value,
            notes: document.getElementById('production-notes').value || null
        };
        
        DataStore.addProduction(production);
        DataStore.addActivity({
            type: 'production',
            title: `${production.type === 'harvest' ? 'Colheita' : 'Plantio'} registrado`,
            description: `${production.crop} - ${production.quantity} sacas`,
            icon: production.type === 'harvest' ? 'package' : 'sprout',
            color: 'green'
        });
        UI.showToast('Produção registrada com sucesso!', 'success');
        renderProductionPage(document.getElementById('mainContent'));
        lucide.createIcons();
    });
}

function getQualityLabel(quality) {
    const labels = { high: 'Alta', medium: 'Média', low: 'Baixa' };
    return labels[quality] || quality;
}

function renderInventoryPage(container) {
    const inventory = DataStore.getInventory();
    const categories = DataStore.getInventoryCategories();
    
    container.innerHTML = `
        <div class="content-header">
            <div><h1>Controle de Estoque</h1><p>Gerencie insumos e materiais</p></div>
            <button class="btn-primary" onclick="showAddInventoryModal()">
                <i data-lucide="plus"></i> Adicionar Item
            </button>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                <div class="stat-content">
                    <h4>Total de Itens</h4>
                    <div class="value">${inventory.length}</div>
                    <div class="stat-change">
                        <i data-lucide="package"></i>
                        <span>Em estoque</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #3498db; background: rgba(52, 152, 219, 0.1);">
                    <i data-lucide="box"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #e74c3c; --accent-color-bg: rgba(231, 76, 60, 0.1);">
                <div class="stat-content">
                    <h4>Estoque Baixo</h4>
                    <div class="value">${inventory.filter(i => i.quantity <= i.minQuantity).length}</div>
                    <div class="stat-change negative">
                        <i data-lucide="alert-triangle"></i>
                        <span>Atenção</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #e74c3c; background: rgba(231, 76, 60, 0.1);">
                    <i data-lucide="alert-circle"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                <div class="stat-content">
                    <h4>Valor Total</h4>
                    <div class="value">${UI.formatCurrency(inventory.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0))}</div>
                    <div class="stat-change">
                        <i data-lucide="dollar-sign"></i>
                        <span>Investido</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper">
                    <i data-lucide="trending-up"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                <div class="stat-content">
                    <h4>Categorias</h4>
                    <div class="value">${categories.length}</div>
                    <div class="stat-change">
                        <i data-lucide="folder"></i>
                        <span>Classificadas</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #f39c12; background: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="layers"></i>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Itens do Estoque</h3>
                <div class="table-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Buscar itens..." id="inventory-search">
                    </div>
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                        <th>Preço Unit.</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="inventory-tbody">
                    ${inventory.length > 0 ? inventory.map(item => {
                        const status = item.quantity <= item.minQuantity ? 'low' : item.quantity <= item.minQuantity * 2 ? 'medium' : 'high';
                        const total = item.quantity * item.unitPrice;
                        return `
                            <tr>
                                <td style="font-weight: 600;">${item.name}</td>
                                <td>${item.category}</td>
                                <td style="font-weight: 600;">${UI.formatNumber(item.quantity)}</td>
                                <td>${item.unit}</td>
                                <td>${UI.formatCurrency(item.unitPrice)}</td>
                                <td style="font-weight: 600;">${UI.formatCurrency(total)}</td>
                                <td><span class="status-badge ${status}">${status === 'low' ? 'Baixo' : status === 'medium' ? 'Médio' : 'Normal'}</span></td>
                                <td>
                                    <div class="table-actions-cell">
                                        <button class="icon-btn" onclick="editInventoryItem(${item.id})" title="Editar">
                                            <i data-lucide="edit"></i>
                                        </button>
                                        <button class="icon-btn danger" onclick="deleteInventoryItem(${item.id})" title="Excluir">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('') : `
                        <tr>
                            <td colspan="8">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i data-lucide="package-x"></i></div>
                                    <h3>Estoque vazio</h3>
                                    <p>Comece adicionando itens ao seu estoque</p>
                                    <button class="btn-primary" onclick="showAddInventoryModal()">
                                        <i data-lucide="plus"></i> Adicionar Item
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
    
    lucide.createIcons();
}

function showAddInventoryModal() {
    const categories = DataStore.getInventoryCategories();
    
    const content = `
        <form id="add-inventory-form" class="modal-form">
            <div class="input-group">
                <label>Nome do Item <span class="required">*</span></label>
                <input type="text" id="inventory-name" class="input-field" required placeholder="Ex: Fertilizante NPK 20-05-20">
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Categoria <span class="required">*</span></label>
                    <select id="inventory-category" class="input-field" required>
                        <option value="">Selecione...</option>
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                
                <div class="input-group">
                    <label>Unidade <span class="required">*</span></label>
                    <select id="inventory-unit" class="input-field" required>
                        <option value="">Selecione...</option>
                        <option value="kg">Quilograma (kg)</option>
                        <option value="L">Litro (L)</option>
                        <option value="sc">Saca (sc)</option>
                        <option value="un">Unidade (un)</option>
                        <option value="cx">Caixa (cx)</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Quantidade <span class="required">*</span></label>
                    <input type="number" id="inventory-quantity" class="input-field" required placeholder="0" step="0.01" min="0">
                </div>
                
                <div class="input-group">
                    <label>Quantidade Mínima <span class="required">*</span></label>
                    <input type="number" id="inventory-min" class="input-field" required placeholder="0" step="0.01" min="0">
                </div>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Preço Unitário <span class="required">*</span></label>
                    <input type="number" id="inventory-price" class="input-field" required placeholder="0.00" step="0.01" min="0">
                </div>
                
                <div class="input-group">
                    <label>Fornecedor</label>
                    <input type="text" id="inventory-supplier" class="input-field" placeholder="Nome do fornecedor">
                </div>
            </div>
            
            <div class="input-group">
                <label>Observações</label>
                <textarea id="inventory-notes" class="input-field" placeholder="Informações adicionais..."></textarea>
            </div>
        </form>
    `;
    
    UI.showModal('Adicionar Item ao Estoque', content, () => {
        const item = {
            name: document.getElementById('inventory-name').value,
            category: document.getElementById('inventory-category').value,
            unit: document.getElementById('inventory-unit').value,
            quantity: parseFloat(document.getElementById('inventory-quantity').value),
            minQuantity: parseFloat(document.getElementById('inventory-min').value),
            unitPrice: parseFloat(document.getElementById('inventory-price').value),
            supplier: document.getElementById('inventory-supplier').value || null,
            notes: document.getElementById('inventory-notes').value || null
        };
        
        DataStore.addInventoryItem(item);
        UI.showToast('Item adicionado ao estoque!', 'success');
        renderInventoryPage(document.getElementById('mainContent'));
        lucide.createIcons();
    });
}

function renderFinancialPage(container) {
    const records = DataStore.getFinancialRecords();
    const categories = DataStore.getFinancialCategories();
    
    const totalRevenue = records.filter(r => r.type === 'revenue' && r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense' && r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const pending = records.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
    const balance = totalRevenue - totalExpense;
    
    container.innerHTML = `
        <div class="content-header">
            <div><h1>Gestão Financeira</h1><p>Controle de receitas e despesas</p></div>
            <div style="display: flex; gap: 12px;">
                <button class="btn-success" onclick="showAddFinancialModal('revenue')">
                    <i data-lucide="trending-up"></i> Nova Receita
                </button>
                <button class="btn-danger" onclick="showAddFinancialModal('expense')">
                    <i data-lucide="trending-down"></i> Nova Despesa
                </button>
            </div>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                <div class="stat-content">
                    <h4>Receitas</h4>
                    <div class="value">${UI.formatCurrency(totalRevenue)}</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>Este mês</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper">
                    <i data-lucide="arrow-up-circle"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #e74c3c; --accent-color-bg: rgba(231, 76, 60, 0.1);">
                <div class="stat-content">
                    <h4>Despesas</h4>
                    <div class="value">${UI.formatCurrency(totalExpense)}</div>
                    <div class="stat-change negative">
                        <i data-lucide="trending-down"></i>
                        <span>Este mês</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #e74c3c; background: rgba(231, 76, 60, 0.1);">
                    <i data-lucide="arrow-down-circle"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: ${balance >= 0 ? '#2ecc71' : '#e74c3c'}; --accent-color-bg: ${balance >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};">
                <div class="stat-content">
                    <h4>Saldo</h4>
                    <div class="value">${UI.formatCurrency(balance)}</div>
                    <div class="stat-change ${balance >= 0 ? 'positive' : 'negative'}">
                        <i data-lucide="${balance >= 0 ? 'trending-up' : 'trending-down'}"></i>
                        <span>${balance >= 0 ? 'Positivo' : 'Negativo'}</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: ${balance >= 0 ? '#2ecc71' : '#e74c3c'}; background: ${balance >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};">
                    <i data-lucide="wallet"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                <div class="stat-content">
                    <h4>Pendentes</h4>
                    <div class="value">${UI.formatCurrency(pending)}</div>
                    <div class="stat-change">
                        <i data-lucide="clock"></i>
                        <span>A receber/pagar</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="color: #f39c12; background: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="hourglass"></i>
                </div>
            </div>
        </div>
        
        <div class="tabs-container">
            <div class="tabs-nav">
                <button class="tab-btn active" data-tab="all">Todos</button>
                <button class="tab-btn" data-tab="revenue">Receitas</button>
                <button class="tab-btn" data-tab="expense">Despesas</button>
                <button class="tab-btn" data-tab="pending">Pendentes</button>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Lançamentos Financeiros</h3>
                <div class="table-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Buscar lançamentos..." id="financial-search">
                    </div>
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="financial-tbody">
                    ${records.length > 0 ? records.map(record => `
                        <tr>
                            <td>${new Date(record.date).toLocaleDateString('pt-BR')}</td>
                            <td>${record.description}</td>
                            <td>${record.category}</td>
                            <td>
                                <span class="status-badge ${record.type === 'revenue' ? 'active' : 'inactive'}">
                                    ${record.type === 'revenue' ? 'Receita' : 'Despesa'}
                                </span>
                            </td>
                            <td style="font-weight: 600; color: ${record.type === 'revenue' ? 'var(--primary)' : '#e74c3c'}">
                                ${record.type === 'revenue' ? '+' : '-'} ${UI.formatCurrency(record.amount)}
                            </td>
                            <td><span class="status-badge ${record.status}">${getStatusLabel(record.status)}</span></td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" onclick="editFinancialRecord(${record.id})" title="Editar">
                                        <i data-lucide="edit"></i>
                                    </button>
                                    <button class="icon-btn danger" onclick="deleteFinancialRecord(${record.id})" title="Excluir">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="7">
                                <div class="empty-state">
                                    <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
                                    <h3>Nenhum lançamento encontrado</h3>
                                    <p>Comece adicionando suas receitas e despesas</p>
                                </div>
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
    
    setupFinancialTabs();
    lucide.createIcons();
}

function setupFinancialTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tbody = document.getElementById('financial-tbody');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterFinancialTable(btn.dataset.tab);
        });
    });
}

function filterFinancialTable(filter) {
    const records = DataStore.getFinancialRecords();
    let filtered = records;
    
    if (filter === 'revenue') filtered = records.filter(r => r.type === 'revenue');
    else if (filter === 'expense') filtered = records.filter(r => r.type === 'expense');
    else if (filter === 'pending') filtered = records.filter(r => r.status === 'pending');
    
    const tbody = document.getElementById('financial-tbody');
    tbody.innerHTML = filtered.length > 0 ? filtered.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString('pt-BR')}</td>
            <td>${record.description}</td>
            <td>${record.category}</td>
            <td>
                <span class="status-badge ${record.type === 'revenue' ? 'active' : 'inactive'}">
                    ${record.type === 'revenue' ? 'Receita' : 'Despesa'}
                </span>
            </td>
            <td style="font-weight: 600; color: ${record.type === 'revenue' ? 'var(--primary)' : '#e74c3c'}">
                ${record.type === 'revenue' ? '+' : '-'} ${UI.formatCurrency(record.amount)}
            </td>
            <td><span class="status-badge ${record.status}">${getStatusLabel(record.status)}</span></td>
            <td>
                <div class="table-actions-cell">
                    <button class="icon-btn" onclick="editFinancialRecord(${record.id})" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="icon-btn danger" onclick="deleteFinancialRecord(${record.id})" title="Excluir">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="7">
                <div class="empty-state">
                    <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
                    <h3>Nenhum lançamento encontrado</h3>
                    <p>Nenhum registro encontrado para este filtro</p>
                </div>
            </td>
        </tr>
    `;
    lucide.createIcons();
}

function showAddFinancialModal(type) {
    const categories = DataStore.getFinancialCategories();
    const typeLabel = type === 'revenue' ? 'Receita' : 'Despesa';
    const categoryOptions = categories[type];
    
    const content = `
        <form id="add-financial-form" class="modal-form">
            <div class="input-group">
                <label>Descrição <span class="required">*</span></label>
                <input type="text" id="financial-description" class="input-field" required placeholder="Ex: Venda de café">
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Categoria <span class="required">*</span></label>
                    <select id="financial-category" class="input-field" required>
                        <option value="">Selecione...</option>
                        ${categoryOptions.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                
                <div class="input-group">
                    <label>Data <span class="required">*</span></label>
                    <input type="date" id="financial-date" class="input-field" required value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>Valor <span class="required">*</span></label>
                    <input type="number" id="financial-amount" class="input-field" required placeholder="0.00" step="0.01" min="0">
                </div>
                
                <div class="input-group">
                    <label>Status <span class="required">*</span></label>
                    <select id="financial-status" class="input-field" required>
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <label>Cliente/Fornecedor</label>
                <input type="text" id="financial-entity" class="input-field" placeholder="Opcional">
            </div>
            
            <div class="input-group">
                <label>Observações</label>
                <textarea id="financial-notes" class="input-field" placeholder="Informações adicionais..."></textarea>
            </div>
        </form>
    `;
    
    UI.showModal(`Nova ${typeLabel}`, content, () => {
        const record = {
            type: type,
            description: document.getElementById('financial-description').value,
            category: document.getElementById('financial-category').value,
            date: document.getElementById('financial-date').value,
            amount: parseFloat(document.getElementById('financial-amount').value),
            status: document.getElementById('financial-status').value,
            entity: document.getElementById('financial-entity').value || null,
            notes: document.getElementById('financial-notes').value || null
        };
        
        DataStore.addFinancialRecord(record);
        UI.showToast(`${typeLabel} adicionada com sucesso!`, 'success');
        renderFinancialPage(document.getElementById('mainContent'));
        lucide.createIcons();
    });
}

function getStatusLabel(status) {
    const labels = { paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado' };
    return labels[status] || status;
}

function initializeCharts() {
    initProductionChart();
    initCostsChart();
}

let productionChartInstance = null;
let costsChartInstance = null;

function initProductionChart() {
    const canvas = document.getElementById('productionChart');
    if (!canvas) return;
    
    if (productionChartInstance) {
        productionChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Produção (ton)',
            data: [850, 920, 1100, 1350, 1520, 1680, 1850, 2100, 2350, 2580, 2750, 2900],
            backgroundColor: 'rgba(46, 204, 113, 0.8)',
            borderColor: 'rgba(39, 174, 96, 1)',
            borderWidth: 2,
            borderRadius: 6,
            barThickness: 'flex',
            maxBarThickness: 40
        }]
    };
    
    productionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString('pt-BR') + ' toneladas';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(139, 149, 165, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b95a5',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value.toLocaleString('pt-BR');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b95a5',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initCostsChart() {
    const canvas = document.getElementById('costsChart');
    if (!canvas) return;
    
    if (costsChartInstance) {
        costsChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['Insumos', 'Mão de obra', 'Equipamentos', 'Outros'],
        datasets: [{
            data: [42, 31, 18, 9],
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(243, 156, 18, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)'
            ],
            borderColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(243, 156, 18, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(155, 89, 182, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    costsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#8b95a5',
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}
function renderProfilePage(container) {
    const currentUser = DataStore.getCurrentUser();
    const isConsultant = currentUser.role === 'Consultor';
    const consultant = isConsultant ? DataStore.getConsultantByUserId(currentUser.id) : null;
    const clientData = !isConsultant ? DataStore.getClientByUserId(currentUser.id) : null;
    const clients = isConsultant && consultant ? DataStore.getClientsByConsultant(consultant.id) : [];
    
    let producerConsultant = null;
    let producerConsultantUser = null;
    if (!isConsultant && clientData && clientData.consultantId) {
        const consultants = DataStore.getConsultants();
        producerConsultant = consultants.find(c => c.id === clientData.consultantId);
        if (producerConsultant) {
            producerConsultantUser = DataStore.getUsers().find(u => u.id === producerConsultant.userId);
        }
    }
    
    const production = DataStore.getProduction();
    const financial = DataStore.getFinancialRecords();
    const activities = DataStore.getActivities();
    
    const totalRevenue = financial.filter(f => f.type === 'revenue' && f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = financial.filter(f => f.type === 'expense' && f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalProduction = production.reduce((sum, p) => sum + p.quantity, 0);
    
    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header-card">
                <div class="profile-banner"></div>
                <div class="profile-info-section">
                    <div class="profile-avatar-large">
                        <i data-lucide="user"></i>
                    </div>
                    <div class="profile-details">
                        <h1>${currentUser.name}</h1>
                        <div class="profile-meta">
                            <span class="profile-role ${isConsultant ? 'role-consultant' : 'role-producer'}">
                                <i data-lucide="${isConsultant ? 'briefcase' : 'home'}"></i>
                                ${currentUser.role}
                            </span>
                            <span class="profile-item">
                                <i data-lucide="mail"></i>
                                ${currentUser.email}
                            </span>
                            <span class="profile-item">
                                <i data-lucide="phone"></i>
                                ${currentUser.phone || 'Não informado'}
                            </span>
                            <span class="profile-item">
                                <i data-lucide="calendar"></i>
                                Desde ${new Date(currentUser.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        ${currentUser.bio ? `<p class="profile-bio">${currentUser.bio}</p>` : ''}
                    </div>
                    <button class="btn-secondary" onclick="showEditProfileModal()">
                        <i data-lucide="edit-2"></i> Editar Perfil
                    </button>
                </div>
            </div>
            
            ${isConsultant ? `
                <div class="profile-stats-grid">
                    <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                        <div class="stat-content">
                            <h4>Clientes Ativos</h4>
                            <div class="value">${clients.filter(c => c.status === 'active').length}</div>
                            <div class="stat-change">
                                <i data-lucide="users"></i>
                                <span>Propriedades</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper">
                            <i data-lucide="briefcase"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                        <div class="stat-content">
                            <h4>Área Total Gerenciada</h4>
                            <div class="value">${UI.formatNumber(clients.reduce((sum, c) => sum + c.area, 0))}</div>
                            <div class="stat-change">
                                <i data-lucide="maximize-2"></i>
                                <span>Hectares</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper" style="color: #3498db; background: rgba(52, 152, 219, 0.1);">
                            <i data-lucide="map"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                        <div class="stat-content">
                            <h4>Especialidade</h4>
                            <div class="value" style="font-size: 20px;">${consultant?.specialty || 'Não definida'}</div>
                            <div class="stat-change">
                                <i data-lucide="award"></i>
                                <span>${consultant?.experience || 0} anos de experiência</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper" style="color: #f39c12; background: rgba(243, 156, 18, 0.1);">
                            <i data-lucide="star"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #9b59b6; --accent-color-bg: rgba(155, 89, 182, 0.1);">
                        <div class="stat-content">
                            <h4>Avaliação</h4>
                            <div class="value">${consultant?.rating || '0.0'}</div>
                            <div class="stat-change positive">
                                <i data-lucide="trending-up"></i>
                                <span>Satisfação dos clientes</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper" style="color: #9b59b6; background: rgba(155, 89, 182, 0.1);">
                            <i data-lucide="heart"></i>
                        </div>
                    </div>
                </div>
                
                ${consultant?.certifications && consultant.certifications.length > 0 ? `
                    <div class="profile-section-card">
                        <h3><i data-lucide="award"></i> Certificações e Qualificações</h3>
                        <div class="certifications-list">
                            ${consultant.certifications.map(cert => `
                                <div class="certification-item">
                                    <i data-lucide="check-circle"></i>
                                    <span>${cert}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="profile-section-card">
                    <h3><i data-lucide="users"></i> Meus Clientes</h3>
                    <div class="clients-grid">
                        ${clients.length > 0 ? clients.map(client => `
                            <div class="client-card">
                                <div class="client-header">
                                    <div class="client-avatar">${client.name.charAt(0)}</div>
                                    <div class="client-info">
                                        <h3>${client.name}</h3>
                                        <p>${client.owner}</p>
                                    </div>
                                </div>
                                <div class="client-details">
                                    <div class="detail-item"><i data-lucide="sprout"></i><span>${client.crop}</span></div>
                                    <div class="detail-item"><i data-lucide="map-pin"></i><span>${client.city}, ${client.state}</span></div>
                                    <div class="detail-item"><i data-lucide="maximize-2"></i><span>${client.area} ha</span></div>
                                </div>
                            </div>
                        `).join('') : '<p class="empty-message">Nenhum cliente cadastrado ainda.</p>'}
                    </div>
                </div>
            ` : `
                <div class="profile-stats-grid">
                    <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                        <div class="stat-content">
                            <h4>Minha Propriedade</h4>
                            <div class="value" style="font-size: 20px;">${clientData?.name || 'Não vinculado'}</div>
                            <div class="stat-change">
                                <i data-lucide="home"></i>
                                <span>${clientData?.crop || ''}</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper">
                            <i data-lucide="sprout"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                        <div class="stat-content">
                            <h4>Área Total</h4>
                            <div class="value">${clientData?.area || 0}</div>
                            <div class="stat-change">
                                <i data-lucide="maximize-2"></i>
                                <span>Hectares</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper" style="color: #3498db; background: rgba(52, 152, 219, 0.1);">
                            <i data-lucide="map"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                        <div class="stat-content">
                            <h4>Produção Acumulada</h4>
                            <div class="value">${UI.formatNumber(totalProduction)}</div>
                            <div class="stat-change">
                                <i data-lucide="package"></i>
                                <span>Sacas</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper" style="color: #f39c12; background: rgba(243, 156, 18, 0.1);">
                            <i data-lucide="trending-up"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                        <div class="stat-content">
                            <h4>Saldo Financeiro</h4>
                            <div class="value" style="font-size: 24px;">${UI.formatCurrency(totalRevenue - totalExpense)}</div>
                            <div class="stat-change ${totalRevenue - totalExpense >= 0 ? 'positive' : 'negative'}">
                                <i data-lucide="${totalRevenue - totalExpense >= 0 ? 'trending-up' : 'trending-down'}"></i>
                                <span>Este período</span>
                            </div>
                        </div>
                        <div class="stat-icon-wrapper">
                            <i data-lucide="dollar-sign"></i>
                        </div>
                    </div>
                </div>
                
                ${producerConsultantUser ? `
                    <div class="profile-section-card">
                        <h3><i data-lucide="user-check"></i> Meu Consultor</h3>
                        <div style="display: flex; align-items: flex-start; gap: 24px; padding: 20px; background: var(--sidebar-bg); border-radius: 12px;">
                            <div style="width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, #3498db, #2980b9); display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; flex-shrink: 0;">
                                ${producerConsultantUser.name.charAt(0)}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 8px 0; font-size: 22px; color: var(--text-primary);">${producerConsultantUser.name}</h4>
                                <p style="margin: 0 0 16px 0; color: #3498db; font-weight: 600;">${producerConsultant.specialty || 'Consultor Agrícola'}</p>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                    <div class="info-item">
                                        <i data-lucide="mail"></i>
                                        <div>
                                            <label>E-mail</label>
                                            <span>${producerConsultantUser.email}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <i data-lucide="phone"></i>
                                        <div>
                                            <label>Telefone</label>
                                            <span>${producerConsultantUser.phone || 'Não informado'}</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <i data-lucide="award"></i>
                                        <div>
                                            <label>Experiência</label>
                                            <span>${producerConsultant.experience || 0} anos</span>
                                        </div>
                                    </div>
                                    <div class="info-item">
                                        <i data-lucide="star"></i>
                                        <div>
                                            <label>Avaliação</label>
                                            <span>${producerConsultant.rating || '0.0'} ⭐</span>
                                        </div>
                                    </div>
                                </div>
                                ${producerConsultantUser.bio ? `<p style="margin-top: 16px; color: var(--text-secondary); font-size: 14px; line-height: 1.6;">${producerConsultantUser.bio}</p>` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${clientData ? `
                    <div class="profile-section-card">
                        <h3><i data-lucide="info"></i> Informações da Propriedade</h3>
                        <div class="property-info-grid">
                            <div class="info-item">
                                <i data-lucide="user"></i>
                                <div>
                                    <label>Proprietário</label>
                                    <span>${clientData.owner}</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <i data-lucide="mail"></i>
                                <div>
                                    <label>E-mail</label>
                                    <span>${clientData.email}</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <i data-lucide="phone"></i>
                                <div>
                                    <label>Telefone</label>
                                    <span>${clientData.phone}</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <i data-lucide="map-pin"></i>
                                <div>
                                    <label>Localização</label>
                                    <span>${clientData.city}, ${clientData.state}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `}
            
            <div class="profile-section-card">
                <h3><i data-lucide="activity"></i> Atividades Recentes</h3>
                <div class="activity-list">
                    ${activities.slice(0, 5).map(activity => `
                        <div class="activity-item">
                            <div class="activity-icon bg-${activity.color}">
                                <i data-lucide="${activity.icon}"></i>
                            </div>
                            <div class="activity-content">
                                <h4>${activity.title}</h4>
                                <p>${activity.description}</p>
                                <span class="time">${UI.formatDate(activity.date)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function showEditProfileModal() {
    const currentUser = DataStore.getCurrentUser();
    
    const content = `
        <form id="edit-profile-form" class="modal-form">
            <div class="input-group">
                <label>Nome Completo <span class="required">*</span></label>
                <input type="text" id="profile-name" class="input-field" required value="${currentUser.name}">
            </div>
            
            <div class="input-group-row">
                <div class="input-group">
                    <label>E-mail <span class="required">*</span></label>
                    <input type="email" id="profile-email" class="input-field" required value="${currentUser.email}">
                </div>
                
                <div class="input-group">
                    <label>Telefone</label>
                    <input type="tel" id="profile-phone" class="input-field" value="${currentUser.phone || ''}" placeholder="(00) 00000-0000">
                </div>
            </div>
            
            <div class="input-group">
                <label>Biografia</label>
                <textarea id="profile-bio" class="input-field" placeholder="Conte um pouco sobre você...">${currentUser.bio || ''}</textarea>
            </div>
            
            <div class="input-group">
                <label>Nova Senha</label>
                <input type="password" id="profile-password" class="input-field" placeholder="Deixe em branco para não alterar">
            </div>
        </form>
    `;
    
    UI.showModal('Editar Perfil', content, () => {
        const updatedData = {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            bio: document.getElementById('profile-bio').value
        };
        
        const newPassword = document.getElementById('profile-password').value;
        if (newPassword) {
            updatedData.password = newPassword;
        }
        
        DataStore.updateUser(currentUser.id, updatedData);
        UI.showToast('Perfil atualizado com sucesso!', 'success');
        renderProfilePage(document.getElementById('mainContent'));
        updateUserInfo();
        lucide.createIcons();
    });
}

function renderReportsPage(container) {
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>📊 Relatórios</h1>
                <p>Análises e relatórios completos da sua operação</p>
            </div>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Relatórios Gerados</h4>
                    <div class="value">24</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>+15% este mês</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                    <i data-lucide="file-text"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Período Analisado</h4>
                    <div class="value" style="font-size: 20px;">Últimos 12 meses</div>
                    <div class="stat-change">
                        <i data-lucide="calendar"></i>
                        <span>Jan 2024 - Dez 2024</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #9b59b6; --accent-color-bg: rgba(155, 89, 182, 0.1);">
                    <i data-lucide="calendar-range"></i>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Relatórios Disponíveis</h3>
                <div class="table-actions">
                    <select class="filter-btn" style="padding: 10px 16px;">
                        <option>Todos os Tipos</option>
                        <option>Financeiro</option>
                        <option>Produção</option>
                        <option>Estoque</option>
                        <option>Geral</option>
                    </select>
                    <button class="btn-primary" onclick="generateReport()">
                        <i data-lucide="download"></i>
                        Gerar Novo Relatório
                    </button>
                </div>
            </div>
            
            <div class="reports-grid" style="padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
                <div class="report-card">
                    <div class="report-icon" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(52, 152, 219, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="dollar-sign" style="width: 28px; height: 28px; color: #3498db;"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Relatório Financeiro</h4>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Análise completa de receitas, despesas e fluxo de caixa</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="status-badge active">Mensal</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Última atualização: hoje</span>
                    </div>
                    <button class="btn-secondary" style="width: 100%;" onclick="downloadReport('financial')">
                        <i data-lucide="download"></i>
                        Baixar PDF
                    </button>
                </div>
                
                <div class="report-card">
                    <div class="report-icon" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(46, 204, 113, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="package" style="width: 28px; height: 28px; color: #2ecc71;"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Relatório de Produção</h4>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Volume produzido, qualidade e comparativos sazonais</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="status-badge high">Semanal</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Última atualização: 2 dias</span>
                    </div>
                    <button class="btn-secondary" style="width: 100%;" onclick="downloadReport('production')">
                        <i data-lucide="download"></i>
                        Baixar PDF
                    </button>
                </div>
                
                <div class="report-card">
                    <div class="report-icon" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(243, 156, 18, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="archive" style="width: 28px; height: 28px; color: #f39c12;"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Relatório de Estoque</h4>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Inventário atual, movimentações e alertas de reposição</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="status-badge medium">Mensal</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Última atualização: 5 dias</span>
                    </div>
                    <button class="btn-secondary" style="width: 100%;" onclick="downloadReport('inventory')">
                        <i data-lucide="download"></i>
                        Baixar PDF
                    </button>
                </div>
                
                <div class="report-card">
                    <div class="report-icon" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(155, 89, 182, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="bar-chart-3" style="width: 28px; height: 28px; color: #9b59b6;"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Relatório Geral</h4>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Visão consolidada de todas as áreas da operação</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="status-badge active">Trimestral</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Última atualização: hoje</span>
                    </div>
                    <button class="btn-secondary" style="width: 100%;" onclick="downloadReport('general')">
                        <i data-lucide="download"></i>
                        Baixar PDF
                    </button>
                </div>
                
                <div class="report-card">
                    <div class="report-icon" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(231, 76, 60, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <i data-lucide="users" style="width: 28px; height: 28px; color: #e74c3c;"></i>
                    </div>
                    <h4 style="margin: 0 0 8px 0; font-size: 18px;">Relatório de Clientes</h4>
                    <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Performance por cliente e análise de rentabilidade</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="status-badge high">Mensal</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Última atualização: 1 semana</span>
                    </div>
                    <button class="btn-secondary" style="width: 100%;" onclick="downloadReport('clients')">
                        <i data-lucide="download"></i>
                        Baixar PDF
                    </button>
                </div>
                
                <div class="report-card" style="border: 2px dashed var(--border-color); background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; cursor: pointer;" onclick="generateReport()">
                    <i data-lucide="plus-circle" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 16px;"></i>
                    <h4 style="margin: 0 0 8px 0; font-size: 16px; color: var(--primary);">Gerar Novo Relatório</h4>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 13px; text-align: center;">Personalize e crie relatórios customizados</p>
                </div>
            </div>
        </div>
    `;
}

function generateReport() {
    UI.showToast('Funcionalidade em desenvolvimento: Gerador de relatórios personalizados', 'info');
}

function downloadReport(type) {
    UI.showToast(`Download do relatório de ${type} iniciado!`, 'success');
}

function renderWeatherPage(container) {
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>🌤️ Previsão do Tempo</h1>
                <p>Acompanhe as condições climáticas e planeje suas atividades</p>
            </div>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Temperatura Atual</h4>
                    <div class="value">28°C</div>
                    <div class="stat-change">
                        <i data-lucide="thermometer"></i>
                        <span>Sensação térmica: 30°C</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="sun"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Umidade</h4>
                    <div class="value">65%</div>
                    <div class="stat-change">
                        <i data-lucide="droplets"></i>
                        <span>Ideal para plantio</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #3498db; --accent-color-bg: rgba(52, 152, 219, 0.1);">
                    <i data-lucide="cloud-rain"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Vento</h4>
                    <div class="value">12 km/h</div>
                    <div class="stat-change">
                        <i data-lucide="wind"></i>
                        <span>Direção: Nordeste</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #1abc9c; --accent-color-bg: rgba(26, 188, 156, 0.1);">
                    <i data-lucide="navigation"></i>
                </div>
            </div>
        </div>
        
        <div class="chart-card">
            <div class="card-header">
                <div>
                    <h3>Previsão de 7 Dias</h3>
                    <p>Cacoal, RO</p>
                </div>
                <button class="btn-secondary btn-sm">
                    <i data-lucide="map-pin"></i>
                    Alterar Localização
                </button>
            </div>
            
            <div class="weather-forecast" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-top: 20px;">
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Hoje</p>
                            <i data-lucide="sun" style="width: 32px; height: 32px; color: #f39c12; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">28°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">20°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Sáb</p>
                            <i data-lucide="cloud" style="width: 32px; height: 32px; color: #95a5a6; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">26°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">19°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Dom</p>
                            <i data-lucide="cloud-rain" style="width: 32px; height: 32px; color: #3498db; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">24°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">18°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Seg</p>
                            <i data-lucide="cloud-drizzle" style="width: 32px; height: 32px; color: #3498db; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">22°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">17°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Ter</p>
                            <i data-lucide="cloud-sun" style="width: 32px; height: 32px; color: #f39c12; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">25°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">18°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Qua</p>
                            <i data-lucide="sun" style="width: 32px; height: 32px; color: #f39c12; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">27°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">19°</p>
                        </div>
                    </div>
                    
                    <div class="forecast-day-card">
                        <div style="text-align: center; padding: 16px 12px; background: var(--sidebar-bg); border-radius: 12px;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); font-weight: 600;">Qui</p>
                            <i data-lucide="sun" style="width: 32px; height: 32px; color: #f39c12; margin: 0 auto 10px;"></i>
                            <p style="margin: 0; font-size: 22px; font-weight: 700;">29°</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text-muted);">21°</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-card">
            <div class="card-header">
                <div>
                    <h3>Alertas</h3>
                    <p>Condições importantes</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 20px;">
                    <div style="padding: 16px; background: rgba(243, 156, 18, 0.1); border-left: 4px solid #f39c12; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <i data-lucide="alert-triangle" style="width: 20px; height: 20px; color: #f39c12;"></i>
                            <strong style="color: #f39c12;">Atenção: Chuva</strong>
                        </div>
                        <p style="margin: 0; font-size: 13px; color: var(--text-secondary);">Possibilidade de chuva no domingo (40% de chance)</p>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(46, 204, 113, 0.1); border-left: 4px solid #2ecc71; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <i data-lucide="check-circle" style="width: 20px; height: 20px; color: #2ecc71;"></i>
                            <strong style="color: #2ecc71;">Condições Ideais</strong>
                        </div>
                        <p style="margin: 0; font-size: 13px; color: var(--text-secondary);">Clima favorável para colheita hoje e amanhã</p>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(52, 152, 219, 0.1); border-left: 4px solid #3498db; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <i data-lucide="droplets" style="width: 20px; height: 20px; color: #3498db;"></i>
                            <strong style="color: #3498db;">Irrigação</strong>
                        </div>
                        <p style="margin: 0; font-size: 13px; color: var(--text-secondary);">Recomenda-se irrigação para os próximos 3 dias</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-card">
            <div class="card-header">
                <div>
                    <h3>Histórico de Precipitação</h3>
                    <p>Últimos 30 dias</p>
                </div>
                <button class="btn-secondary btn-sm">
                    <i data-lucide="download"></i>
                    Exportar Dados
                </button>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; background: var(--sidebar-bg); border-radius: 12px;">
                <div class="precipitation-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 16px;">
                    <div>
                        <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">Precipitação Total</p>
                        <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: 700;">127 mm</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">Dias de Chuva</p>
                        <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: 700;">8 dias</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">Média Diária</p>
                        <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: 700;">4.2 mm</p>
                    </div>
                </div>
                <div style="height: 200px; display: flex; align-items: flex-end; gap: 4px;">
                    ${Array.from({length: 30}, (_, i) => {
                        const height = Math.random() * 100;
                        return `<div style="flex: 1; background: linear-gradient(180deg, #3498db 0%, #2980b9 100%); border-radius: 4px 4px 0 0; height: ${height}%; min-height: 2px; opacity: ${height > 50 ? 1 : 0.5};"></div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderMarketPage(container) {
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>📈 Cotações do Mercado</h1>
                <p>Acompanhe os preços de commodities agrícolas em tempo real</p>
            </div>
            <button class="btn-secondary" onclick="refreshMarketData()">
                <i data-lucide="refresh-cw"></i>
                Atualizar
            </button>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Café Arábica</h4>
                    <div class="value">R$ 1.287,50</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>+3.2% hoje</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #8b4513; --accent-color-bg: rgba(139, 69, 19, 0.1);">
                    <i data-lucide="coffee"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Soja (Saca 60kg)</h4>
                    <div class="value">R$ 142,80</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>+1.8% hoje</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                    <i data-lucide="sprout"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Milho (Saca 60kg)</h4>
                    <div class="value">R$ 68,90</div>
                    <div class="stat-change negative">
                        <i data-lucide="trending-down"></i>
                        <span>-0.5% hoje</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="wheat"></i>
                </div>
            </div>
        </div>
        
        <div class="charts-row" >
            <div class="chart-card">
                <div class="card-header">
                    <div>
                        <h3>Variação de Preços - Últimos 30 Dias</h3>
                        <p>Comparativo de commodities principais</p>
                    </div>
                    <select class="select-filter" id="commoditySelect">
                        <option value="coffee">Café Arábica</option>
                        <option value="soy">Soja</option>
                        <option value="corn">Milho</option>
                        <option value="wheat">Trigo</option>
                        <option value="cotton">Algodão</option>
                    </select>
                </div>
                <div style="margin-top: 20px; padding: 20px; background: var(--sidebar-bg); border-radius: 12px;">
                    <div style="height: 300px; display: flex; align-items: flex-end; gap: 2px; position: relative;">
                        ${Array.from({length: 30}, (_, i) => {
                            const baseHeight = 50;
                            const variation = Math.sin(i * 0.3) * 25 + Math.random() * 15;
                            const height = baseHeight + variation;
                            const isUp = i === 0 ? true : height > (baseHeight + Math.sin((i-1) * 0.3) * 25);
                            return `<div style="flex: 1; background: linear-gradient(180deg, ${isUp ? '#2ecc71' : '#e74c3c'} 0%, ${isUp ? '#27ae60' : '#c0392b'} 100%); border-radius: 4px 4px 0 0; height: ${height}%; min-height: 2px; transition: all 0.3s;"></div>`;
                        }).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: var(--text-muted);">
                        <span>30 dias atrás</span>
                        <span>Hoje</span>
                    </div>
                </div>
            </div>
            
            <div class="chart-card">
                <div class="card-header">
                    <div>
                        <h3>Índices</h3>
                        <p>Indicadores econômicos</p>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
                    <div style="padding: 16px; background: var(--sidebar-bg); border-radius: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="margin: 0 0 4px 0; font-size: 13px; color: var(--text-secondary);">Dólar (USD/BRL)</p>
                                <p style="margin: 0; font-size: 20px; font-weight: 700;">R$ 5,82</p>
                            </div>
                            <span style="color: #e74c3c; font-size: 14px; font-weight: 600;">+0.8%</span>
                        </div>
                    </div>
                    
                    <div style="padding: 16px; background: var(--sidebar-bg); border-radius: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="margin: 0 0 4px 0; font-size: 13px; color: var(--text-secondary);">Ibovespa</p>
                                <p style="margin: 0; font-size: 20px; font-weight: 700;">126.543</p>
                            </div>
                            <span style="color: #2ecc71; font-size: 14px; font-weight: 600;">+1.2%</span>
                        </div>
                    </div>
                    
                    <div style="padding: 16px; background: var(--sidebar-bg); border-radius: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="margin: 0 0 4px 0; font-size: 13px; color: var(--text-secondary);">IPCA (Anual)</p>
                                <p style="margin: 0; font-size: 20px; font-weight: 700;">4,32%</p>
                            </div>
                            <span style="color: #f39c12; font-size: 14px; font-weight: 600;">-0.2%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Cotações Detalhadas</h3>
                <div class="table-actions">
                    <div class="search-box">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Buscar commodity..." id="marketSearch">
                    </div>
                    <button class="btn-secondary btn-sm" onclick="exportMarketData()">
                        <i data-lucide="download"></i>
                        Exportar
                    </button>
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Commodity</th>
                        <th>Preço Atual</th>
                        <th>Variação Dia</th>
                        <th>Variação Semana</th>
                        <th>Variação Mês</th>
                        <th>Máxima 52s</th>
                        <th>Mínima 52s</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>☕ Café Arábica (60kg)</strong></td>
                        <td><strong>R$ 1.287,50</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+3.2%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+5.8%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+12.4%</span></td>
                        <td>R$ 1.420,00</td>
                        <td>R$ 980,50</td>
                        <td>45.2k</td>
                    </tr>
                    <tr>
                        <td><strong>🌱 Soja (60kg)</strong></td>
                        <td><strong>R$ 142,80</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+1.8%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+2.3%</span></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-1.2%</span></td>
                        <td>R$ 156,90</td>
                        <td>R$ 128,40</td>
                        <td>89.7k</td>
                    </tr>
                    <tr>
                        <td><strong>🌽 Milho (60kg)</strong></td>
                        <td><strong>R$ 68,90</strong></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-0.5%</span></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-1.8%</span></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-3.4%</span></td>
                        <td>R$ 78,20</td>
                        <td>R$ 62,10</td>
                        <td>132.5k</td>
                    </tr>
                    <tr>
                        <td><strong>🌾 Trigo (60kg)</strong></td>
                        <td><strong>R$ 95,60</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+0.9%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+1.5%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+4.2%</span></td>
                        <td>R$ 102,30</td>
                        <td>R$ 85,70</td>
                        <td>28.3k</td>
                    </tr>
                    <tr>
                        <td><strong>🌸 Algodão (@15kg)</strong></td>
                        <td><strong>R$ 187,40</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+2.1%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+3.7%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+8.9%</span></td>
                        <td>R$ 198,50</td>
                        <td>R$ 145,20</td>
                        <td>18.9k</td>
                    </tr>
                    <tr>
                        <td><strong>🐄 Boi Gordo (@)</strong></td>
                        <td><strong>R$ 312,80</strong></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-0.3%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+0.8%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+2.5%</span></td>
                        <td>R$ 328,90</td>
                        <td>R$ 285,40</td>
                        <td>64.1k</td>
                    </tr>
                    <tr>
                        <td><strong>🍚 Arroz (50kg)</strong></td>
                        <td><strong>R$ 89,50</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+1.2%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+2.8%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+6.3%</span></td>
                        <td>R$ 94,70</td>
                        <td>R$ 76,20</td>
                        <td>22.7k</td>
                    </tr>
                    <tr>
                        <td><strong>🧈 Leite (Litro)</strong></td>
                        <td><strong>R$ 2,48</strong></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+0.4%</span></td>
                        <td><span style="color: #2ecc71; font-weight: 600;">+1.1%</span></td>
                        <td><span style="color: #e74c3c; font-weight: 600;">-0.8%</span></td>
                        <td>R$ 2,65</td>
                        <td>R$ 2,18</td>
                        <td>156.3k</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px; padding: 16px; background: rgba(52, 152, 219, 0.1); border-left: 4px solid #3498db; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i data-lucide="info" style="width: 20px; height: 20px; color: #3498db;"></i>
                <div>
                    <strong style="color: #3498db;">Dados Informativos</strong>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--text-secondary);">
                        Cotações atualizadas a cada 15 minutos. Valores meramente ilustrativos. Para negociações reais, consulte fontes oficiais como B3, Cepea e Esalq.
                    </p>
                </div>
            </div>
        </div>
    `;
}

function refreshMarketData() {
    UI.showToast('Atualizando cotações...', 'info');
    setTimeout(() => {
        UI.showToast('Cotações atualizadas com sucesso!', 'success');
    }, 1500);
}

function exportMarketData() {
    UI.showToast('Exportando dados do mercado...', 'success');
}

function renderNewsPage(container) {
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>📰 Notícias do Agronegócio</h1>
                <p>Fique por dentro das últimas notícias e tendências do setor</p>
            </div>
            <button class="btn-secondary" onclick="refreshNews()">
                <i data-lucide="refresh-cw"></i>
                Atualizar
            </button>
        </div>
        
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div class="stat-card">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="stat-icon bg-blue">
                        <i data-lucide="newspaper"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 14px; margin-bottom: 4px;">Notícias Hoje</h3>
                        <div class="stat-value" style="font-size: 28px;">24</div>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="stat-icon bg-green">
                        <i data-lucide="trending-up"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 14px; margin-bottom: 4px;">Destaques</h3>
                        <div class="stat-value" style="font-size: 28px;">8</div>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="stat-icon bg-orange">
                        <i data-lucide="bookmark"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 14px; margin-bottom: 4px;">Salvos</h3>
                        <div class="stat-value" style="font-size: 28px;">12</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="tabs-container">
            <div class="tabs-nav">
                <button class="tab-btn active" data-tab="all">Todas</button>
                <button class="tab-btn" data-tab="commodities">Commodities</button>
                <button class="tab-btn" data-tab="tech">Tecnologia</button>
                <button class="tab-btn" data-tab="sustainability">Sustentabilidade</button>
                <button class="tab-btn" data-tab="market">Mercado</button>
            </div>
            
            <div class="tab-content active" id="all">
                <div id="newsContainer" style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="text-align: center; padding: 60px 20px;">
                        <i data-lucide="loader" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 16px; animation: spin 1s linear infinite;"></i>
                        <p style="color: var(--text-secondary);">Carregando notícias do agronegócio...</p>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="commodities">
                <div class="empty-state">
                    <i data-lucide="package"></i>
                    <h3>Notícias de Commodities</h3>
                    <p>Carregue as notícias para ver conteúdo específico sobre commodities</p>
                </div>
            </div>
            
            <div class="tab-content" id="tech">
                <div class="empty-state">
                    <i data-lucide="cpu"></i>
                    <h3>Tecnologia no Agro</h3>
                    <p>Carregue as notícias para ver inovações tecnológicas</p>
                </div>
            </div>
            
            <div class="tab-content" id="sustainability">
                <div class="empty-state">
                    <i data-lucide="leaf"></i>
                    <h3>Sustentabilidade</h3>
                    <p>Carregue as notícias para ver práticas sustentáveis</p>
                </div>
            </div>
            
            <div class="tab-content" id="market">
                <div class="empty-state">
                    <i data-lucide="trending-up"></i>
                    <h3>Análise de Mercado</h3>
                    <p>Carregue as notícias para ver análises econômicas</p>
                </div>
            </div>
        </div>
    `;
    
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            container.querySelector(`#${targetTab}`).classList.add('active');
        });
    });
    
    setTimeout(() => loadNewsFromGoogle(), 1000);
}

async function loadNewsFromGoogle() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    try {
        const mockNews = [
            {
                title: "Safra de café no Brasil deve crescer 10% em 2025, prevê Conab",
                description: "Condições climáticas favoráveis e investimento em tecnologia impulsionam produção nacional. Exportações também devem aumentar significativamente.",
                source: "Canal Rural",
                time: "Há 2 horas",
                image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=250&fit=crop",
                category: "commodities",
                url: "https://www.canalrural.com.br/noticias/cafe/"
            },
            {
                title: "Uso de drones na agricultura aumenta produtividade em até 25%",
                description: "Estudo mostra que tecnologia de precisão está revolucionando o monitoramento de lavouras e reduzindo custos operacionais.",
                source: "Globo Rural",
                time: "Há 4 horas",
                image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop",
                category: "tech",
                url: "https://revistagloborural.globo.com/tecnologia/"
            },
            {
                title: "Preço da soja recua 2% na Bolsa de Chicago após dados de safra",
                description: "Mercado reage à divulgação de números da produção norte-americana. Analistas avaliam impacto nos preços brasileiros.",
                source: "Valor Econômico",
                time: "Há 5 horas",
                image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop",
                category: "market",
                url: "https://valor.globo.com/agronegocios/"
            },
            {
                title: "Práticas sustentáveis no agro podem gerar créditos de carbono",
                description: "Programa governamental incentiva produtores a adotarem técnicas que reduzem emissões e geram renda adicional.",
                source: "BBC Brasil",
                time: "Há 6 horas",
                image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=250&fit=crop",
                category: "sustainability",
                url: "https://www.bbc.com/portuguese/topics/c2dwq9zyv4yt"
            },
            {
                title: "Exportações do agronegócio batem recorde histórico em novembro",
                description: "Setor registra US$ 14,2 bilhões em vendas externas, puxado por soja, carnes e café. China continua como principal destino.",
                source: "Estadão",
                time: "Há 8 horas",
                image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop",
                category: "market",
                url: "https://www.estadao.com.br/economia/negocios/agronegocios/"
            },
            {
                title: "Inteligência Artificial otimiza uso de defensivos agrícolas",
                description: "Startups desenvolvem sistemas que identificam pragas e doenças em tempo real, reduzindo uso de agrotóxicos em até 40%.",
                source: "InfoMoney",
                time: "Há 10 horas",
                image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=250&fit=crop",
                category: "tech",
                url: "https://www.infomoney.com.br/mercados/agronegocio/"
            },
            {
                title: "Milho atinge maior cotação em 3 meses no mercado brasileiro",
                description: "Alta é atribuída à redução de estoques e aumento da demanda interna. Produtores celebram valorização.",
                source: "Agência Brasil",
                time: "Há 12 horas",
                image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop",
                category: "commodities",
                url: "https://agenciabrasil.ebc.com.br/economia/agronegocio"
            },
            {
                title: "Pecuária regenerativa ganha espaço entre grandes produtores",
                description: "Método que combina produção animal com recuperação de pastagens mostra resultados econômicos e ambientais positivos.",
                source: "Revista Globo Rural",
                time: "Há 1 dia",
                image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=250&fit=crop",
                category: "sustainability",
                url: "https://revistagloborural.globo.com/sustentabilidade/"
            }
        ];
        
        newsContainer.innerHTML = mockNews.map(news => `
            <article class="news-card" onclick="openNews('${news.url}')">
                <img src="${news.image}" alt="${news.title}" class="news-card-image" onerror="this.src='https://via.placeholder.com/240x160/1a1f2e/8b95a5?text=Sem+Imagem'">
                <div class="news-card-content">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
                        <span class="status-badge ${getCategoryBadgeClass(news.category)}">${getCategoryLabel(news.category)}</span>
                        <span style="font-size: 12px; color: var(--text-muted);">${news.source} • ${news.time}</span>
                    </div>
                    <h3 class="news-card-title">${news.title}</h3>
                    <p class="news-card-description">${news.description}</p>
                    <div class="news-card-actions">
                        <a href="${news.url}" target="_blank" class="btn-sm btn-primary" onclick="event.stopPropagation();" style="text-decoration: none;">
                            <i data-lucide="external-link"></i>
                            <span>Ler Notícia</span>
                        </a>
                        <button class="btn-sm btn-secondary" onclick="event.stopPropagation(); saveNews('${news.title}')">
                            <i data-lucide="bookmark"></i>
                            <span class="btn-text">Salvar</span>
                        </button>
                        <button class="btn-sm btn-secondary" onclick="event.stopPropagation(); shareNews('${news.title}')">
                            <i data-lucide="share-2"></i>
                            <span class="btn-text">Compartilhar</span>
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
        
        lucide.createIcons();
        
        const cards = newsContainer.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        newsContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="alert-circle"></i>
                <h3>Erro ao carregar notícias</h3>
                <p>Não foi possível carregar as notícias. Tente novamente mais tarde.</p>
                <button class="btn-primary" onclick="loadNewsFromGoogle()">
                    <i data-lucide="refresh-cw"></i>
                    Tentar Novamente
                </button>
            </div>
        `;
        lucide.createIcons();
    }
}

function getCategoryBadgeClass(category) {
    const classes = {
        commodities: 'high',
        tech: 'active',
        sustainability: 'paid',
        market: 'medium'
    };
    return classes[category] || 'active';
}

function getCategoryLabel(category) {
    const labels = {
        commodities: 'Commodities',
        tech: 'Tecnologia',
        sustainability: 'Sustentabilidade',
        market: 'Mercado'
    };
    return labels[category] || 'Geral';
}

function refreshNews() {
    UI.showToast('Atualizando notícias...', 'info');
    loadNewsFromGoogle();
}

function openNews(url) {
    window.open(url, '_blank');
}

function saveNews(title) {
    UI.showToast(`Notícia "${title.substring(0, 30)}..." salva com sucesso!`, 'success');
}

function shareNews(title) {
    UI.showToast(`Compartilhando: "${title.substring(0, 30)}..."`, 'info');
}

function renderCoursesPage(container) {
    container.innerHTML = `
        <div class="content-header">
            <div>
                <h1>🎓 Capacitação</h1>
                <p>Cursos, treinamentos e materiais educacionais</p>
            </div>
            <button class="btn-primary" onclick="showAllCourses()">
                <i data-lucide="book-open"></i>
                Ver Todos os Cursos
            </button>
        </div>
        
        <div class="stats-grid-enhanced">
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Cursos Concluídos</h4>
                    <div class="value">12</div>
                    <div class="stat-change positive">
                        <i data-lucide="trending-up"></i>
                        <span>+3 este mês</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #2ecc71; --accent-color-bg: rgba(46, 204, 113, 0.1);">
                    <i data-lucide="check-circle"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Em Andamento</h4>
                    <div class="value">4</div>
                    <div class="stat-change">
                        <i data-lucide="play-circle"></i>
                        <span>Progresso médio: 65%</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #f39c12; --accent-color-bg: rgba(243, 156, 18, 0.1);">
                    <i data-lucide="clock"></i>
                </div>
            </div>
            
            <div class="stat-card-enhanced">
                <div class="stat-content">
                    <h4>Certificados</h4>
                    <div class="value">8</div>
                    <div class="stat-change">
                        <i data-lucide="award"></i>
                        <span>Disponíveis para download</span>
                    </div>
                </div>
                <div class="stat-icon-wrapper" style="--accent-color: #9b59b6; --accent-color-bg: rgba(155, 89, 182, 0.1);">
                    <i data-lucide="award"></i>
                </div>
            </div>
        </div>
        
        <div class="tabs-container">
            <div class="tabs-nav">
                <button class="tab-btn active" data-tab="ongoing">Em Andamento</button>
                <button class="tab-btn" data-tab="available">Disponíveis</button>
                <button class="tab-btn" data-tab="completed">Concluídos</button>
                <button class="tab-btn" data-tab="certificates">Certificados</button>
            </div>
            
            <div class="tab-content active" id="ongoing">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
                    <div class="course-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <div style="height: 160px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="sprout" style="width: 64px; height: 64px; color: white;"></i>
                        </div>
                        <div style="padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <span class="status-badge medium">Em Progresso</span>
                                <span style="font-size: 12px; color: var(--text-muted);">65% completo</span>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 18px;">Manejo Integrado de Pragas</h4>
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Técnicas avançadas para controle sustentável de pragas agrícolas</p>
                            <div style="margin-bottom: 16px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
                                    <span>Progresso</span>
                                    <span style="color: var(--primary); font-weight: 600;">65%</span>
                                </div>
                                <div style="height: 6px; background: var(--border-color); border-radius: 10px; overflow: hidden;">
                                    <div style="width: 65%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-dark));"></div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
                                <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> 8h restantes</span>
                                <span><i data-lucide="book-open" style="width: 14px; height: 14px;"></i> 12 módulos</span>
                            </div>
                            <button class="btn-primary" style="width: 100%;" onclick="continueCourse(1)">
                                <i data-lucide="play"></i>
                                Continuar Curso
                            </button>
                        </div>
                    </div>
                    
                    <div class="course-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <div style="height: 160px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="trending-up" style="width: 64px; height: 64px; color: white;"></i>
                        </div>
                        <div style="padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <span class="status-badge high">Em Progresso</span>
                                <span style="font-size: 12px; color: var(--text-muted);">42% completo</span>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 18px;">Gestão Financeira Rural</h4>
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Planejamento financeiro e controle de custos na agricultura</p>
                            <div style="margin-bottom: 16px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
                                    <span>Progresso</span>
                                    <span style="color: var(--primary); font-weight: 600;">42%</span>
                                </div>
                                <div style="height: 6px; background: var(--border-color); border-radius: 10px; overflow: hidden;">
                                    <div style="width: 42%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-dark));"></div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
                                <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> 10h restantes</span>
                                <span><i data-lucide="book-open" style="width: 14px; height: 14px;"></i> 15 módulos</span>
                            </div>
                            <button class="btn-primary" style="width: 100%;" onclick="continueCourse(2)">
                                <i data-lucide="play"></i>
                                Continuar Curso
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="available">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
                    <div class="course-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <div style="height: 160px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="droplets" style="width: 64px; height: 64px; color: white;"></i>
                        </div>
                        <div style="padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <span class="status-badge active">Novo</span>
                                <span style="font-size: 12px; color: var(--text-muted);">Gratuito</span>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 18px;">Irrigação Eficiente</h4>
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Sistemas modernos de irrigação e economia de água</p>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
                                <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> 6 horas</span>
                                <span><i data-lucide="book-open" style="width: 14px; height: 14px;"></i> 8 módulos</span>
                                <span><i data-lucide="users" style="width: 14px; height: 14px;"></i> 234 alunos</span>
                            </div>
                            <button class="btn-primary" style="width: 100%;" onclick="startCourse(3)">
                                <i data-lucide="play"></i>
                                Iniciar Curso
                            </button>
                        </div>
                    </div>
                    
                    <div class="course-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <div style="height: 160px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="leaf" style="width: 64px; height: 64px; color: white;"></i>
                        </div>
                        <div style="padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <span class="status-badge high">Recomendado</span>
                            </div>
                            <h4 style="margin: 0 0 8px 0; font-size: 18px;">Agricultura Orgânica</h4>
                            <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">Certificação e práticas de cultivo orgânico sustentável</p>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
                                <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> 12 horas</span>
                                <span><i data-lucide="book-open" style="width: 14px; height: 14px;"></i> 18 módulos</span>
                                <span><i data-lucide="users" style="width: 14px; height: 14px;"></i> 567 alunos</span>
                            </div>
                            <button class="btn-primary" style="width: 100%;" onclick="startCourse(4)">
                                <i data-lucide="play"></i>
                                Iniciar Curso
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="completed">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Categoria</th>
                                <th>Data de Conclusão</th>
                                <th>Nota Final</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Análise de Solo Avançada</strong></td>
                                <td><span class="status-badge high">Técnico</span></td>
                                <td>15/11/2024</td>
                                <td><span style="color: var(--primary); font-weight: 600;">9.2</span></td>
                                <td>
                                    <button class="btn-sm btn-secondary" onclick="viewCertificate(1)">
                                        <i data-lucide="award"></i>
                                        Certificado
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Tecnologias Agrícolas Digitais</strong></td>
                                <td><span class="status-badge active">Inovação</span></td>
                                <td>02/11/2024</td>
                                <td><span style="color: var(--primary); font-weight: 600;">8.8</span></td>
                                <td>
                                    <button class="btn-sm btn-secondary" onclick="viewCertificate(2)">
                                        <i data-lucide="award"></i>
                                        Certificado
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tab-content" id="certificates">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; text-align: center;">
                        <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="award" style="width: 40px; height: 40px; color: white;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0;">Análise de Solo Avançada</h4>
                        <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 13px;">Concluído em 15/11/2024</p>
                        <button class="btn-secondary" style="width: 100%;" onclick="downloadCertificate(1)">
                            <i data-lucide="download"></i>
                            Baixar Certificado
                        </button>
                    </div>
                    
                    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; text-align: center;">
                        <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #3498db, #2980b9); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="award" style="width: 40px; height: 40px; color: white;"></i>
                        </div>
                        <h4 style="margin: 0 0 8px 0;">Tecnologias Digitais</h4>
                        <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 13px;">Concluído em 02/11/2024</p>
                        <button class="btn-secondary" style="width: 100%;" onclick="downloadCertificate(2)">
                            <i data-lucide="download"></i>
                            Baixar Certificado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            container.querySelector(`#${targetTab}`).classList.add('active');
        });
    });
}

function showAllCourses() {
    UI.showToast('Carregando catálogo completo de cursos...', 'info');
}

function continueCourse(id) {
    UI.showToast(`Continuando curso #${id}...`, 'info');
}

function startCourse(id) {
    UI.showToast(`Iniciando curso #${id}...`, 'success');
}

function viewCertificate(id) {
    UI.showToast(`Visualizando certificado #${id}...`, 'info');
}

function downloadCertificate(id) {
    UI.showToast(`Download do certificado #${id} iniciado!`, 'success');
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function viewClient(id) {
    const client = DataStore.getClients().find(c => c.id === id);
    if (!client) return;
    
    const modalContent = `
        <div style="padding: 8px 0;">
            <div style="margin-bottom: 16px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Nome da Fazenda</label>
                <p style="font-size: 16px; color: var(--text-primary); margin: 0;">${client.name}</p>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Proprietário</label>
                <p style="font-size: 16px; color: var(--text-primary); margin: 0;">${client.owner}</p>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Área (hectares)</label>
                <p style="font-size: 16px; color: var(--text-primary); margin: 0;">${client.area} ha</p>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Culturas</label>
                <p style="font-size: 16px; color: var(--text-primary); margin: 0;">${client.crops}</p>
            </div>
            <div>
                <label style="display: block; color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Status</label>
                <p style="font-size: 16px; color: var(--text-primary); margin: 0;">${client.status}</p>
            </div>
        </div>
    `;
    
    UI.showModal(`Cliente: ${client.name}`, modalContent);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setupSearchAndFilters() {
    const financialSearch = document.getElementById('financial-search');
    if (financialSearch) {
        financialSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const table = document.querySelector('.data-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    const productionSearch = document.getElementById('production-search');
    if (productionSearch) {
        productionSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const table = document.querySelector('.data-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    const inventorySearch = document.getElementById('inventory-search');
    if (inventorySearch) {
        inventorySearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const table = document.querySelector('.data-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    const clientSearch = document.getElementById('client-search');
    if (clientSearch) {
        clientSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.client-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

function editFinancialRecord(id) {
    const records = DataStore.getFinancialRecords();
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    const modalContent = `
        <form id="editFinancialForm">
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Descrição</label>
                <input type="text" id="edit-description" value="${record.description}" required 
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Valor (R$)</label>
                <input type="number" id="edit-amount" step="0.01" value="${record.amount}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
        </form>
    `;
    
    UI.showModal('Editar Lançamento', modalContent, () => saveFinancialEdit(id));
}

function saveFinancialEdit(id) {
    const description = document.getElementById('edit-description').value;
    const amount = parseFloat(document.getElementById('edit-amount').value);
    
    DataStore.updateFinancialRecord(id, { description, amount });
    closeModal();
    loadPage('financial');
    UI.showToast('Lançamento atualizado!', 'success');
}

function deleteFinancialRecord(id) {
    const record = DataStore.getFinancialRecords().find(r => r.id === id);
    if (!record) return;
    
    UI.showModal(
        'Confirmar Exclusão',
        `<p>Deseja realmente excluir "<strong>${record.description}</strong>"?</p><p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Esta ação não pode ser desfeita.</p>`,
        () => {
            DataStore.deleteFinancialRecord(id);
            loadPage('financial');
            UI.showToast('Lançamento excluído!', 'success');
        }
    );
}

function editClient(id) {
    const clients = DataStore.getClients();
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    const modalContent = `
        <form id="editClientForm">
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Nome da Fazenda</label>
                <input type="text" id="edit-client-name" value="${client.name}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Proprietário</label>
                <input type="text" id="edit-client-owner" value="${client.owner}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
        </form>
    `;
    
    UI.showModal('Editar Cliente', modalContent, () => saveClientEdit(id));
}

function saveClientEdit(id) {
    const name = document.getElementById('edit-client-name').value;
    const owner = document.getElementById('edit-client-owner').value;
    
    DataStore.updateClient(id, { name, owner });
    closeModal();
    loadPage('clients');
    UI.showToast('Cliente atualizado!', 'success');
}

function deleteClient(id) {
    const client = DataStore.getClients().find(c => c.id === id);
    if (!client) return;
    
    UI.showModal(
        'Confirmar Exclusão',
        `<p>Deseja realmente excluir "<strong>${client.name}</strong>"?</p><p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Esta ação não pode ser desfeita.</p>`,
        () => {
            DataStore.deleteClient(id);
            loadPage('clients');
            UI.showToast('Cliente excluído!', 'success');
        }
    );
}

function editProductionRecord(id) {
    const records = DataStore.getProductionRecords();
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    const modalContent = `
        <form id="editProductionForm">
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Cultura</label>
                <input type="text" id="edit-production-crop" value="${record.crop}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Quantidade (kg)</label>
                <input type="number" id="edit-production-quantity" value="${record.quantity}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
        </form>
    `;
    
    UI.showModal('Editar Produção', modalContent, () => saveProductionEdit(id));
}

function saveProductionEdit(id) {
    const crop = document.getElementById('edit-production-crop').value;
    const quantity = parseInt(document.getElementById('edit-production-quantity').value);
    
    DataStore.updateProduction(id, { crop, quantity });
    closeModal();
    loadPage('production');
    UI.showToast('Registro de produção atualizado!', 'success');
}

function deleteProductionRecord(id) {
    const record = DataStore.getProductionRecords().find(r => r.id === id);
    if (!record) return;
    
    UI.showModal(
        'Confirmar Exclusão',
        `<p>Deseja realmente excluir o registro de "<strong>${record.crop}</strong>"?</p><p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Esta ação não pode ser desfeita.</p>`,
        () => {
            DataStore.deleteProduction(id);
            loadPage('production');
            UI.showToast('Registro excluído!', 'success');
        }
    );
}

function editInventoryItem(id) {
    const inventory = DataStore.getInventory();
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    
    const modalContent = `
        <form id="editInventoryForm">
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Nome do Insumo</label>
                <input type="text" id="edit-inventory-name" value="${item.name}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">Quantidade</label>
                <input type="number" id="edit-inventory-quantity" value="${item.quantity}" required
                    style="width: 100%; padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
            </div>
        </form>
    `;
    
    UI.showModal('Editar Insumo', modalContent, () => saveInventoryEdit(id));
}

function saveInventoryEdit(id) {
    const name = document.getElementById('edit-inventory-name').value;
    const quantity = parseInt(document.getElementById('edit-inventory-quantity').value);
    
    DataStore.updateInventoryItem(id, { name, quantity });
    closeModal();
    loadPage('inventory');
    UI.showToast('Insumo atualizado!', 'success');
}

function deleteInventoryItem(id) {
    const item = DataStore.getInventory().find(i => i.id === id);
    if (!item) return;
    
    UI.showModal(
        'Confirmar Exclusão',
        `<p>Deseja realmente excluir "<strong>${item.name}</strong>"?</p><p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Esta ação não pode ser desfeita.</p>`,
        () => {
            DataStore.deleteInventoryItem(id);
            loadPage('inventory');
            UI.showToast('Insumo excluído!', 'success');
        }
    );
}

window.DataStore = DataStore;
window.UI = UI;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.showAddClientModal = showAddClientModal;
window.showAddFinancialModal = showAddFinancialModal;
window.getStatusLabel = getStatusLabel;
window.showAddProductionModal = showAddProductionModal;
window.getQualityLabel = getQualityLabel;
window.showAddInventoryModal = showAddInventoryModal;
window.showEditProfileModal = showEditProfileModal;
window.downloadCertificate = downloadCertificate;
window.closeModal = closeModal;
window.viewClient = viewClient;
window.editFinancialRecord = editFinancialRecord;
window.deleteFinancialRecord = deleteFinancialRecord;
window.editClient = editClient;
window.deleteClient = deleteClient;
window.editProductionRecord = editProductionRecord;
window.deleteProductionRecord = deleteProductionRecord;
window.editInventoryItem = editInventoryItem;
window.deleteInventoryItem = deleteInventoryItem;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.cursor = 'pointer';
        userMenu.addEventListener('click', () => {
            loadPage('profile');
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            const profileLink = document.querySelector('.nav-link[data-page="profile"]');
            if (profileLink) profileLink.classList.add('active');
        });
    }
});
