/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  AlertCircle, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronRight,
  Clock,
  User,
  ShieldCheck,
  Send,
  MoreHorizontal,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { classifyMessage } from './services/aiService';
import { MOCK_PATIENTS, INITIAL_TASKS } from './constants';
import { Priority, TaskStatus, UserRole, ClinicalTask, MessageCategory } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, role: UserRole} | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<ClinicalTask[]>(INITIAL_TASKS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [lastNotification, setLastNotification] = useState<{title: string, body: string} | null>(null);

  const handleLogin = (username: string) => {
    if (username.toLowerCase() === 'fredmascarenhas') {
      setCurrentUser({ name: 'Dr. Fred Mascarenhas', role: UserRole.MEDICO });
      setActiveTab('dashboard');
    } else {
      setCurrentUser({ name: 'Júlia (Secretária)', role: UserRole.SECRETARIA });
      setActiveTab('tasks');
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const stats = {
    urgente: tasks.filter(t => t.priority === Priority.URGENTE && t.status !== TaskStatus.RESOLVIDA).length,
    total: tasks.filter(t => t.status !== TaskStatus.RESOLVIDA).length,
    concluidas: tasks.filter(t => t.status === TaskStatus.RESOLVIDA).length,
  };

  const handleSimulateMessage = async (text?: string) => {
    const msg = text || newMessage;
    if (!msg.trim()) return;

    setIsProcessing(true);
    setNewMessage('');
    
    try {
      const result = await classifyMessage(msg);
      
      const newTask: ClinicalTask = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: MOCK_PATIENTS.find(p => p.fullName.toLowerCase().includes(result.paciente.nome?.toLowerCase() || ''))?.id,
        title: result.resumo,
        description: result.acao_sugerida,
        category: result.categoria as unknown as MessageCategory,
        priority: result.prioridade as unknown as Priority,
        status: TaskStatus.NOVA,
        assignedRole: result.responsavel_sugerido as unknown as UserRole,
        createdAt: new Date().toISOString(),
        messageId: 'simulated-' + Date.now(),
        symptoms: result.dados_extraidos.sintomas,
        medications: result.dados_extraidos.medicamentos
      };

      setTasks(prev => [newTask, ...prev]);
      setLastNotification({
        title: `Nova mensagem: ${result.categoria}`,
        body: result.resumo
      });

      if (result.prioridade === Priority.URGENTE) {
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resolveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: TaskStatus.RESOLVIDA } : t));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#0A0B0D] text-gray-300 font-sans">
      {/* Sidebar - Elegant Dark Style */}
      <aside className="w-64 bg-[#14161A] text-gray-400 flex flex-col border-r border-white/5">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg text-white tracking-tight">OncoFlow AI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {currentUser?.role === UserRole.MEDICO && (
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              badge={stats.urgente > 0 ? stats.urgente : undefined}
              badgeColor="bg-red-500"
            />
          )}
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="Minhas Tarefas" 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            badge={stats.total}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Pacientes" 
            active={activeTab === 'patients'} 
            onClick={() => setActiveTab('patients')} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="WhatsApp Mirror" 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')} 
            badge={2}
            badgeColor="bg-green-500"
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <NavItem icon={<Settings size={20} />} label="Configurações" onClick={() => {}} />
          <div className="mt-4 flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {currentUser?.name.substring(0, 2)}
            </div>
            <div className="text-xs flex-1">
              <p className="text-white font-medium truncate">{currentUser?.name}</p>
              <p className="text-gray-500 capitalize">{currentUser?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-white">
              <Lock size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#0F1115] border-b border-white/5 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="pl-9 pr-4 py-1.5 bg-[#1A1C21] border border-white/10 rounded-lg text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-[#0F1115]"></span>
            </button>
            <button 
              onClick={() => handleSimulateMessage()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} />
              Novo Evento
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
      {/* Stat Cards - Elegant Dark Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          label="Alertas Críticos" 
          value={stats.urgente} 
          icon={<AlertCircle className="text-red-500" size={20} />} 
          color=""
        />
        <StatCard 
          label="Tarefas Ativas" 
          value={stats.total} 
          icon={<Clock className="text-indigo-500" size={20} />} 
          color=""
        />
        <StatCard 
          label="Concluídas hoje" 
          value={stats.concluidas} 
          icon={<CheckSquare className="text-emerald-500" size={20} />} 
          color=""
        />
      </div>

                {/* Priority Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                       Prioridade Crítica
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {tasks.filter(t => t.priority === Priority.URGENTE && t.status !== TaskStatus.RESOLVIDA).map(task => (
                      <TaskRow key={task.id} task={task} onResolve={resolveTask} />
                    ))}
                    {tasks.filter(t => t.priority === Priority.URGENTE && t.status !== TaskStatus.RESOLVIDA).length === 0 && (
                      <div className="p-8 border border-white/5 bg-white/[0.02] rounded-xl text-center text-gray-600 text-sm">
                        Nenhum alerta crítico no momento.
                      </div>
                    )}
                  </div>
                </section>

                {/* Simulation Panel */}
                <section className="bg-[#14161A] border border-white/5 rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Send size={16} className="text-indigo-500" /> Simulador de Webhook WhatsApp
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Teste a classificação da IA e geração automática de tarefas clínicas.</p>
                  <div className="flex gap-4">
                    <input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSimulateMessage()}
                      type="text" 
                      placeholder="Ex: Paciente Maria com febre de 38.5 após quimio..." 
                      className="flex-1 px-4 py-2 bg-[#0A0B0D] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                      onClick={() => handleSimulateMessage()}
                      disabled={isProcessing}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all font-semibold disabled:opacity-50 flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/20"
                    >
                      {isProcessing ? 'Processando...' : 'Enviar'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <QuickSimBtn label="Febre pós-quimio" onClick={() => handleSimulateMessage("Paciente Carlos com febre 38.5 após quimio de ontem.")} />
                    <QuickSimBtn label="Tratamento Aprovado" onClick={() => handleSimulateMessage("Convênio liberou a Imunoterapia da paciente Ana Paula.")} />
                    <QuickSimBtn label="Solicitação Relatório" onClick={() => handleSimulateMessage("A secretaria solicitou um relatório para o bevacizumabe do João.")} />
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-[#14161A] border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex gap-4">
                      <FilterBtn label="Todas" active />
                      <FilterBtn label="Minhas" />
                      <FilterBtn label="Médicas" />
                      <FilterBtn label="Urgentes" />
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {tasks.map(task => (
                      <TaskRow key={task.id} task={task} onResolve={resolveTask} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'patients' && (
              <motion.div 
                key="patients"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {MOCK_PATIENTS.map(p => (
                  <div key={p.id} className="bg-[#14161A] p-6 rounded-xl border border-white/5 shadow-xl hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-indigo-400 transition-colors">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-tight">{p.fullName}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">ID: {p.id.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <PatientInfo icon={<Clock size={14} />} label="Nascimento" value={p.birthDate} />
                      <PatientInfo icon={<ShieldCheck size={14} />} label="Convênio" value={p.healthInsurance} />
                      <div className="pt-2">
                        <p className="text-[10px] text-gray-600 uppercase font-bold mb-1.5 tracking-[0.1em]">Diagnóstico Resumido</p>
                        <p className="text-xs text-gray-400 italic line-clamp-2 leading-relaxed">"{p.diagnosisSummary}"</p>
                      </div>
                    </div>
                    <button className="mt-6 w-full text-center text-indigo-400 text-xs font-bold uppercase tracking-widest py-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2 group/btn">
                      Ver Prontuário AI <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div 
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex bg-[#0A0B0D] z-20"
              >
                {/* WhatsApp Sidebar */}
                <div className="w-80 border-r border-white/10 flex flex-col">
                  <div className="p-4 bg-[#14161A] flex items-center justify-between border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Users size={20} className="text-slate-400" />
                    </div>
                    <div className="flex gap-4 text-gray-400">
                      <Smartphone size={20} />
                      <MessageSquare size={20} />
                      <MoreVertical size={20} />
                    </div>
                  </div>
                  
                  <div className="p-2 border-b border-white/5">
                    <div className="bg-[#1A1C21] flex items-center gap-3 px-3 py-1.5 rounded-lg">
                      <Search size={14} className="text-gray-500" />
                      <input type="text" placeholder="Pesquisar conversas" className="bg-transparent border-none text-xs text-gray-300 outline-none w-full" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <ChatListItem active name="Oncologia - Equipe" lastMsg="Dr. o plano liberou a Maria..." time="23:38" unread={2} />
                    <ChatListItem name="Farmácia Central" lastMsg="Dose confirmada." time="22:15" />
                    <ChatListItem name="Secretaria / Guia" lastMsg="Precisa de laudo novo." time="Ontem" />
                  </div>
                </div>

                {/* WhatsApp Chat Area */}
                <div className="flex-1 flex flex-col relative bg-[#0A0B0D]">
                  <header className="h-16 bg-[#14161A] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">
                        OE
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white tracking-tight">Oncologia - Equipe</h4>
                        <p className="text-[10px] text-green-500 font-medium">Equipe está digitando...</p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-gray-500 text-sm">
                      <Search size={20} />
                      <Paperclip size={20} />
                      <MoreVertical size={20} />
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://w0.peakpx.com/wallpaper/580/650/wallpaper-dark-whatsapp-theme-background-patterns-whatsapp-wallpaper-dark-mode-thumbnail.jpg')] bg-repeat bg-opacity-5">
                    <MessageBubble 
                      sender="Enfermeira Ana" 
                      text="Bom dia Dr. Fred, temos uma intercorrência com o Sr. Carlos." 
                      time="23:30" 
                    />
                    <MessageBubble 
                      sender="Enfermeira Ana" 
                      text="Ele ligou relatando febre de 38.5 agora a noite. Fez o ciclo de ontem normalmente." 
                      time="23:32"
                      hasAI 
                    />
                    <MessageBubble 
                      sender="Secretária Júlia" 
                      text="Aproveitando, a paciente Maria Silva teve o pembrolizumabe autorizado hoje." 
                      time="23:35" 
                      hasAI
                    />
                    {tasks.filter(t => t.messageId.startsWith('simulated')).map(t => (
                      <MessageBubble 
                        key={t.id}
                        isMe
                        sender="Sistema AI" 
                        text={t.description} 
                        time={new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      />
                    ))}
                  </div>

                  <footer className="h-16 bg-[#14161A] p-3 flex items-center gap-4 text-gray-500">
                    <Smile size={24} />
                    <Paperclip size={24} />
                    <div className="flex-1 bg-[#1A1C21] rounded-lg px-4 py-2 flex items-center border border-white/5">
                      <input 
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSimulateMessage()}
                         type="text" 
                         placeholder="Digite uma mensagem" 
                         className="bg-transparent border-none text-sm text-gray-300 outline-none w-full" 
                      />
                    </div>
                    {newMessage ? (
                      <button onClick={() => handleSimulateMessage()} className="text-indigo-500">
                        <Send size={24} fill="currentColor" />
                      </button>
                    ) : (
                      <Mic size={24} />
                    )}
                  </footer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification */}
          <AnimatePresence>
            {lastNotification && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onAnimationComplete={() => setTimeout(() => setLastNotification(null), 5000)}
                className="fixed bottom-8 right-8 w-80 bg-[#14161A] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 flex gap-4 z-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-50 shrink-0">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{lastNotification.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lastNotification.body}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick, badge, badgeColor = "bg-indigo-600" }: { icon: any, label: string, active?: boolean, onClick: () => void, badge?: number, badgeColor?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${active ? 'bg-white/5 text-white' : 'hover:bg-white/5 text-gray-500 hover:text-gray-300'}`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 16, className: active ? 'text-indigo-400' : 'group-hover:text-white transition-colors' })}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white/80 bg-white/10 ${badgeColor === 'bg-red-500' ? 'text-red-400 bg-red-400/10' : ''}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className={`bg-[#14161A] p-6 rounded-xl border border-white/5 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.02] cursor-default group`}>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
    </div>
  );
}

function TaskRow({ task, onResolve }: { task: ClinicalTask, onResolve: (id: string) => void, key?: any }) {
  const priorityColor = {
    [Priority.URGENTE]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [Priority.ALTA]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    [Priority.ROTINA]: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    [Priority.BAIXA]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }[task.priority];

  const patient = MOCK_PATIENTS.find(p => p.id === task.patientId);

  return (
    <div className={`px-6 py-4 flex items-center justify-between transition-all hover:bg-white/[0.02] ${task.status === TaskStatus.RESOLVIDA ? 'opacity-30 grayscale' : ''}`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => onResolve(task.id)}
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${task.status === TaskStatus.RESOLVIDA ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-white/20 bg-transparent hover:border-indigo-500'}`}
        >
          {task.status === TaskStatus.RESOLVIDA && <CheckSquare size={10} className="text-white" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className={`font-medium text-sm tracking-tight ${task.status === TaskStatus.RESOLVIDA ? 'line-through text-gray-600' : 'text-white'}`}>
              {task.title}
            </h4>
            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${priorityColor} tracking-tighter`}>
              {task.priority || '!!!'}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <User size={12} className="text-gray-600" />
              <span className="font-medium underline decoration-gray-700 underline-offset-4">{patient?.fullName || 'Não Identificado'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Clock size={12} className="text-gray-600" />
              <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest">
              {task.assignedRole}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">#{task.id.substring(0, 6)}</div>
        <button className="p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded transition-all">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
}

function PatientInfo({ icon, label, value }: { icon: any, label: string, value?: string | null }) {
  return (
    <div className="flex items-center justify-between text-[11px] border-b border-white/[0.03] pb-1.5">
      <div className="flex items-center gap-2 text-gray-500">
        <span className="opacity-70">{icon}</span>
        <span className="uppercase tracking-widest text-[9px] font-semibold">{label}</span>
      </div>
      <span className="text-gray-300 font-medium truncate max-w-[150px]">{value || '-'}</span>
    </div>
  );
}

function QuickSimBtn({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-[#0A0B0D] text-gray-500 rounded border border-white/5 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
    >
      {label}
    </button>
  );
}

function FilterBtn({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`px-3 py-1 rounded text-[11px] font-semibold transition-all border ${active ? 'bg-white/5 text-white border-white/20' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
      {label}
    </button>
  );
}

function LoginPage({ onLogin }: { onLogin: (user: string) => void }) {
  const [username, setUsername] = useState('fredmascarenhas');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(username);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#14161A] border border-white/5 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-4">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">OncoFlow AI</h2>
          <p className="text-gray-500 text-sm mt-1">Plataforma de Gestão Oncológica Inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Usuário</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: fredmascarenhas"
                className="w-full bg-[#0A0B0D] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Senha</label>
              <button 
                type="button" 
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0B0D] border border-white/5 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Entrar no Sistema
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            Acesso Restrito a Colaboradores. <br/>
            Para credenciais, contate a administração.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ChatListItem({ name, lastMsg, time, unread, active, key }: { name: string, lastMsg: string, time: string, unread?: number, active?: boolean, key?: any }) {
  return (
    <div key={key} className={`flex items-center gap-3 p-3 cursor-pointer border-b border-white/[0.03] transition-colors ${active ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}>
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
        <Users size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h5 className="font-bold text-sm text-white truncate">{name}</h5>
          <span className={`text-[10px] ${unread ? 'text-green-500 font-bold' : 'text-gray-600'}`}>{time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{lastMsg}</p>
      </div>
      {unread && (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-black mt-1">
          {unread}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ sender, text, time, isMe, hasAI, key }: { sender: string, text: string, time: string, isMe?: boolean, hasAI?: boolean, key?: any }) {
  return (
    <div key={key} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[70%] rounded-xl p-3 shadow-md relative ${isMe ? 'bg-[#005C4B] text-white rounded-tr-none' : 'bg-[#14161A] text-gray-200 rounded-tl-none border border-white/5 shadow-black/20'}`}>
        {!isMe && <span className="text-[10px] font-bold text-indigo-400 mb-1 block">{sender}</span>}
        <p className="text-sm leading-relaxed">{text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[9px] text-gray-500 font-medium">{time}</span>
          {isMe && <CheckCheck size={12} className="text-blue-400" />}
        </div>
        
        {hasAI && (
          <div className="absolute -right-2 -top-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-[#0A0B0D] shadow-lg animate-pulse">
            <ShieldCheck size={10} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}


