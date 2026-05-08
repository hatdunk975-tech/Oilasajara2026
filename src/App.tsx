/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { User, Heart, ChevronDown, Calendar, X, Info, MapPin, Briefcase } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';

// --- Types ---
type Person = {
  id: string;
  name: string;
  birthYear?: string;
  gender: 'male' | 'female';
  isUser?: boolean;
  relation: string;
  bio?: string;
  location?: string;
  occupation?: string;
};

type NodeConfig = {
  person: Person;
  spouse?: Person;
  children?: NodeConfig[];
};

// --- Data ---
const FAMILY_DATA: NodeConfig = {
  person: { 
    id: 'gg-grandpa', 
    name: 'Inomjon', 
    relation: 'Katta Bobo', 
    birthYear: 'Nomaʼlum', 
    gender: 'male',
    location: 'Oltiariq',
    occupation: 'Dehqon bozor oqsoli'
  },
  children: [
    {
      person: { 
        id: 'g-grandpa', 
        name: 'Umarxon Inamov', 
        relation: 'Boboning dadasi', 
        birthYear: 'Nomaʼlum', 
        gender: 'male',
        location: 'Fargʻona'
      },
      children: [
        {
          person: { id: 'grandpa', name: 'Mahmudjon Inamov', relation: 'Bobo', birthYear: 'Nomaʼlum', gender: 'male' },
          spouse: { id: 'grandma', name: 'Lobarxon', relation: 'Buvi', birthYear: 'Nomaʼlum', gender: 'female' },
          children: [
            {
              person: { id: 'dad', name: 'Sohibjon Inamov', relation: 'Dada', birthYear: '1990', gender: 'male' },
              spouse: { id: 'mom', name: 'Muazzamxon Akramova', relation: 'Oyi', birthYear: '1995', gender: 'female' },
              children: [
                { person: { id: 'ali', name: 'Ali Mahmudjonov', relation: 'Men', birthYear: '2013', gender: 'male', isUser: true, occupation: 'Dasturchi' } },
                { person: { id: 'ahmad', name: 'Ahmad Mahmudjonov', relation: 'Uka', birthYear: '2015', gender: 'male' } },
                { person: { id: 'mfotih', name: 'Muhammadfotih Mahmudjonov', relation: 'Uka', birthYear: '2018', gender: 'male' } },
                { person: { id: 'mrizo', name: 'Muhammadrizo Mahmudjonov', relation: 'Uka', birthYear: '2020', gender: 'male' } },
                { person: { id: 'fotima', name: 'Fotima Mahmudjonova', relation: 'Singil', birthYear: '2023', gender: 'female' } },
              ]
            },
            { person: { id: 'uncle1', name: 'Foziljon Inamov', relation: 'Amaki', birthYear: '1983', gender: 'male' } },
            { person: { id: 'uncle2', name: 'Tolibjon Inamov', relation: 'Amaki', birthYear: '1986', gender: 'male' } },
          ]
        }
      ]
    }
  ]
};

// --- Components ---

const PersonCard = ({ person, onSelect }: { person: Person; onSelect: (p: Person) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onSelect(person)}
      className={`glass-card relative flex flex-col p-4 w-48 rounded-2xl cursor-pointer ${
        person.isUser ? 'ring-2 ring-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : ''
      }`}
      id={`card-${person.id}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${
          person.gender === 'male' ? 'bg-blue-900/50 text-blue-300' : 'bg-pink-900/50 text-pink-300'
        }`}>
          <User size={20} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-blue-400/70 font-medium truncate">
            {person.relation}
          </p>
          <p className="font-serif text-base leading-tight font-medium text-white truncate">
            {person.name}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-slate-400/60">
        <Calendar size={12} />
        <span className="text-[10px] font-mono tracking-tighter">{person.birthYear || 'Nomaʼlum'}</span>
      </div>

      {person.isUser && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg shadow-blue-500/40">
          Siz
        </div>
      )}
    </motion.div>
  );
};

