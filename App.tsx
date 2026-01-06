
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './db';
import { User, UserRole, AppTab, Transaction, Material } from './types';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TransactionForm from './components/TransactionForm';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import UserManagementView from './components/UserManagementView';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Initialize DB and Master Admin
  useEffect(() => {
    const init = async () => {
      try {
        // Check if master exists
        const master = await db.users.get('master-id-451977');
        if (!master) {
          await db.users.add({
            id: 'master-id-451977',
            ficha: '451977',
            name: 'Administrador Master',
            password: 'inventarios2025',
            role: UserRole.MASTER,
            createdAt: new Date().toISOString()
          });
        }

        // Seed materials if empty
        const matCount = await db.materials.count();
        if (matCount === 0) {
          const defaults = [
            "Vida Suero Oral", "Espejos Vaginales", "Laminillas", "Citobrush",
            "Prueba Rápida - Hepatitis B", "Prueba Rápida - Hepatitis C",
            "Prueba Rápida - VIH/Sífilis", "Prueba Rápida - Antígeno Prostático"
          ];
          await db.materials.bulkAdd(defaults.map(name => ({ name })));
        }

        // Simulate professional sync animation
        setTimeout(() => setLoading(false), 2500);
      } catch (err) {
        console.error("Initialization error", err);
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <SplashScreen />;

  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={currentUser.role} 
        onLogout={handleLogout}
        userName={currentUser.name}
      />

      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 relative animate-enter">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Tablero de Control'}
              {activeTab === 'entrada' && 'Registrar Entrada'}
              {activeTab === 'salida' && 'Registrar Salida'}
              {activeTab === 'reportes' && 'Reportes y Auditoría'}
              {activeTab === 'config' && 'Configuración de Catálogo'}
              {activeTab === 'users' && 'Gestión de Usuarios'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'dashboard' && 'Bienvenido al centro de mando MedPreventiva Pro.'}
              {activeTab === 'entrada' && 'Incorpore nuevos materiales al stock actual.'}
              {activeTab === 'salida' && 'Gestione la distribución de insumos.'}
              {activeTab === 'reportes' && 'Analice movimientos y niveles de inventario.'}
              {activeTab === 'config' && 'Administre el catálogo maestro de materiales.'}
              {activeTab === 'users' && 'Control total de accesos y jerarquías.'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
             <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
               {currentUser.role}
             </span>
             <span className="text-slate-400">|</span>
             <span className="text-slate-500 font-semibold">{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long' })}</span>
          </div>
        </header>

        <section className="pb-12">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'entrada' && (
            <TransactionForm 
              type="ENTRADA" 
              userId={currentUser.id} 
              onSuccess={() => showToast('Entrada registrada con éxito')} 
            />
          )}
          {activeTab === 'salida' && (
            <TransactionForm 
              type="SALIDA" 
              userId={currentUser.id} 
              onSuccess={() => showToast('Salida registrada con éxito')} 
            />
          )}
          {activeTab === 'reportes' && (
            <ReportsView 
              showToast={showToast}
            />
          )}
          {activeTab === 'config' && <SettingsView showToast={showToast} />}
          {activeTab === 'users' && <UserManagementView currentUser={currentUser} showToast={showToast} />}
        </section>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </main>
    </div>
  );
};

export default App;