const NodeRow = ({ node, onSelect }: { node: NodeConfig; onSelect: (p: Person) => void }) => {
  const hasSpouse = !!node.spouse;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative flex items-center gap-8">
        <PersonCard person={node.person} onSelect={onSelect} />
        
        {hasSpouse && (
          <>
            <div className="relative flex items-center justify-center">
              <div className="h-[1px] w-8 bg-gradient-to-r from-blue-500/50 via-rose-500/50 to-rose-500/50" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute text-rose-500 bg-[#050B18] rounded-full p-1 border border-rose-500/30"
              >
                <Heart size={14} fill="currentColor" />
              </motion.div>
            </div>
            <PersonCard person={node.spouse!} onSelect={onSelect} />
          </>
        )}
      </div>

      {hasChildren && (
        <div className="relative w-full">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            className="w-[1px] bg-gradient-to-b from-[#F59E0B]/80 to-[#F59E0B]/40 mx-auto"
          />
          
          {node.children!.length > 1 && (
             <div className="absolute top-[48px] left-[10%] right-[10%] h-[1px] bg-[#F59E0B]/30 overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                 className="h-full w-1/4 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent blur-sm"
               />
             </div>
          )}

          <div className="flex items-start justify-center gap-8 pt-12 px-12">
            {node.children!.map((child, idx) => (
              <div key={child.person.id} className="relative flex flex-col items-center">
                {node.children!.length > 1 && (
                   <div className="absolute -top-12 h-12 w-[1px] bg-[#F59E0B]/30 overflow-hidden">
                      <motion.div 
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear', delay: idx * 0.4 }}
                        className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#F59E0B] to-transparent blur-sm"
                      />
                   </div>
                )}
                <NodeRow node={child} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailModal = ({ person, onClose }: { person: Person; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-md overflow-hidden rounded-3xl"
      >
        <div className="relative h-32 bg-gradient-to-br from-blue-600/30 to-[#F59E0B]/20">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-10 left-8 p-1 rounded-2xl bg-[#050B18] border border-blue-400/20">
            <div className={`p-4 rounded-xl ${
              person.gender === 'male' ? 'bg-blue-900/50 text-blue-300' : 'bg-pink-900/50 text-pink-300'
            }`}>
              <User size={40} />
            </div>
          </div>
        </div>

        <div className="p-8 pt-14 space-y-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white mb-1">{person.name}</h2>
            <p className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">
              {person.relation} {person.isUser && "• Siz"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Calendar size={18} className="text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Yil</p>
                <p className="text-sm font-mono text-white">{person.birthYear || '---'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <MapPin size={18} className="text-amber-500" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Manzil</p>
                <p className="text-sm text-white">{person.location || '---'}</p>
              </div>
            </div>
          </div>

          {person.occupation && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Briefcase size={18} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Kasbi / Maʼlumoti</p>
                <p className="text-sm text-white">{person.occupation}</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-slate-400 text-sm leading-relaxed italic">
            <Info size={16} className="mb-2 text-blue-400/60" />
            Bu shajara aʼzosi boʻyicha arxiv maʼlumotlari tekshirilgan.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const constraintsRef = useRef(null);

  useMemo(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen grid-background relative overflow-hidden bg-[#050B18]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F59E0B]/5 rounded-full blur-[140px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 p-8 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-2 pointer-events-auto inline-block"
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-[0.2em] text-[#F59E0B] uppercase">
            Mahmudjonovlar <span className="text-white border-b border-[#F59E0B]/30 pb-2">oilasi</span>
          </h1>
          <p className="text-blue-400 font-sans tracking-[0.3em] uppercase text-[10px] font-semibold opacity-80">
            Digital Genealogy Archive • Heritage
          </p>
        </motion.div>
      </header>

      {/* Main Draggable Workspace */}
      <main className="h-screen w-screen overflow-hidden cursor-grab active:cursor-grabbing" ref={constraintsRef}>
        <motion.div
          drag
          dragConstraints={constraintsRef}
          initial={{ opacity: 0, x: 0, y: 150 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className="p-40 flex justify-center items-start min-w-[3000px] select-none"
        >
          <NodeRow node={FAMILY_DATA} onSelect={setSelectedPerson} />
        </motion.div>
      </main>

      <footer className="fixed bottom-8 left-0 right-0 pointer-events-none z-40">
        <div className="max-w-7xl mx-auto flex justify-between px-8 text-[9px] uppercase tracking-[0.2em] text-blue-400/40">
          <div className="pointer-events-auto">Shajara surish uchun ekranni bosing va torting</div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-bold text-blue-400/60">
              Yaratgan odam: Ali Mahmudjonov 2013
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
              Siz: Ali
            </span>
            <span>Root ID: #10023-UMR</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedPerson && (
          <DetailModal 
            person={selectedPerson} 
            onClose={() => setSelectedPerson(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

